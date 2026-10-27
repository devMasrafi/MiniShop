import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

const emptyVariant = () => ({
  color: '',
  size: '',
  stock: '0',
})

const initialForm = {
  name: '',
  price: '',
  description: '',
  category: '',
  brand: '',
  variants: [emptyVariant()],
}

const CreateProductModal = ({ onClose, onSubmit, onError }) => {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const updateVariant = (index, field, value) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }))
  }

  const addVariant = () => {
    setForm((current) => ({
      ...current,
      variants: [...current.variants, emptyVariant()],
    }))
  }

  const removeVariant = (index) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const variants = form.variants.map((variant) => ({
      color: variant.color.trim(),
      size: variant.size.trim(),
      stock: Number(variant.stock),
    }))

    if (variants.some((variant) => !variant.color || !variant.size)) {
      setFormError('Every variant needs a color and size.')
      return
    }

    if (
      variants.some(
        (variant) => !Number.isInteger(variant.stock) || variant.stock < 0
      )
    ) {
      setFormError('Stock must be a whole number of zero or more.')
      return
    }

    setSaving(true)

    try {
      await onSubmit({
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        variants,
      })
    } catch (err) {
      const message = err.message || 'Could not create product.'
      setFormError(message)
      onError?.(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-product-title"
        className="bg-canvas max-h-[90vh] w-full max-w-2xl scrollbar-none overflow-y-auto rounded-xl p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="create-product-title" className="text-xl font-bold">
              Add Product
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter the details for your new product.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="hover:bg-muted rounded-md px-2 py-1 text-xl disabled:opacity-50"
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
              Product name *
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                minLength={3}
                required
                className="border-border bg-background rounded-lg border px-3 py-2 font-normal"
                placeholder="Classic T-Shirt"
              />
            </label>

            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
              Price ($) *
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={updateField}
                min="1"
                step="0.01"
                required
                className="border-border bg-background rounded-lg border px-3 py-2 font-normal"
                placeholder="650"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
              Category *
              <input
                name="category"
                value={form.category}
                onChange={updateField}
                required
                className="border-border bg-background rounded-lg border px-3 py-2 font-normal"
                placeholder="Clothing"
              />
            </label>

            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
              Brand
              <input
                name="brand"
                value={form.brand}
                onChange={updateField}
                className="border-border bg-background rounded-lg border px-3 py-2 font-normal"
                placeholder="Brand name"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows={3}
              className="border-border bg-background resize-y rounded-lg border px-3 py-2 font-normal"
              placeholder="Describe the product..."
            />
          </label>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">Variants *</h3>
              <button
                type="button"
                onClick={addVariant}
                className="text-primary text-sm font-medium hover:underline"
              >
                + Add variant
              </button>
            </div>

            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="border-border flex flex-wrap items-end gap-3 rounded-lg border p-3"
              >
                <label className="flex min-w-24 flex-1 flex-col gap-1 text-sm">
                  Color *
                  <input
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(index, 'color', event.target.value)
                    }
                    required
                    className="border-border bg-background min-w-0 rounded-md border px-2 py-2"
                    placeholder="Black"
                  />
                </label>

                <label className="flex min-w-24 flex-1 flex-col gap-1 text-sm">
                  Size *
                  <input
                    value={variant.size}
                    onChange={(event) =>
                      updateVariant(index, 'size', event.target.value)
                    }
                    required
                    className="border-border bg-background min-w-0 rounded-md border px-2 py-2"
                    placeholder="M"
                  />
                </label>

                <label className="flex w-24 flex-col gap-1 text-sm">
                  Stock *
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(index, 'stock', event.target.value)
                    }
                    required
                    className="border-border bg-background min-w-0 rounded-md border px-2 py-2"
                  />
                </label>

                {form.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    aria-label={`Remove variant ${index + 1}`}
                    className="rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {formError && (
            <p role="alert" className="text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className="border-border flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="border-border hover:bg-muted rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default CreateProductModal
