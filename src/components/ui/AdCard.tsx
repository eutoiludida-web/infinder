'use client'

import React from 'react';
import { Ad } from '@/types/frontend';
import { ScoreRing } from './ScoreRing';
import { Globe as FacebookIcon, Globe, Trophy } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { motion } from 'motion/react';

interface AdCardProps {
  ad: Ad;
  onClick?: () => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative glass-dark rounded-2xl overflow-hidden cursor-pointer hover:shadow-premium border border-border-subtle hover:border-accent/30 transition-all"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/5] relative overflow-hidden">
        <img
          src={ad.thumbnailUrl}
          alt={ad.headline}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-60" />

        {/* Platform Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={cn(
            "p-2 rounded-xl backdrop-blur-xl border border-border shadow-xl",
            ad.platform === 'meta' ? "bg-accent/40" : "bg-blue-500/40"
          )}>
            {ad.platform === 'meta' ? <FacebookIcon size={16} className="text-white" /> : <Globe size={16} className="text-white" />}
          </div>
          {ad.isNew && (
            <div className="px-3 py-1 bg-success text-white text-[10px] font-black rounded-full animate-pulse tracking-widest shadow-lg">
              NOVO
            </div>
          )}
        </div>

        {/* Winner Badge */}
        {ad.isWinner && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-warning text-black/80 text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-xl tracking-widest">
            <Trophy size={12} /> WINNER
          </div>
        )}

        {/* Score Ring */}
        {ad.score && (
          <div className="absolute bottom-4 right-4">
            <div className="w-12 h-12 rounded-full bg-bg-primary/40 backdrop-blur-md border border-border flex items-center justify-center text-sm font-mono font-bold text-success shadow-2xl">
              {ad.score}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
            {ad.competitorName}
          </span>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            {formatDate(ad.startDate)}
          </span>
        </div>
        <div>
          <h3 className="text-base font-display font-bold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
            {ad.headline}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed font-medium">
            {ad.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
