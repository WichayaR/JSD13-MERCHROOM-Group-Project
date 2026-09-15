// src/components/ui/OrderStatusBadge.jsx
import React from 'react';

export const OrderStatusBadge = ({ status }) => {
  const statusMap = {
    delivered: { label: 'DELIVERED', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    shipping: { label: 'SHIPPING', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    pending: { label: 'PENDING', bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-400' },
    cancelled: { label: 'CANCELLED', bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500' },
  };

  const config = statusMap[status?.toLowerCase()] || statusMap.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-[11px] font-extrabold tracking-wider w-fit ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};