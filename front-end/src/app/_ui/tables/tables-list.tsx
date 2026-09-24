//  <div className="w-full lg:w-1/2 p-0" key={table.table_id}>
//   {/* card border-dark -> border border-gray-900 rounded bg-white shadow-sm */}
//   <div
//     className="border border-gray-900 rounded bg-white shadow-sm"
//     id={table.table_id}
//     name={table.table_id}
//   >
//     {/* card-body p-2 -> p-2 */}
//     <div className="p-2">
//       {/* h6 card-title text-center -> text-center font-medium text-base text-gray-900 mb-2 */}
//       <h6 className="text-center font-medium text-base text-gray-900 mb-2">
//         {table.table_name}
//       </h6>

//       {/* row row-col-2 justify-content-between m-1 -> flex justify-between items-center m-1 */}
//       <div className="flex justify-between items-center m-1">
//         <p
//           data-table-id-status={table.table_id}
//           className={
//             table.reservation_id ? "text-red-600 font-medium" : "text-green-600 font-medium"
//           }
//         >
//           {table.reservation_id ? "Occupied" : "Free"}
//         </p>

//         {/* Replaced <Fragment /> logic with a cleaner short-circuit operator */}
//         {table.reservation_id && (
//           <button
//             type="submit"
//             data-table-id-finish={table.table_id}
//             {/* btn btn-sm btn-primary -> bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors */}
//             className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
//             onClick={(e) => {
//               e.preventDefault();
//               handleFinish(table.table_id);
//             }}
//           >
//             Finish
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// </div>
