'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  className?: string;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({ label, used, limit, className }) => {
  const percentage = Math.min((used / limit) * 100, 100);
  const isHigh = percentage > 80;
  const isFull = percentage >= 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
        <span className="text-text-secondary">{label}</span>
        <span className={cn(isFull ? "text-danger" : isHigh ? "text-warning" : "text-text-primary")}>
          {used} <span className="text-text-muted">/ {limit}</span>
        </span>
      </div>
      <div className="h-2.5 bg-surface rounded-full overflow-hidden border border-border-subtle p-[1.5px]">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-[0.16,1,0.3,1] rounded-full relative",
            isFull ? "bg-danger" : isHigh ? "bg-warning" : "bg-accent"
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};
