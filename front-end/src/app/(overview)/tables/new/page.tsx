import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Table",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-center font-bold text-3xl my-6">New Table</h1>
    </main>
  );
}
