import React from 'react';
import { Film, Play, Clock, Sparkles, Download, Receipt, ArrowRight } from 'lucide-react';
import { GeneratedVideo, Transaction } from '../types';

interface UserLibraryProps {
  videos: GeneratedVideo[];
  transactions: Transaction[];
  onSelectVideo: (video: GeneratedVideo) => void;
  onGoToStudio: () => void;
  onOpenPricing: () => void;
}

export const UserLibrary: React.FC<UserLibraryProps> = ({
  videos,
  transactions,
  onSelectVideo,
  onGoToStudio,
  onOpenPricing,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">My Generation Library</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access and download your high-definition AI generated videos from this session.
          </p>
        </div>

        <button
          onClick={onGoToStudio}
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Video Generation</span>
        </button>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">No Generations Yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You currently have 100 welcome credits ready to use. Your first 2 video generations are completely free!
          </p>
          <div className="pt-2">
            <button
              onClick={onGoToStudio}
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all"
            >
              Start Your First Video
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-700 transition-all flex flex-col group"
            >
              <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                  onClick={() => onSelectVideo(vid)}
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-neutral-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </button>

                <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-400 font-bold bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                  {vid.resolution} · {vid.fps}
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-300 bg-neutral-950/80 px-1.5 py-0.5 rounded">
                  {vid.duration}
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs text-neutral-200 line-clamp-2">
                  {vid.prompt}
                </p>

                <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>{vid.cameraMotion.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-amber-400">{vid.creditCost} pts</span>
                  </div>

                  <button
                    onClick={() => onSelectVideo(vid)}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View / Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Credit & Transaction History */}
      <div className="pt-6 border-t border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Credit Top-Ups & Invoices</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Transaction history for micro-refills ($0.01 for 2 videos) and subscription plans.
            </p>
          </div>

          <button
            onClick={onOpenPricing}
            className="text-xs text-amber-400 hover:underline font-medium"
          >
            Refill Credits ($0.01)
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800 text-xs text-neutral-400">
            No top-ups purchased yet. You are currently using your complimentary 100 welcome credits.
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Transaction ID</th>
                  <th className="py-2.5 px-4 font-medium">Package</th>
                  <th className="py-2.5 px-4 font-medium">Credits Added</th>
                  <th className="py-2.5 px-4 font-medium">Amount</th>
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-900/30">
                    <td className="py-2.5 px-4 text-neutral-400">{tx.id}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-neutral-200">{tx.planName}</td>
                    <td className="py-2.5 px-4 text-amber-400 font-bold tabular-nums">+{tx.creditsGranted}</td>
                    <td className="py-2.5 px-4 tabular-nums">${tx.amountUSD.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-neutral-400">{tx.date}</td>
                    <td className="py-2.5 px-4">
                      <span className="text-emerald-400 text-[11px] font-sans font-medium">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
