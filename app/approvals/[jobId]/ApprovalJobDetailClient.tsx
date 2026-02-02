"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApprovals } from "@/context/ApprovalContext";
import { useVehicles } from "@/context/VehicleContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type {
  Recommendation,
  RecommendationCategory,
  ApprovalStatus,
} from "@/context/ApprovalContext";

const CATEGORY_ORDER: RecommendationCategory[] = [
  "recommended_immediately",
  "service_soon",
  "all_systems_go",
];

function requiresApproval(category: RecommendationCategory): boolean {
  return category !== "all_systems_go";
}

// Severity icons: report (red) = recommended_immediately, warning (orange) = service_soon, info (gray) = all_systems_go
function SeverityIcon({ category }: { category: RecommendationCategory }) {
  if (category === "recommended_immediately") {
    return (
      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  }
  if (category === "service_soon") {
    return (
      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

interface ApprovalJobDetailClientProps {
  jobId: string;
}

export function ApprovalJobDetailClient({ jobId }: ApprovalJobDetailClientProps) {
  const router = useRouter();
  const { getJob, setServiceApproval } = useApprovals();
  const { vehicles } = useVehicles();
  const [customerContacted, setCustomerContacted] = useState("");

  const job = getJob(jobId);
  const vehicle = job ? vehicles.find((v) => v.id === job.vehicleId) : undefined;

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600">Job not found.</p>
        <Link href="/approvals" className="mt-4 inline-block text-[#03182a] font-medium hover:underline">
          Back to Approvals
        </Link>
      </div>
    );
  }

  const orderedRecommendations = CATEGORY_ORDER.flatMap((cat) =>
    job.recommendations.filter((r) => r.category === cat)
  );

  const handleApprove = (recommendationId: string, status: ApprovalStatus) => {
    setServiceApproval(jobId, recommendationId, status);
  };

  const handleSubmitApprovals = () => {
    router.push("/approvals");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header: Service Approval + Cancel */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Service Approval</h1>
        <Link
          href="/approvals"
          className="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Job / vehicle summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {vehicle ? `${vehicle.name || vehicle.vin} · ${vehicle.year} ${vehicle.make} ${vehicle.model}` : job.vehicleId}
          {vehicle?.vin && (
            <span className="ml-2 text-gray-500 font-mono text-xs">{vehicle.vin}</span>
          )}
        </p>
      </div>

      {/* Customer Contacted */}
      <div className="mb-6">
        <label htmlFor="customer-contacted" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Customer Contacted
        </label>
        <input
          id="customer-contacted"
          type="text"
          value={customerContacted}
          onChange={(e) => setCustomerContacted(e.target.value)}
          placeholder="e.g. John Smith"
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#03182a] focus:ring-1 focus:ring-[#03182a] focus:outline-none"
        />
      </div>

      {/* Recommended Services: single section with count badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Recommended Services
        </h2>
        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase font-medium">
          {orderedRecommendations.length} {orderedRecommendations.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {orderedRecommendations.map((rec) => {
          const isInformational = rec.category === "all_systems_go";
          const showActions = !isInformational;

          return (
            <Card key={rec.id} className="border border-gray-200">
              <div className="p-5">
                <div className="flex flex-col gap-1 mb-4">
                  <div className="flex items-center gap-2">
                    <SeverityIcon category={rec.category} />
                    <h3 className="font-bold text-gray-900 text-lg">{rec.serviceName}</h3>
                  </div>
                  {rec.conditionTags && rec.conditionTags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-red-600 font-bold text-[13px] tracking-wide uppercase">
                        {rec.conditionTags.join(" | ")}
                      </span>
                    </div>
                  )}
                  {rec.description && (
                    <p className="text-sm text-gray-600 mt-1.5">{rec.description}</p>
                  )}
                </div>
                {showActions && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant={rec.approvalStatus === "not_approved" ? "destructive" : "secondary"}
                      onClick={() => handleApprove(rec.id, "not_approved")}
                      className="flex-1"
                    >
                      {rec.approvalStatus === "not_approved" ? "Declined" : "Decline"}
                    </Button>
                    <Button
                      variant={rec.approvalStatus === "approved" ? "primary" : "secondary"}
                      onClick={() => handleApprove(rec.id, "approved")}
                      className="flex-1"
                    >
                      {rec.approvalStatus === "approved" ? "Approved" : "Approve"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer: Submit Approvals + disclaimer */}
      <footer className="mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleSubmitApprovals}
          className="w-full py-4 text-base font-bold"
        >
          Submit Approvals
        </Button>
        <p className="text-center text-xs text-gray-500 mt-4 px-4">
          By submitting, you confirm these selections were discussed with the customer.
        </p>
      </footer>
    </div>
  );
}
