import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-navy mb-4">
          Welcome to NuBrakes Fleet Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your vehicle roster and request services for your fleet
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          href="/vehicles"
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#f04f23]"
        >
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Manage Vehicle Roster
          </h2>
          <p className="text-gray-600 mb-4">
            View, add, and manage your fleet vehicles. Upload vehicles via CSV
            or add them individually.
          </p>
          <div className="text-[#f04f23] font-medium">View Vehicles →</div>
        </Link>

        <Link
          href="/service-request"
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#f04f23]"
        >
          <h2 className="text-2xl font-semibold text-navy mb-4">
            Request Service
          </h2>
          <p className="text-gray-600 mb-4">
            Select vehicles and services, choose your preferred date and time,
            and submit service requests.
          </p>
          <div className="text-[#f04f23] font-medium">Request Service →</div>
        </Link>
      </div>
    </div>
  );
}
