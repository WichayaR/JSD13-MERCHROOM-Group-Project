// src/components/ui/FormField.jsx
import React from 'react';

export const FormField = ({ label, type = 'text', name, value, onChange, placeholder, isTextarea = false, rows = 3 }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={name} className="font-sans font-extrabold text-xs tracking-wider uppercase text-ink">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-3 font-sans text-sm text-ink bg-white border border-ink rounded-btn outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 transition-all resize-y"
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 font-sans text-sm text-ink bg-white border border-ink rounded-btn outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 transition-all"
        />
      )}
    </div>
  );
};