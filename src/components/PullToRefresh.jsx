import React, { useState, useRef, useCallback } from "react";
import { Loader2, ArrowDown } from "lucide-react";

export default function PullToRefresh({ onRefresh, children, className = "" }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);
  const isPulling = useRef(false);

  const threshold = 80;

  const handleTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    // Only activate if scrolled to top
    const scrollTop = el.scrollTop || 0;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      // Dampen the pull
      const dampened = Math.min(diff * 0.4, 120);
      setPullDistance(dampened);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    if (pullDistance >= threshold && onRefresh) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.5);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        {isRefreshing ? (
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        ) : (
          <ArrowDown
            className="w-5 h-5 text-slate-400 transition-transform duration-200"
            style={{
              transform: `rotate(${progress >= 1 ? 180 : 0}deg)`,
              opacity: progress
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}