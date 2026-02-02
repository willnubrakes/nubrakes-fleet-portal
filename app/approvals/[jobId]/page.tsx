import { MOCK_JOB_IDS } from "@/lib/approvalMockIds";
import { ApprovalJobDetailClient } from "./ApprovalJobDetailClient";

export function generateStaticParams() {
  return MOCK_JOB_IDS.map((jobId) => ({ jobId }));
}

export default async function ApprovalJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <ApprovalJobDetailClient jobId={jobId} />;
}
