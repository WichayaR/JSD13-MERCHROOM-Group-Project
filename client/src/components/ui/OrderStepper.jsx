// src/components/ui/OrderStepper.jsx
import React from 'react';

export const OrderStepper = ({ currentStatus }) => {
  const steps = [
    { id: 'pending', label: 'PENDING' },
    { id: 'processing', label: 'PROCESSING' },
    { id: 'shipping', label: 'SHIPPING' },
    { id: 'delivered', label: 'DELIVERED' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipping': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 bg-rose-100 border border-rose-500 text-rose-700 font-sans font-extrabold text-sm tracking-wider text-center rounded-btn mb-6">
        THIS ORDER HAS BEEN CANCELLED
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-ink rounded-btn mb-6 overflow-x-auto">
      {steps.map((step, idx) => {
        const isPassed = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step.id} className="flex flex-col items-center relative flex-1 min-w-[80px]">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-sans font-extrabold text-xs z-10 transition-all ${
                isPassed
                  ? 'bg-ink border-ink text-highlight'
                  : isCurrent
                  ? 'bg-primary border-primary text-white ring-4 ring-primary/20'
                  : 'bg-white border-muted text-muted'
              }`}
            >
              {isPassed ? '✓' : idx + 1}
            </div>
            <span
              className={`mt-2 font-sans text-[10px] font-bold tracking-wider ${
                isCurrent ? 'text-primary' : isPassed ? 'text-ink' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                  idx < currentIndex ? 'bg-ink' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};