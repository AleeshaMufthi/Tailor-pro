import Link from "next/link";

export default function MainLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Welcome to ALGON</h1>
      <p className="text-gray-600">
        Choose the product you want to explore
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/tailor" className="p-6 rounded-xl border hover:shadow-lg transition text-center font-semibold">
          Tailor Pro
        </Link>

        <Link href="/store" className="p-6 rounded-xl border hover:shadow-lg transition text-center font-semibold">
          Store - Ecommerce
        </Link>

        <Link href="/socialmedia" className="p-6 rounded-xl border hover:shadow-lg transition text-center font-semibold">
          SocialMedia
        </Link>
      </div>
    </main>
  );
}

