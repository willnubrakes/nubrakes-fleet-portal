"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-green-500 border-green-500"
                      : isCurrent
                      ? "bg-white border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6 text-white"
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
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? "text-green-500"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

