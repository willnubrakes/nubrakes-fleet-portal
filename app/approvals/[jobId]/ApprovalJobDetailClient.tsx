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

const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  recommended_immediately: "Service Recommended Immediately",
  service_soon: "Service Soon",
  all_systems_go: "All Systems Go",
};

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
    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/approvals");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-4">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-navy mb-2">
                Approvals submitted
              </h2>
              <p className="text-gray-600">
                Your approvals have been saved successfully.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleCloseSuccessModal}
                className="w-full"
              >
                Back to Approvals
              </Button>
            </div>
          </div>
        </div>
      )}

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

          const hasWhy =
            rec.description ||
            rec.brakePads ||
            rec.rotors ||
            rec.fluid ||
            rec.photoUrl ||
            (!(rec.brakePads || rec.rotors || rec.fluid) && rec.conditionTags && rec.conditionTags.length > 0);
          const showFindings = hasWhy || rec.category === "all_systems_go";

          const isApproved = showActions && rec.approvalStatus === "approved";
          const isDeclined = showActions && rec.approvalStatus === "not_approved";
          const cardBg =
            isApproved ? "bg-green-50 border-green-300" : isDeclined ? "bg-red-50 border-red-300" : "bg-white border-gray-200";

          return (
            <Card key={rec.id} className={`border overflow-hidden ${cardBg}`}>
              <div className="p-4">
                {/* Level 1: Heading + recommendation + approval status icon */}
                <div className="flex items-center gap-2 mb-1.5">
                  <SeverityIcon category={rec.category} />
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide flex-1">
                    {rec.serviceName}
                  </h3>
                  {isApproved && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center" title="Approved">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {isDeclined && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center" title="Declined">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <span
                  className={`inline-block text-sm font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    rec.category === "recommended_immediately"
                      ? "bg-red-50 text-red-700"
                      : rec.category === "service_soon"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-green-50 text-green-800"
                  }`}
                >
                  {CATEGORY_LABELS[rec.category]}
                </span>

                {/* Level 2: Why section — always show for All Systems Go so all findings are visible */}
                {showFindings && (
                  <div
                    className={`mt-3 rounded-lg border px-3.5 py-2.5 space-y-2 text-sm ${
                      isApproved
                        ? "bg-green-100/60 border-green-200 text-gray-700"
                        : isDeclined
                          ? "bg-red-100/40 border-red-200 text-gray-700"
                          : "bg-gray-50/80 border-gray-100 text-gray-700"
                    }`}
                  >
                    <p className="font-bold text-gray-500 uppercase tracking-wider">
                      Our Findings
                    </p>
                    {rec.description && (
                      <p className="font-medium text-gray-900">
                        {rec.description}
                      </p>
                    )}
                    {!(rec.brakePads || rec.rotors || rec.fluid) &&
                      rec.conditionTags &&
                      rec.conditionTags.length > 0 && (
                        <p className="font-semibold text-red-600 uppercase tracking-wide">
                          {rec.conditionTags.join(" · ")}
                        </p>
                      )}
                    {(rec.brakePads || rec.rotors || rec.fluid) && (
                      <dl className="space-y-1">
                        {rec.brakePads && (
                          <div className="flex flex-wrap gap-x-1.5">
                            <dt className="font-medium text-gray-500 after:content-[':']">Brake pads</dt>
                            <dd className="font-medium">
                              Driver {rec.brakePads.thicknessDriverMm != null ? `${rec.brakePads.thicknessDriverMm} mm` : "—"}
                              {" · "}
                              Passenger {rec.brakePads.thicknessPassengerMm != null ? `${rec.brakePads.thicknessPassengerMm} mm` : "—"}
                              {rec.brakePads.condition && ` · ${rec.brakePads.condition}`}
                            </dd>
                          </div>
                        )}
                        {rec.rotors && (
                          <div className="flex flex-wrap gap-x-1.5">
                            <dt className="font-medium text-gray-500 after:content-[':']">Rotors</dt>
                            <dd className="font-medium">{rec.rotors.condition ?? "—"}</dd>
                          </div>
                        )}
                        {rec.fluid && (
                          <div className="flex flex-wrap gap-x-1.5">
                            <dt className="font-medium text-gray-500 after:content-[':']">Fluid</dt>
                            <dd className="font-medium">
                              {rec.fluid.ppm != null ? `${rec.fluid.ppm} ppm` : "—"}
                              {" · "}
                              {rec.fluid.level === "full" ? "Full" : rec.fluid.level === "not_full" ? "Not full" : "—"}
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                    {rec.photoUrl && (
                      <a
                        href={rec.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#03182a] hover:underline"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View photo
                      </a>
                    )}
                  </div>
                )}

                {/* Actions: equal-width buttons */}
                {showActions && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleApprove(rec.id, "not_approved")}
                      className={`w-full min-w-0 inline-flex items-center justify-center gap-2 ${
                        rec.approvalStatus === "not_approved"
                          ? "bg-red-200 text-red-900 border-red-300"
                          : "bg-white text-red-700 border-red-200 hover:bg-red-50"
                      }`}
                    >
                      {rec.approvalStatus === "not_approved" ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Declined
                        </>
                      ) : (
                        "Decline"
                      )}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(rec.id, "approved")}
                      className={`w-full min-w-0 inline-flex items-center justify-center gap-2 ${
                        rec.approvalStatus === "approved" ? "bg-green-600 hover:bg-green-700 border-green-700 text-white" : ""
                      }`}
                    >
                      {rec.approvalStatus === "approved" ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Approved
                        </>
                      ) : (
                        "Approve"
                      )}
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
