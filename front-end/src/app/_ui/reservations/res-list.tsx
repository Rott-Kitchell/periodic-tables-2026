export default function ResList() {}

// <div className="w-full lg:w-1/2 p-0" key={reservation_id}>
//   {/* card border-dark -> border-gray-900 rounded shadow-sm */}
//   <div className="border border-gray-900 rounded bg-white shadow-sm" id={reservation_id}>
//     {/* card-body p-2 -> p-2 */}
//     <div className="p-2">

//       {/* text-center */}
//       <div className="text-center mb-2">
//         {/* d-inline-block card-title -> inline-block font-semibold text-lg */}
//         <h5 className="inline-block font-semibold text-lg">{last_name}</h5>
//         {", "}
//         {/* d-inline-block card-subtitle text-muted -> inline-block text-gray-500 text-sm */}
//         <h6 className="inline-block text-gray-500 text-sm">{first_name}</h6>
//       </div>

//       {/* list-group -> Bordered container mimicking Bootstrap list items */}
//       <ul className="border border-gray-200 rounded divide-y divide-gray-200 p-0 mb-3 list-none">
//         {/* list-group-item -> px-3 py-2 text-sm */}
//         <li className="px-3 py-2 text-sm text-gray-700">Contact: {mobile_number}</li>
//         <li className="px-3 py-2 text-sm text-gray-700">Party size: {people}</li>
//         <li className="px-3 py-2 text-sm text-gray-700">Date: {reservation_date}</li>
//         <li className="px-3 py-2 text-sm text-gray-700">Time: {reservation_time}</li>
//         <li
//           data-reservation-id-status={reservation.reservation_id}
//           className="px-3 py-2 text-sm text-gray-700"
//         >
//           Status:{" "}
//           <div className={`inline ${statusColor}`}>{status}</div>
//         </li>
//       </ul>

//       {/* btn-toolbar justify-content-between -> flex justify-between items-center */}
//       <div className="flex justify-between items-center" role="toolbar">
//         {status === "booked" ? (
//           {/* btn-group -> Flex row with rounded corner logic */}
//           <div className="inline-flex rounded-md shadow-sm">
//             <Link
//               to={`/reservations/${reservation_id}/seat`}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-l-md border-r border-blue-700 transition-colors"
//             >
//               Seat
//             </Link>
//             <Link
//               to={`/reservations/${reservation_id}/edit`}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-r-md transition-colors"
//             >
//               Edit
//             </Link>
//           </div>
//         ) : (
//           <Fragment />
//         )}

//         <div className="flex">
//           <button
//             hidden={status !== "booked"}
//             className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
//             data-reservation-id-cancel={reservation.reservation_id}
//             onClick={(e) => {
//               e.preventDefault();
//               handleCancel(reservation_id);
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>

//     </div>
//   </div>
// </div>
