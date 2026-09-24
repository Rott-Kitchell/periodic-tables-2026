const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function ResListSkeleton() {
  return (
    <>
      <ResSkeleton />
      <ResSkeleton />
      <ResSkeleton />
      <ResSkeleton />
    </>
  );
}

export function ResSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden w-full lg:w-1/2 p-0`}>
      <div className="rounded border border-gray-900 shadow-sm bg-white">
        <div className="p-2">
          {/* Header */}
          <div className="flex justify-center items-center space-x-2 mb-3 mt-1">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <span className="text-gray-300">, </span>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>

          {/* List Group */}
          <ul className="border border-gray-200 rounded divide-y divide-gray-200 p-0 mb-3 list-none">
            <li className="px-3 py-2.5 flex items-center">
              <span className="text-transparent select-none text-xs bg-gray-200 rounded w-14 mr-2">
                Contact:
              </span>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </li>
            <li className="px-3 py-2.5 flex items-center">
              <span className="text-transparent select-none text-xs bg-gray-200 rounded w-16 mr-2">
                Party size:
              </span>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </li>
            <li className="px-3 py-2.5 flex items-center">
              <span className="text-transparent select-none text-xs bg-gray-200 rounded w-10 mr-2">
                Date:
              </span>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </li>
            <li className="px-3 py-2.5 flex items-center">
              <span className="text-transparent select-none text-xs bg-gray-200 rounded w-10 mr-2">
                Time:
              </span>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </li>
            <li className="px-3 py-2.5 flex items-center">
              <span className="text-transparent select-none text-xs bg-gray-200 rounded w-12 mr-2">
                Status:
              </span>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </li>
          </ul>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-0.5">
            {/* Left Button Group (Seat & Edit combo) */}
            <div className="inline-flex rounded-md">
              <div className="h-7 bg-gray-200 rounded-l-md w-12 border-r border-white"></div>
              <div className="h-7 bg-gray-200 rounded-r-md w-12"></div>
            </div>
            {/* Right Button Group (Cancel) */}
            <div className="flex">
              <div className="h-7 bg-gray-200 rounded-md w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableListSkeleton() {
  return (
    <>
      <TableSkeleton />
      <TableSkeleton />
      <TableSkeleton />
      <TableSkeleton />
    </>
  );
}
export function TableSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden w-full lg:w-1/2 p-0`}>
      <div className="rounded border border-gray-900 shadow-sm bg-white">
        <div className="p-2">
          {/* Header */}
          <div className="flex justify-center items-center mt-1 mb-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Status and Button */}
          <div className="flex justify-between items-center m-1 h-7">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-7 bg-gray-200 rounded w-14"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
