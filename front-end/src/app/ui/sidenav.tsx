import Link from "next/link";
import {
  Squares2X2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

export default function SideNav() {
  return (
    <nav className="flex flex-col items-start bg-gray-950 text-white p-0 min-h-full w-full">
      <div className="w-full flex flex-col p-0">
        <Link
          className="flex justify-center items-center m-0 py-4 w-full text-center"
          href="/"
        >
          <div className="mx-3 font-bold text-lg tracking-wider uppercase">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <hr className="border-gray-800 my-0 w-full" />
        <ul
          className="flex flex-col text-gray-400 w-full mt-4 space-y-1"
          id="accordionSidebar"
        >
          <li className="w-full">
            <Link
              className="flex items-center px-4 py-3 hover:text-white hover:bg-gray-900 transition-colors group"
              href="/dashboard"
            >
              {/* h-5 w-5 controls the icon size perfectly */}
              <Squares2X2Icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </li>

          <li className="w-full">
            <Link
              className="flex items-center px-4 py-3 hover:text-white hover:bg-gray-900 transition-colors group"
              href="/search"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">Search</span>
            </Link>
          </li>

          <li className="w-full">
            <Link
              className="flex items-center px-4 py-3 hover:text-white hover:bg-gray-900 transition-colors group"
              href="/reservations/new"
            >
              <PlusIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">New Reservation</span>
            </Link>
          </li>

          <li className="w-full">
            <Link
              className="flex items-center px-4 py-3 hover:text-white hover:bg-gray-900 transition-colors group"
              href="/tables/new"
            >
              {/* Note: Heroicons v2 uses RectangleStackIcon for layered UI concepts */}
              <Squares2X2Icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white transition-colors" />
              <span className="font-medium text-sm">New Table</span>
            </Link>
          </li>
        </ul>

        {/* Sidebar Toggle (Hidden on mobile, flex on desktop) */}
        <div className="text-center hidden md:flex justify-center p-4 mt-auto w-full">
          <button
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex items-center justify-center"
            id="sidebarToggle"
            type="button"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
