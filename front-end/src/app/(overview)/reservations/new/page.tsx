import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Reservation",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-center font-bold text-3xl my-6">New Reservation</h1>
    </main>
  );
}
