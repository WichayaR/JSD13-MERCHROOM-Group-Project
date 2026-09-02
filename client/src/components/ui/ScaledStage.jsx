import { useEffect, useRef, useState } from 'react';

export default function ScaledStage({ width = 1320, height = 815, children, className = '' }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(Math.min(1, containerWidth / width));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div
        style={{
          width: `${width}px`,
          height: `${height * scale}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
