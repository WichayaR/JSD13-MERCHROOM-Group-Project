import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="size-4 shrink-0 text-muted/60" />}
            {item.to && !isLast ? (
              <Link to={item.to} className="transition hover:text-ink hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-ink' : ''}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
