import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-center font-bold text-3xl my-6">Search</h1>
    </main>
  );
}
