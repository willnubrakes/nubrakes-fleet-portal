"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type RecommendationCategory =
  | "recommended_immediately"
  | "service_soon"
  | "all_systems_go";

export type ApprovalStatus = "pending" | "approved" | "not_approved";

export type ReviewState = "not_reviewed" | "partially_reviewed" | "reviewed";

// Inspection details for brake-related recommendations
export interface BrakePadsDetails {
  thicknessDriverMm?: number;
  thicknessPassengerMm?: number;
  condition?: string;
}
export interface RotorsDetails {
  condition?: string;
}
export interface FluidDetails {
  ppm?: number;
  level?: "full" | "not_full";
}

export interface Recommendation {
  id: string;
  jobId: string;
  serviceName: string;
  category: RecommendationCategory;
  approvalStatus: ApprovalStatus;
  description?: string;
  conditionTags?: string[];
  brakePads?: BrakePadsDetails;
  rotors?: RotorsDetails;
  fluid?: FluidDetails;
  /** Optional URL to view inspection/service photo */
  photoUrl?: string;
}

export interface Job {
  id: string;
  vehicleId: string;
  /** ISO date string for display (e.g. "2025-01-15") */
  date: string;
  recommendations: Recommendation[];
}

function requiresApproval(category: RecommendationCategory): boolean {
  return category !== "all_systems_go";
}

function deriveReviewState(recommendations: Recommendation[]): ReviewState {
  const needsApproval = recommendations.filter((r) => requiresApproval(r.category));
  if (needsApproval.length === 0) return "reviewed";
  const decided = needsApproval.filter((r) => r.approvalStatus !== "pending");
  if (decided.length === 0) return "not_reviewed";
  if (decided.length === needsApproval.length) return "reviewed";
  return "partially_reviewed";
}

// Initial mock data: jobs with recommendations (vehicleIds match VehicleContext)
const initialRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    jobId: "job-1",
    serviceName: "Front brake pads",
    category: "recommended_immediately",
    approvalStatus: "pending",
    description: "Recommend replacement due to condition + thickness",
    conditionTags: ["UNEVEN WEAR"],
    brakePads: {
      thicknessDriverMm: 4.2,
      thicknessPassengerMm: 3.8,
      condition: "Uneven wear",
    },
    photoUrl: "/api/inspection-photos/rec-1",
  },
  {
    id: "rec-2",
    jobId: "job-1",
    serviceName: "Brake fluid exchange",
    category: "service_soon",
    approvalStatus: "pending",
    description: "Flush recommended based on age and moisture content",
    conditionTags: ["MOISTURE DETECTED"],
    fluid: {
      ppm: 850,
      level: "not_full",
    },
  },
  {
    id: "rec-3",
    jobId: "job-1",
    serviceName: "Front Brake Rotors",
    category: "all_systems_go",
    approvalStatus: "pending",
    description: "Good Condition",
    rotors: {
      condition: "Good Condition",
    },
    photoUrl: "/api/inspection-photos/rec-3",
  },
  {
    id: "rec-4",
    jobId: "job-2",
    serviceName: "Rear brake rotors",
    category: "recommended_immediately",
    approvalStatus: "approved",
    description: "Rear rotors at minimum thickness",
    conditionTags: ["MIN THICKNESS", "CRITICAL"],
    rotors: {
      condition: "At minimum thickness",
    },
  },
  {
    id: "rec-5",
    jobId: "job-2",
    serviceName: "Brake hose inspection",
    category: "service_soon",
    approvalStatus: "pending",
    description: "Minor wear observed",
    conditionTags: ["WEAR OBSERVED"],
  },
  {
    id: "rec-6",
    jobId: "job-3",
    serviceName: "Brake pads (all)",
    category: "recommended_immediately",
    approvalStatus: "not_approved",
    description: "Customer deferred",
    conditionTags: ["DEFERRED"],
    brakePads: {
      thicknessDriverMm: 5.1,
      thicknessPassengerMm: 5.0,
      condition: "Customer deferred",
    },
  },
  {
    id: "rec-7",
    jobId: "job-3",
    serviceName: "Tire condition",
    category: "all_systems_go",
    approvalStatus: "pending",
    description: "All systems go",
  },
];

const initialJobs: Job[] = [
  { id: "job-1", vehicleId: "1", date: "2025-01-15", recommendations: initialRecommendations.filter((r) => r.jobId === "job-1") },
  { id: "job-2", vehicleId: "2", date: "2025-01-14", recommendations: initialRecommendations.filter((r) => r.jobId === "job-2") },
  { id: "job-3", vehicleId: "3", date: "2025-01-13", recommendations: initialRecommendations.filter((r) => r.jobId === "job-3") },
];

export interface JobWithReviewState extends Job {
  reviewState: ReviewState;
  pendingCount: number;
}

interface ApprovalContextType {
  jobs: JobWithReviewState[];
  getJob: (jobId: string) => JobWithReviewState | undefined;
  setServiceApproval: (jobId: string, recommendationId: string, status: ApprovalStatus) => void;
}

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

function buildJobsWithReviewState(jobs: Job[]): JobWithReviewState[] {
  return jobs.map((job) => {
    const reviewState = deriveReviewState(job.recommendations);
    const pendingCount = job.recommendations.filter(
      (r) => requiresApproval(r.category) && r.approvalStatus === "pending"
    ).length;
    return { ...job, reviewState, pendingCount };
  });
}

export function ApprovalProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const jobsWithReviewState = useMemo(() => buildJobsWithReviewState(jobs), [jobs]);

  const getJob = useCallback(
    (jobId: string): JobWithReviewState | undefined => {
      return jobsWithReviewState.find((j) => j.id === jobId);
    },
    [jobsWithReviewState]
  );

  const setServiceApproval = useCallback(
    (jobId: string, recommendationId: string, status: ApprovalStatus) => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.id !== jobId) return job;
          return {
            ...job,
            recommendations: job.recommendations.map((r) =>
              r.id === recommendationId ? { ...r, approvalStatus: status } : r
            ),
          };
        })
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      jobs: jobsWithReviewState,
      getJob,
      setServiceApproval,
    }),
    [jobsWithReviewState, getJob, setServiceApproval]
  );

  return (
    <ApprovalContext.Provider value={value}>
      {children}
    </ApprovalContext.Provider>
  );
}

export function useApprovals() {
  const context = useContext(ApprovalContext);
  if (!context) {
    throw new Error("useApprovals must be used within ApprovalProvider");
  }
  return context;
}
