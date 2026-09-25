"use client";

import { Suspense, useEffect, useState } from "react";
import { ResListSkeleton, TableListSkeleton } from "@/app/_ui/skeletons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { next, today, previous } from "@/app/_utils/date-time";
import TableList from "../tables/table-list";
import {
  changeReservationStatus,
  listReservations,
  listTables,
} from "@/app/_utils/api";
import { Reservation, Table } from "@/app/_utils/definitions";
import ErrorAlert from "./error-alert";
import ResList from "../reservations/res-list";

export default function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const date = dateParam || today();
  const navigateToDate = (targetDate: string) => {
    router.push(`/dashboard?date=${targetDate}`);
  };

  // testing
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsError, setReservationsError] = useState<Error | null>(
    null,
  );
  const [tablesError, setTablesError] = useState<Error | null>(null);

  useEffect(() => {
    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      setTablesError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch((error) => {
          if (error?.name !== "AbortError") {
            setReservationsError(error);
          }
        });

      listTables(abortController.signal)
        .then(setTables)
        .catch((error) => {
          if (error?.name !== "AbortError") {
            setTablesError(error);
          }
        });

      return () => abortController.abort();
    }
    if (date) loadDashboard();
  }, [date, pathname]);

  function handleCancel(reservation_id: number) {
    const abortController = new AbortController();
    let result = window.confirm(
      "Do you want to cancel this reservation? \n \n This cannot be undone.",
    );
    if (result)
      changeReservationStatus(
        reservation_id,
        "cancelled",
        abortController.signal,
      )
        .then(() => window.location.reload())
        .catch(setReservationsError);

    return () => abortController.abort();
  }

  const visibleReservations = reservations.filter(
    (r) => r.status !== "cancelled",
  );

  return (
    <main className="mx-2">
      <h1 className="text-center font-bold text-3xl my-6">Dashboard</h1>
      <ErrorAlert error={reservationsError} title={"Reservations"} />
      <ErrorAlert error={tablesError} title={"Tables"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="w-full">
          <h4 className="mb-2 text-center text-xl font-semibold">
            Reservations for {date}
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
                onClick={() => navigateToDate(previous(date))}
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
                onClick={() => navigateToDate(next(date))}
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Suspense fallback={<ResListSkeleton />}>
              <ResList
                reservations={visibleReservations}
                handleCancel={handleCancel}
              />
            </Suspense>

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
            <Suspense fallback={<TableListSkeleton />}>
              <TableList tables={tables} setTablesError={setTablesError} />
            </Suspense>
            {/* <TableList tables={tables} setTablesError={setTablesError} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
