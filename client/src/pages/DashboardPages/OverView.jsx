import MetricCard from '../../component/CardComponents/MetricCard'
import { IoWalletOutline } from 'react-icons/io5'
import { FiShoppingBag } from 'react-icons/fi'
import { CiTimer } from 'react-icons/ci'
import { useOutletContext } from 'react-router'

const OverView = () => {
  const userData = useOutletContext()

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-4">
      {/* Welcome section */}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-ascent text-sm font-semibold uppercase tracking-wider">
            Store Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {userData.name}
          </h1>

          <p className="text-muted mt-2 text-sm">
            Here's how your store is performing.
          </p>
        </div>

        <span className="border-border rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-muted">
          Demo analytics · Last 30 days
        </span>
      </section>

      {/* Metrics and revenue chart */}
      <section className="flex min-w-0 flex-col gap-6 xl:flex-row">
        {/* Metric cards */}
        <div className="flex min-w-0 flex-col gap-4 xl:w-[420px] xl:shrink-0">
          <div className="border-border overflow-hidden rounded-2xl border bg-white">
            <MetricCard
              mainData="2450"
              headings="Total Revenue"
              text="Demo data · Last 30 days"
              icon={<IoWalletOutline />}
              value="$"
              variant="primary"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row xl:flex-col">
            <div className="border-border min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white">
              <MetricCard
                mainData="353"
                headings="Total Orders"
                text="Demo data · Last 30 days"
                icon={<FiShoppingBag />}
              />
            </div>

            <div className="border-border min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white">
              <MetricCard
                mainData="30"
                headings="Unconfirmed Orders"
                text="Awaiting confirmation"
                icon={<CiTimer />}
              />
            </div>
          </div>
        </div>

        {/* Revenue chart panel */}
        <div className="border-border flex min-h-[320px] min-w-0 flex-1 flex-col rounded-2xl border bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-inc text-lg font-semibold">
                Revenue Overview
              </h2>
              <p className="text-muted mt-1 text-sm">
                Revenue performance over the last 30 days.
              </p>
            </div>

            <span className="rounded-full bg-ascent/10 px-3 py-1.5 text-xs font-medium text-ascent">
              Demo data
            </span>
          </div>

          {/* Keep your existing shadcn chart here */}
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted text-sm">
              Revenue chart will appear here.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default OverView