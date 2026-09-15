import { Fragment } from "react/jsx-runtime";

export default function Home() {
  return (
    <main>
      <h1 className="text-center font-bold text-3xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="w-full">
          <h4 className="mb-2 text-center text-xl font-semibold">
            Reservations for 2026-09-15
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
              >
                Previous
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
            <Fragment />
          </div>
        </div>
        <div className="w-full">
          <h4 className="mb-2 text-center text-xl font-semibold">Tables</h4>

          {/* Sub-grid: 1 column on mobile, 2 columns on extra large (xl+) screens */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* <TableList tables={tables} setTablesError={setTablesError} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
