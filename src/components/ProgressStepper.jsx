import React from 'react';
import { Check, FileSearch, Upload, FileText, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, name: 'Follow Algorithm', icon: FileSearch },
  { id: 2, name: 'Upload Images', icon: Upload },
  { id: 3, name: 'Analyze', icon: FileText },
  { id: 4, name: 'View Report', icon: CheckCircle },
];

export default function ProgressStepper({ currentStep }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {currentStep > step.id ? (
              // Completed Step
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-2 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <Check className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-900 dark:text-slate-100">{step.name}</span>
                </span>
              </div>
            ) : currentStep === step.id ? (
              // Current Step
              <div className="flex items-center px-6 py-2 text-sm font-medium" aria-current="step">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-600">
                  <span className="text-blue-600 dark:text-blue-400">{`0${step.id}`}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-blue-600 dark:text-blue-400">{step.name}</span>
              </div>
            ) : (
              // Upcoming Step
              <div className="group flex items-center">
                <span className="flex items-center px-6 py-2 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">{`0${step.id}`}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-500 dark:text-slate-400">{step.name}</span>
                </span>
              </div>
            )}

            {/* Connector */}
            {stepIdx !== steps.length - 1 ? (
              <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                <svg
                  className={`h-full w-full ${currentStep > step.id ? 'text-blue-600' : 'text-slate-300 dark:text-slate-700'}`}
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M0.5 0V38L15.5 52L0.5 66V80" stroke="currentColor" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}