import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Film, 
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { CreditPlan, Transaction } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCredits: number;
  onAddCredits: (credits: number, planName: string, amountUSD: number) => void;
}

const MICRO_REFILL: CreditPlan = {
  id: 'pack_micro_001',
  name: 'Flash Refill (2 Videos)',
  priceUSD: 0.01,
  credits: 100,
  videoCountEst: 2,
  description: 'Special promotional top-up: generate 2 additional high-definition AI videos for just $0.01.',
  features: [
    '100 generation credits added immediately',
    'Renders 2 full 1080p cinematic videos',
    'Includes all camera motion rigs & styles',
    'No monthly subscription commitment',
  ],
  badge: 'Special $0.01 Flash Deal',
  highlight: true,
};

const SUBSCRIPTION_TIERS: CreditPlan[] = [
  {
    id: 'tier_starter',
    name: 'Starter Creator',
    targetAudience: 'For content creators & indie filmmakers',
    priceUSD: 9.99,
    credits: 1000,
    videoCountEst: 20,
    features: [
      '1,000 video credits per month',
      'Up to 20 Full HD 1080p videos',
      'All 7 cinematic director styles',
      'Standard motion rigs (Dolly, Pan, Orbit)',
      'High-speed cloud rendering',
      'Social media commercial license',
    ],
    isSubscription: true,
  },
  {
    id: 'tier_pro_director',
    name: 'Pro Director',
    targetAudience: 'For professional filmmakers & ad studios',
    priceUSD: 24.99,
    credits: 3500,
    videoCountEst: 70,
    features: [
      '3,500 video credits per month',
      'Up to 70 Full HD or 40+ 4K Ultra HD videos',
      'Full 4K Ultra HD Cinema resolution',
      'Advanced rigs: FPV Drone & Crane Pedestal',
      'AI Atmospheric Audio Soundscapes',
      'Priority GPU fast queue access',
      'Broadcast & commercial advertising rights',
    ],
    badge: 'Most Popular',
    highlight: true,
    isSubscription: true,
  },
  {
    id: 'tier_studio_enterprise',
    name: 'Studio Production',
    targetAudience: 'For VFX production houses & marketing agencies',
    priceUSD: 69.99,
    credits: 12000,
    videoCountEst: 240,
    features: [
      '12,000 video credits per month',
      'Up to 240 cinematic video generations',
      '4K 60fps ProRes 422 HQ master exports',
      'Unlimited parallel video rendering',
      'Dedicated high-throughput GPU nodes',
      'Enterprise REST API & team seats',
      'Dedicated production support',
    ],
    isSubscription: true,
  },
];

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  userCredits,
  onAddCredits,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');

  if (!isOpen) return null;

  const handleStartCheckout = (plan: CreditPlan) => {
    setSelectedPlan(plan);
    setCompletedTx(null);
  };

  const handleProcessPayment = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          type: selectedPlan.isSubscription ? 'subscription' : 'one_time',
          paymentMethod: 'card',
        }),
      });

      const data = await response.json();
      if (data.success) {
        const tx: Transaction = {
          id: data.transactionId,
          planName: selectedPlan.name,
          amountUSD: data.amountUSD,
          creditsGranted: data.creditsGranted,
          date: new Date().toLocaleDateString(),
          status: 'completed',
        };
        setCompletedTx(tx);
        onAddCredits(data.creditsGranted, selectedPlan.name, data.amountUSD);
      }
    } catch (err) {
      // Fallback local credit update
      const tx: Transaction = {
        id: 'TX_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        planName: selectedPlan.name,
        amountUSD: selectedPlan.priceUSD,
        creditsGranted: selectedPlan.credits,
        date: new Date().toLocaleDateString(),
        status: 'completed',
      };
      setCompletedTx(tx);
      onAddCredits(selectedPlan.credits, selectedPlan.name, selectedPlan.priceUSD);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ufg.ai Pricing & Credit Plans</span>
              </h2>
              <p className="text-xs text-neutral-400">
                100 points given on signup (first 2 videos free). Add more credits anytime or subscribe for monthly allowances.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Ribbon */}
        <div className="bg-neutral-900 px-6 py-3 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Current Available Balance:</span>
            <span className="font-mono font-bold tabular-nums text-amber-400 text-sm">{userCredits} credits</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400">({Math.floor(userCredits / 50)} standard videos available)</span>
          </div>
          <div className="text-neutral-400 hidden sm:block">
            50 credits = 1 Full HD Video
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6">
          
          {/* Completed Transaction View */}
          {completedTx ? (
            <div className="p-8 text-center space-y-4 bg-neutral-900/50 border border-emerald-500/30 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                We have credited <strong className="text-amber-400 font-mono">+{completedTx.creditsGranted} credits</strong> to your ufg.ai account. You are ready to generate more high-definition cinematic videos!
              </p>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-xs text-neutral-400 max-w-sm mx-auto text-left space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>Receipt ID:</span>
                  <span className="text-neutral-200">{completedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span className="text-neutral-200">{completedTx.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">${completedTx.amountUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>New Balance:</span>
                  <span className="text-amber-400 font-bold">{userCredits} Credits</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setCompletedTx(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
                >
                  View Other Plans
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors"
                >
                  Start Generating
                </button>
              </div>
            </div>
          ) : selectedPlan ? (
            /* Checkout Simulation Sheet */
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Order Summary</div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedPlan.name}</div>
                  <div className="text-xs text-neutral-400">
                    +{selectedPlan.credits} Credits ({selectedPlan.videoCountEst} Videos)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white font-mono">
                    ${selectedPlan.priceUSD.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {selectedPlan.isSubscription ? 'per month' : 'one-time'}
                  </div>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-4 bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Instant Payment Simulation</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sandbox Test Mode</span>
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Expires</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">CVC</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500">
                  Clicking below will simulate the transaction and immediately credit your account. No real charge occurs.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                  >
                    Back to Plans
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ${selectedPlan.priceUSD.toFixed(2)} & Add Credits</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Plan Showcase */
            <>
              {/* Highlighted $0.01 Micro-Refill Promo Box */}
              <div className="relative rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                        {MICRO_REFILL.badge}
                      </span>
                      <span className="text-xs text-amber-300 font-medium">Introductory Special</span>
                    </div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{MICRO_REFILL.name}</span>
                      <span className="text-amber-400 font-mono text-xl">$0.01</span>
                    </h3>
                    <p className="text-xs text-neutral-300 max-w-xl">
                      {MICRO_REFILL.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartCheckout(MICRO_REFILL)}
                    className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-2 active:scale-98"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Get 2 Videos for $0.01</span>
                  </button>
                </div>
              </div>

              {/* Tiered Subscriptions Section */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                    Tiered Monthly Subscriptions
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Need continuous rendering power? Choose a tier for recurring monthly credits, faster queues, and 4K cinema master exports.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <div
                      key={tier.id}
                      className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all ${
                        tier.highlight
                          ? 'border-amber-500/70 bg-neutral-900/90 shadow-lg'
                          : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                          {tier.badge}
                        </div>
                      )}

                      <div>
                        <div className="text-base font-bold text-white">{tier.name}</div>
                        <div className="text-[11px] text-neutral-400 mb-3">{tier.targetAudience}</div>

                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-extrabold text-white font-mono">${tier.priceUSD}</span>
                          <span className="text-xs text-neutral-400">/month</span>
                        </div>

                        <div className="bg-neutral-950/80 p-2.5 rounded border border-neutral-800/80 mb-4 text-xs">
                          <div className="flex justify-between items-center text-amber-400 font-mono font-semibold">
                            <span>{tier.credits.toLocaleString()} Credits</span>
                            <span>~{tier.videoCountEst} Videos</span>
                          </div>
                        </div>

                        <ul className="space-y-2 text-xs text-neutral-300 mb-6">
                          {tier.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleStartCheckout(tier)}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                          tier.highlight
                            ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md shadow-amber-500/20'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        }`}
                      >
                        Subscribe to {tier.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
