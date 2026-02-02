import Link from "next/link";

// Base path for GitHub Pages - should match next.config.ts
const BASE_PATH = process.env.NODE_ENV === "production" ? "/nubrakes-fleet-portal" : "";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Centered Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="NuBrakes"
              width={60}
              height={60}
              className="object-contain"
            />
            <span className="text-3xl font-bold text-navy" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Fleet Portal
            </span>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-lg font-medium text-white">J</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-900">City of Houston</span>
              <span className="text-sm text-gray-500">John Doe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <p className="text-2xl font-semibold text-navy mb-4">
            Hi John, Welcome to the NuBrakes Fleet Portal for City of Houston
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your vehicle roster and request services for your fleet
          </p>
        </div>

        {/* Four CTA Buttons */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Request Service */}
          <Link
            href="/service-request"
            className="group relative bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#34BB4B] hover:scale-[1.02] transform"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#34BB4B] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-navy group-hover:text-[#34BB4B] transition-colors duration-300">
                Schedule Service
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Select vehicles and services, choose your preferred date and time,
              and submit service requests.
            </p>
            <div className="w-full bg-[#34BB4B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2da83f] transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
              Request Service
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          {/* Vehicle Roster */}
          <Link
            href="/vehicles"
            className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#03182a] hover:scale-[1.02] transform"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#03182a] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-navy group-hover:text-[#03182a] transition-colors duration-300">
                Vehicle Roster
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              View, add, and manage your fleet vehicles. Upload vehicles via CSV
              or add them individually.
            </p>
            <div className="w-full bg-[#03182a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#03182a]/90 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
              View Vehicles
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          {/* Approvals */}
          <Link
            href="/approvals"
            className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#03182a] hover:scale-[1.02] transform"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#03182a] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-navy group-hover:text-[#03182a] transition-colors duration-300">
                Approvals
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Review and approve recommended services for repair jobs on a job-by-job basis.
            </p>
            <div className="w-full bg-[#03182a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#03182a]/90 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
              Review Approvals
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          {/* Suggest Improvement */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd5dHn9ikstknvV5Gb14DIZgzL8qoC5hlGDH-ttTiIO9QF47w/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#03182a] hover:scale-[1.02] transform"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#03182a] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-navy group-hover:text-[#03182a] transition-colors duration-300">
                Suggest Improvement
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Have an idea or noticed something off? We'd love your feedback.
            </p>
            <div className="w-full bg-[#03182a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#03182a]/90 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
              Share Feedback
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>

          {/* Contact Us */}
          <a
            href="tel:+18555513227"
            className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#03182a] hover:scale-[1.02] transform"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#03182a] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-navy group-hover:text-[#03182a] transition-colors duration-300">
                Contact Us
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Get immediate help from our team including questions and help setting up service
            </p>
            <div className="w-full bg-[#03182a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#03182a]/90 transition-colors duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer">
              Call (855) 551-3227
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
