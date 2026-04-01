'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 'md', className }) => {
  const radius = size === 'sm' ? 16 : size === 'md' ? 28 : 42;
  const stroke = size === 'sm' ? 3 : size === 'md' ? 5 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  const getColor = () => {
    if (score >= 8) return 'stroke-success';
    if (score >= 5) return 'stroke-warning';
    return 'stroke-danger';
  };

  const sizes = {
    sm: 'w-10 h-10 text-[10px]',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-xl',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizes[size], className)}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          className={cn('transition-all duration-1000 ease-out', getColor())}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--border)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute font-mono font-bold text-text-primary">
        {score.toFixed(1)}
      </span>
    </div>
  );
};
