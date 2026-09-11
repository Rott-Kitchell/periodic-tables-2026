import Image from "next/image";
import SideNav from "./ui/sidenav";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col min-h-screen">
        <div className="w-1/6 side-bar">
          <SideNav />
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}
