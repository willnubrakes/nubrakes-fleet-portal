"use client";

import Link from "next/link";
import { useApprovals } from "@/context/ApprovalContext";
import { useVehicles } from "@/context/VehicleContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type {
  Recommendation,
  RecommendationCategory,
  ApprovalStatus,
} from "@/context/ApprovalContext";

const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  recommended_immediately: "Recommended Immediately",
  service_soon: "Service Soon",
  all_systems_go: "All Systems Go",
};

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  not_approved: "Not Approved",
};

const CATEGORY_ORDER: RecommendationCategory[] = [
  "recommended_immediately",
  "service_soon",
  "all_systems_go",
];

function requiresApproval(category: RecommendationCategory): boolean {
  return category !== "all_systems_go";
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    not_approved: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface ApprovalJobDetailClientProps {
  jobId: string;
}

export function ApprovalJobDetailClient({ jobId }: ApprovalJobDetailClientProps) {
  const { getJob, setServiceApproval } = useApprovals();
  const { vehicles } = useVehicles();

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

  const byCategory = CATEGORY_ORDER.reduce<Record<RecommendationCategory, Recommendation[]>>(
    (acc, cat) => {
      acc[cat] = job.recommendations.filter((r) => r.category === cat);
      return acc;
    },
    {
      recommended_immediately: [],
      service_soon: [],
      all_systems_go: [],
    }
  );

  const handleApprove = (recommendationId: string, status: ApprovalStatus) => {
    setServiceApproval(jobId, recommendationId, status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/approvals"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-navy font-medium mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Approvals
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Job: {job.id}</h1>
        <p className="mt-2 text-gray-600">
          {vehicle ? `${vehicle.name || vehicle.vin} · ${vehicle.year} ${vehicle.make} ${vehicle.model}` : job.vehicleId}
          {vehicle?.vin && (
            <span className="ml-2 text-gray-500 font-mono text-sm">{vehicle.vin}</span>
          )}
        </p>
      </div>

      <div className="space-y-8">
        {CATEGORY_ORDER.map((category) => {
          const recs = byCategory[category];
          if (recs.length === 0) return null;

          const isInformational = category === "all_systems_go";

          return (
            <Card
              key={category}
              title={CATEGORY_LABELS[category]}
              description={
                isInformational
                  ? "Informational only — no approval required"
                  : "Approval required"
              }
            >
              <ul className="divide-y divide-gray-200">
                {recs.map((rec) => (
                  <li key={rec.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{rec.serviceName}</p>
                        {rec.description && (
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        )}
                        <div className="mt-2">
                          <StatusBadge status={rec.approvalStatus} />
                        </div>
                      </div>
                      {!isInformational && rec.approvalStatus === "pending" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="primary"
                            onClick={() => handleApprove(rec.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleApprove(rec.id, "not_approved")}
                          >
                            Not Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
