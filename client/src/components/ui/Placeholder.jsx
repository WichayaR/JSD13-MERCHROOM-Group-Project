export default function Placeholder({ label = 'Image', className = '' }) {
  return (
    <div
      className={`flex items-center justify-center bg-cream p-4 text-center text-xs font-medium text-muted select-none ${className}`}
    >
      <span>{label}</span>
    </div>
  );
}
