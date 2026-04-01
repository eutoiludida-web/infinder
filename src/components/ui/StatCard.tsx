'use client'

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.02]",
        className
      )}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <div className="p-3 w-fit bg-accent/10 rounded-xl border border-accent/20 group-hover:bg-accent group-hover:text-white transition-all duration-500">
            <Icon size={24} className="text-accent group-hover:text-white transition-colors" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-display font-black text-text-primary tracking-tight">
              {value}
            </h3>
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full w-fit",
              trend.isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            )}>
              {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.value}%
              <span className="text-text-muted font-medium ml-1">vs mes ant.</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-all" />
    </motion.div>
  );
};
