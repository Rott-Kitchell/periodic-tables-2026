"use client";

import { Suspense } from "react";
import { ResListSkeleton, TableListSkeleton } from "@/app/_ui/skeletons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { next, today, previous } from "@/app/_utils/date-time";

export default function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const activeDate = dateParam || today();
  const navigateToDate = (targetDate: string) => {
    router.push(`/dashboard?date=${targetDate}`);
  };

  return (
    <main>
      <h1 className="text-center font-bold text-3xl my-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="w-full">
          <h4 className="mb-2 text-center text-xl font-semibold">
            Reservations for {activeDate}
          </h4>
          <div className="mb-4 text-center">
            <div
              className="inline-flex rounded-md shadow-sm"
              role="group"
              aria-label="Date Buttons"
            >
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-l-md hover:bg-blue-700 transition-colors"
                onClick={() => navigateToDate(previous(activeDate))}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={() => navigateToDate(today())}
              >
                Today
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                onClick={() => navigateToDate(next(activeDate))}
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Suspense fallback={<ResListSkeleton />}></Suspense>

            {/* {reservations ? (
              <ResList
                reservations={reservations.filter(
                  (res) => res.status !== "cancelled",
                )}
                handleCancel={handleCancel}
              />
            ) : (
              <Fragment />
            )} */}
          </div>
        </div>
        <div className="w-full">
          <h4 className="mb-2 text-center text-xl font-semibold">Tables</h4>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Suspense fallback={<TableListSkeleton />}></Suspense>
            {/* <TableList tables={tables} setTablesError={setTablesError} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
