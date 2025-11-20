"use client";

interface SubmitSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submittedData?: {
    vehicles: string[];
    services: string[];
    preferredDate: string;
    preferredTime: string;
  };
}

export function SubmitSuccessDialog({
  isOpen,
  onClose,
  submittedData,
}: SubmitSuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green mb-4">
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
            Service Request Submitted!
          </h2>
          <p className="text-gray-600">
            Your service request has been successfully submitted.
          </p>
        </div>

        {submittedData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-navy mb-4">Request Details:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Vehicles:</span>{" "}
                <span className="text-gray-600">
                  {submittedData.vehicles.join(", ")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Services:</span>{" "}
                <span className="text-gray-600">
                  {submittedData.services.join(", ")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Preferred Date:</span>{" "}
                <span className="text-gray-600">
                  {submittedData.preferredDate || "Flexible"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Preferred Time:</span>{" "}
                <span className="text-gray-600">
                  {submittedData.preferredTime}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#f04f23] text-white px-6 py-2 rounded-md hover:bg-[#d43e1a] transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

