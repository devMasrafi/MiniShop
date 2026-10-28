/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  IoCloseOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { apiFetch } from "../../utils/api";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  country: "",
  address: "",
  houseRoad: "",
  cityRegion: "",
  district: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const splitAddress = (address = "") => {
  const parts = {
    houseRoad: "",
    cityRegion: "",
    district: "",
  };

  if (!address) return parts;

  const addressParts = address.split("; ");

  addressParts.forEach((part) => {
    if (part.startsWith("House/Road: ")) {
      parts.houseRoad = part.replace("House/Road: ", "");
    } else if (part.startsWith("City/Region: ")) {
      parts.cityRegion = part.replace("City/Region: ", "");
    } else if (part.startsWith("District: ")) {
      parts.district = part.replace("District: ", "");
    }
  });

  if (
    !address.includes("House/Road: ") &&
    !address.includes("City/Region: ") &&
    !address.includes("District: ")
  ) {
    parts.houseRoad = address;
  }

  return parts;
};

const formatDateForInput = (date) => {
  if (!date) return "";

  return String(date).slice(0, 10);
};

const createProfileForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  dateOfBirth: formatDateForInput(user?.dateOfBirth),
  country: user?.country || "",
  address: user?.address || "",
  ...splitAddress(user?.address || ""),
});

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Load logged-in user's profile.
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/users/me");
        const user = response.data;

        setProfile(user);
        setForm(createProfileForm(user));
      } catch (err) {
        setError(err.message || "Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile form fields.
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Update password form fields.
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Open the modal
  const handleOpenModal = () => {
    setForm(createProfileForm(profile));
    setFormError("");
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setFormError("");
    setForm(createProfileForm(profile));
  };

  //combine the three address fields.
  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setFormError("");
    setError("");
    setSuccess("");

    try {
      const addressParts = [
        form.houseRoad.trim()
          ? `House/Road: ${form.houseRoad.trim()}`
          : "",
        form.cityRegion.trim()
          ? `City/Region: ${form.cityRegion.trim()}`
          : "",
        form.district.trim()
          ? `District: ${form.district.trim()}`
          : "",
      ].filter(Boolean);

      const address = addressParts.join("; ");


      const {
        houseRoad,
        cityRegion,
        district,
        address: previousAddress,
        ...profileFields
      } = form;

      const response = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          ...profileFields,
          address,
        }),
      });

      const updatedUser = response.data;

      setProfile(updatedUser);
      setForm(createProfileForm(updatedUser));

      if (response.jwtToken) {
        localStorage.setItem("token", response.jwtToken);
      }

      window.dispatchEvent(new Event("minishop-profile-updated"));

      setShowModal(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setFormError(err.message || "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (passwordForm.newPassword.length < 8) {
      setError("Your new password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      await apiFetch("/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      setPasswordForm(emptyPasswordForm);
      setSuccess("Your password has been changed successfully.");
    } catch (err) {
      setError(err.message || "Failed to change your password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-canvas px-4 py-3 text-inc outline-none transition focus:border-ascent";

  const labelClass = "mb-2 block text-sm font-medium text-inc";

  const displayValue = (value) => {
    return value?.trim() ? value : "Not provided yet";
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted">Loading your profile...</p>
      </div>
    );
  }

  if (!profile && error) {
    return (
      <div className="rounded-xl border border-border bg-canvas p-6">
        <p className="text-sm text-error">{error}</p>
        <p className="mt-2 text-sm text-muted">
          Please refresh the page or sign in again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-inc">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your personal information and account security.
        </p>
      </div>

      {/* Feedback messages */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600"
        >
          {success}
        </div>
      )}

      {/* Profile information and password form */}
      <div className="flex flex-col items-stretch gap-6 lg:flex-row">
        {/* Left: Profile information */}
        <section className="min-w-0 flex-1 rounded-xl border border-border bg-canvas p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ascent/10 text-ascent">
                <IoPersonOutline size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <p className="mt-1 text-sm text-muted">
                  Your account details.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenModal}
              className="rounded-lg bg-ascent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Update Profile
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5">
            <ProfileField label="Full Name" value={profile?.name} />

            <ProfileField label="Email Address" value={profile?.email} />

            <ProfileField label="Phone Number" value={profile?.phone} />

            <ProfileField
              label="Date of Birth"
              value={profile?.dateOfBirth ? formatDateForInput(profile.dateOfBirth) : ""}
            />

            <ProfileField label="Country" value={profile?.country} />

            <ProfileField label="Address" value={profile?.address} />

            <div className="border-t border-border pt-5">
              <p className="text-sm text-muted">Account Role</p>
              <p className="mt-2 inline-flex rounded-full border border-border px-3 py-1 text-sm font-medium capitalize">
                {profile?.role || "customer"}
              </p>
              <p className="mt-2 text-xs text-muted">
                Your account role cannot be changed here.
              </p>
            </div>
          </div>
        </section>

        {/* Right: Change password */}
        <section className="min-w-0 flex-1 rounded-xl border border-border bg-canvas p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ascent/10 text-ascent">
              <IoLockClosedOutline size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="mt-1 text-sm text-muted">
                Keep your account secure.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="mt-6 flex flex-col gap-5"
          >
            <div>
              <label className={labelClass} htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="Enter your current password"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="Enter your new password again"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-ascent px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IoLockClosedOutline size={18} />
              {changingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>

      {/* Edit profile modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inc/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-canvas shadow-xl"
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border p-5 sm:px-6">
              <div>
                <h2
                  id="edit-profile-title"
                  className="text-xl font-semibold"
                >
                  Update Profile
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Update your personal details below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                aria-label="Close profile editor"
                className="rounded-lg p-2 text-muted transition hover:bg-ascent/10 hover:text-inc disabled:opacity-50"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            {/* Scrollable modal body */}
            <form
              onSubmit={handleProfileSubmit}
              className="flex min-h-0 flex-col"
            >
              <div
                className="flex flex-col gap-5 overflow-y-auto p-5 sm:p-6"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {formError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error"
                  >
                    {formError}
                  </div>
                )}

                <div>
                  <label className={labelClass} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="min-w-0 flex-1">
                    <label className={labelClass} htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <label className={labelClass} htmlFor="dateOfBirth">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleProfileChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Enter your country"
                  />
                </div>

                {/* Address fields */}
                <div className="border-t border-border pt-5">
                  <h3 className="font-semibold">Address Details</h3>
                  <p className="mt-1 text-sm text-muted">
                    Add the parts of your address separately.
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="houseRoad">
                    House / Road
                  </label>
                  <input
                    id="houseRoad"
                    name="houseRoad"
                    type="text"
                    value={form.houseRoad}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="House number, building, road"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="cityRegion">
                    City / Region
                  </label>
                  <input
                    id="cityRegion"
                    name="cityRegion"
                    type="text"
                    value={form.cityRegion}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Enter your city or region"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="district">
                    District
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={form.district}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Enter your district"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-lg border border-border px-5 py-3 font-medium transition hover:bg-ascent/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-ascent px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <IoSaveOutline size={18} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

// Reusable profile information row.
const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-1 wrap-break-word text-sm font-medium text-inc">
      {value?.toString().trim() || "Not provided yet"}
    </p>
  </div>
);

export default ProfileSettings;