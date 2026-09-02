import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  disabled,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-btn font-medium tracking-[0.25px] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses =
    {
      primary: 'bg-primary text-white hover:bg-primary/90',
      highlight: 'bg-highlight text-ink hover:brightness-95 font-semibold',
      outline: 'border border-ink/20 text-ink bg-transparent hover:border-ink hover:bg-ink/5',
      ghost: 'text-ink bg-transparent hover:bg-ink/5',
      dark: 'bg-ink text-cream-text hover:bg-ink/90',
    }[variant] || 'bg-primary text-white hover:bg-primary/90';

  const sizeClasses =
    {
      sm: 'h-9 px-4 text-[13px]',
      md: 'h-11 px-6 text-sm',
      lg: 'h-13 px-7 text-base',
    }[size] || 'h-11 px-6 text-sm';

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
