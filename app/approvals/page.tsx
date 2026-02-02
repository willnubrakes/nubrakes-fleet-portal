"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApprovals } from "@/context/ApprovalContext";
import { useVehicles } from "@/context/VehicleContext";
import { Table } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import type { JobWithReviewState } from "@/context/ApprovalContext";

type Filter = "all" | "needs_review";

const REVIEW_STATE_LABELS: Record<string, string> = {
  not_reviewed: "Not Reviewed",
  partially_reviewed: "Partially Reviewed",
  reviewed: "Reviewed",
};

export default function ApprovalsPage() {
  const router = useRouter();
  const { jobs } = useApprovals();
  const { vehicles } = useVehicles();
  const [filter, setFilter] = useState<Filter>("needs_review");

  const filteredJobs =
    filter === "needs_review"
      ? jobs.filter(
          (j) => j.reviewState === "not_reviewed" || j.reviewState === "partially_reviewed"
        )
      : jobs;

  const getVehicleDisplay = (vehicleId: string) => {
    const v = vehicles.find((x) => x.id === vehicleId);
    return v ? v.name || v.vin : vehicleId;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const columns = [
    {
      key: "id",
      label: "Job Number",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-700">{formatDate(value)}</span>
      ),
    },
    {
      key: "vehicleId",
      label: "Vehicle Name",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-700">{getVehicleDisplay(value)}</span>
      ),
    },
    {
      key: "reviewState",
      label: "Status (review state)",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-700">
          {REVIEW_STATE_LABELS[value] ?? value}
        </span>
      ),
    },
    {
      key: "reviewApprovals",
      label: "",
      sortable: false,
      width: "140px",
      render: (_: unknown, row: JobWithReviewState) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/approvals/${row.id}`);
          }}
          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#03182a] text-white hover:bg-[#052a42] transition-colors"
        >
          Review Approvals
        </button>
      ),
    },
  ];

  const handleRowClick = (row: JobWithReviewState) => {
    router.push(`/approvals/${row.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Approvals</h1>
        <p className="mt-2 text-gray-600">
          Review and approve recommended services for repair jobs.
        </p>
        {jobs.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#03182a] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("needs_review")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "needs_review"
                  ? "bg-[#03182a] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Needs review
            </button>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs awaiting approval"
          description="When repair jobs have recommendations sent for approval, they will appear here for you to review."
          icon={
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No jobs need review"
          description="All jobs have been reviewed. Switch to &quot;All&quot; to see every job."
          icon={
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table
            columns={columns}
            data={filteredJobs}
            keyExtractor={(row) => row.id}
            onRowClick={handleRowClick}
            maxHeight="600px"
          />
        </div>
      )}
    </div>
  );
}
