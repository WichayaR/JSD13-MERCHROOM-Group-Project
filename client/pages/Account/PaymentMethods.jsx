// pages/Account/PaymentMethods.jsx
import React from 'react';
import { useAccount } from '../../src/context/AccountContext';

export default function PaymentMethods() {
  const { profile } = useAccount();
  const paymentMethods = profile?.paymentMethods || [];

  return (
    <div className="bg-white border border-ink shadow-card rounded-card p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sans font-extrabold text-2xl tracking-tight text-ink uppercase">
          PAYMENT METHODS
        </h2>
        <button className="bg-ink text-cream-text font-sans font-extrabold text-xs tracking-wider px-4 py-2 rounded-btn hover:bg-primary hover:text-white transition-all cursor-pointer">
          + ADD NEW
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method, idx) => (
          <div
            key={idx}
            className="p-5 border border-ink bg-cream rounded-btn flex flex-col gap-3 relative"
          >
            {idx === 0 && (
              <span className="absolute top-3 right-3 bg-highlight text-ink font-sans font-black text-[9px] px-2 py-0.5 border border-ink rounded-full">
                DEFAULT
              </span>
            )}
            <div className="font-sans font-extrabold text-base text-ink">{method}</div>
            <span className="font-mono text-xs text-muted">ACTIVE ACCOUNT METHOD</span>
          </div>
        ))}
      </div>
    </div>
  );
}