import SideNav from "@/app/ui/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-row min-h-screen">
        <div className="w-1/6 side-bar">
          <SideNav />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
