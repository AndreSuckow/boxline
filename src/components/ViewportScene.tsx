"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
export default function ViewportScene({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={host}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      {visible ? children : null}
    </div>
  );
}
