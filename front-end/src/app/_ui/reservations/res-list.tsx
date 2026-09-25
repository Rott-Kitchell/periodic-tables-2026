import { Reservation } from "@/app/_utils/definitions";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

type ResListProps = {
  reservations: Reservation[];
  handleCancel: (reservation_id: number) => void;
};

export default function ResList({ reservations, handleCancel }: ResListProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center w-full">No reservations for this date</div>
    );
  }

  return reservations.map((reservation) => {
    const {
      reservation_id,
      mobile_number,
      reservation_date,
      reservation_time,
      party_size,
      first_name,
      last_name,
      status,
    } = reservation;
    if (reservation_id == null) return null;
    let statusColor;
    if (status === "booked") {
      statusColor = "text-green-500";
    } else if (status === "cancelled") {
      statusColor = "text-red-500";
    } else if (status === "seated") {
      statusColor = "text-yellow-500";
    }
    return (
      <div className="w-full p-0" key={reservation_id}>
        {/* card border-dark -> border-gray-900 rounded shadow-sm */}
        <div
          className="border border-gray-900 rounded bg-white shadow-sm"
          id={reservation_id.toString()}
        >
          {/* card-body p-2 -> p-2 */}
          <div className="p-2">
            {/* text-center */}
            <div className="text-center mb-2">
              {/* d-inline-block card-title -> inline-block font-semibold text-lg */}
              <h5 className="inline-block font-semibold text-lg">
                {last_name}
              </h5>
              {", "}
              {/* d-inline-block card-subtitle text-muted -> inline-block text-gray-500 text-sm */}
              <h6 className="inline-block text-gray-500 text-sm">
                {first_name}
              </h6>
            </div>

            {/* list-group -> Bordered container mimicking Bootstrap list items */}
            <ul className="border border-gray-200 rounded divide-y divide-gray-200 p-0 mb-3 list-none">
              {/* list-group-item -> px-3 py-2 text-sm */}
              <li className="px-3 py-2 text-sm text-gray-700">
                Contact: {mobile_number}
              </li>
              <li className="px-3 py-2 text-sm text-gray-700">
                Party size: {party_size}
              </li>
              <li className="px-3 py-2 text-sm text-gray-700">
                Date: {reservation_date}
              </li>
              <li className="px-3 py-2 text-sm text-gray-700">
                Time: {reservation_time}
              </li>
              <li
                data-reservation-id-status={reservation.reservation_id}
                className="px-3 py-2 text-sm text-gray-700"
              >
                Status: <div className={`inline ${statusColor}`}>{status}</div>
              </li>
            </ul>

            {/* btn-toolbar justify-content-between -> flex justify-between items-center */}
            <div className="flex justify-between items-center" role="toolbar">
              {status === "booked" ? (
                <div className="inline-flex rounded-md shadow-sm">
                  <Link
                    href={`/reservations/${reservation_id}/seat`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-l-md border-r border-blue-700 transition-colors"
                  >
                    Seat
                  </Link>
                  <Link
                    href={`/reservations/${reservation_id}/edit`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-r-md transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ) : null}

              <div className="flex">
                <button
                  hidden={status !== "booked"}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                  data-reservation-id-cancel={reservation.reservation_id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCancel(reservation_id);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
