import MetricCard from '../../component/CardComponents/MetricCard'
import { IoWalletOutline } from 'react-icons/io5'
import { FiShoppingBag } from 'react-icons/fi'
import { CiTimer } from 'react-icons/ci'
import { useOutletContext } from 'react-router'

const OverView = () => {
  const userData = useOutletContext()

  return (
    <main className="flex flex-col gap-6">
      <section>
        <h1 className="text-inc text-2xl font-semibold capitalize">
          Welcome, {userData.name}{' '}
        </h1>
        <p className="text-inc/50 mt-1 text-sm">
          Here's how your store is performing.
        </p>
      </section>

      <section className="flex flex-col gap-6 xl:flex-row">
        <div className="flex flex-col gap-4">
          <MetricCard
            mainData="2450"
            headings="Total Revenue"
            text="Last 30 days"
            icon={<IoWalletOutline />}
            value="$"
            variant="primary"
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex min-w-0 flex-1">
              <MetricCard
                mainData="353"
                headings="Total Orders"
                text="Orders in the last 30 days"
                icon={<FiShoppingBag />}
              />
            </div>

            <div className="flex min-w-0 flex-1 text-nowrap">
              <MetricCard
                mainData="30"
                headings="Unconfirmed Orders"
                text="Awaiting confirmation"
                icon={<CiTimer />}
              />
            </div>
          </div>
        </div>

        <div className="border-border bg-canvas min-w-0 flex-1 rounded-xl border p-6">
          <h2 className="text-inc text-lg font-semibold">Revenue Overview</h2>
          <p className="text-inc/50 mt-1 text-sm">
            Revenue chart will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}

export default OverView
