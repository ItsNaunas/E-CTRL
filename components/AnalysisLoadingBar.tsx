'use client';

import { useState, useEffect } from 'react';
import { useToastHelpers } from '@/lib/toast';

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  duration: number; // milliseconds
  progress: number; // 0-100
}

interface AnalysisLoadingBarProps {
  isVisible: boolean;
  mode: 'audit' | 'create';
  onComplete?: () => void;
  onCancel?: () => void;
}

const ANALYSIS_STEPS: Record<'audit' | 'create', AnalysisStep[]> = {
  audit: [
    {
      id: 'scraping',
      label: 'Fetching Product Data',
      description: 'Collecting information from Amazon listing...',
      duration: 4000,
      progress: 20
    },
    {
      id: 'analyzing',
      label: 'AI Analysis in Progress',
      description: 'Analyzing listing quality, keywords, and optimization opportunities...',
      duration: 10000,
      progress: 70
    },
    {
      id: 'generating',
      label: 'Generating Report',
      description: 'Compiling insights and recommendations...',
      duration: 3000,
      progress: 90
    },
    {
      id: 'finalizing',
      label: 'Finalizing Results',
      description: 'Preparing your comprehensive audit report...',
      duration: 10000,
      progress: 100
    }
  ],
  create: [
    {
      id: 'processing',
      label: 'Processing Input',
      description: 'Analyzing your product information...',
      duration: 3000,
      progress: 15
    },
    {
      id: 'researching',
      label: 'Market Research',
      description: 'Researching competitors and market trends...',
      duration: 6000,
      progress: 40
    },
    {
      id: 'optimizing',
      label: 'Content Optimization',
      description: 'Generating optimized title, bullets, and description...',
      duration: 8000,
      progress: 75
    },
    {
      id: 'keywords',
      label: 'Keyword Analysis',
      description: 'Identifying high-impact keywords for your listing...',
      duration: 6000,
      progress: 90
    },
    {
      id: 'finalizing',
      label: 'Finalizing Listing',
      description: 'Preparing your optimized Amazon listing...',
      duration: 4000,
      progress: 100
    }
  ]
};

export default function AnalysisLoadingBar({ isVisible, mode, onComplete, onCancel }: AnalysisLoadingBarProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const { info, warning } = useToastHelpers();
  const steps = ANALYSIS_STEPS[mode];
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setCurrentStepIndex(0);
      setProgress(0);
      setIsComplete(false);
      setTimeElapsed(0);
    }
  }, [isVisible]);

  // Progress simulation
  useEffect(() => {
    if (!isVisible || isComplete) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 100);
      
      // Calculate progress within current step
      const stepProgress = Math.min(100, (timeElapsed / currentStep.duration) * 100);
      const baseProgress = currentStepIndex > 0 
        ? steps[currentStepIndex - 1].progress 
        : 0;
      const stepWeight = currentStep.progress - baseProgress;
      const currentProgress = baseProgress + (stepProgress / 100) * stepWeight;
      
      setProgress(currentProgress);

      // Move to next step
      if (timeElapsed >= currentStep.duration) {
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setTimeElapsed(0);
        } else {
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, currentStepIndex, currentStep, timeElapsed, totalSteps, isComplete, onComplete, steps]);

  // Show warning if taking too long
  useEffect(() => {
    if (!isVisible) return;

    const warningTimer = setTimeout(() => {
      if (progress < 90) {
        warning(
          'Analysis taking longer than expected',
          'Complex listings require more detailed analysis. Please wait...'
        );
      }
    }, 25000); // 25 seconds

    return () => clearTimeout(warningTimer);
  }, [isVisible, progress, warning]);

  if (!isVisible) return null;

  const estimatedTimeRemaining = Math.max(0, Math.ceil(
    (steps.reduce((acc, step) => acc + step.duration, 0) - 
     steps.slice(0, currentStepIndex).reduce((acc, step) => acc + step.duration, 0) - 
     timeElapsed) / 1000
  ));

  return (
    <div className="fixed inset-0 bg-[#0B0B0C]/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        {/* Main Loading Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#296AFF] to-[#FF7D2B] rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-[#0B0B0C] rounded-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-[#296AFF] animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'audit' ? 'Analyzing Your Listing' : 'Creating Your Listing'}
            </h2>
            <p className="text-white/70">
              AI-powered analysis in progress. This usually takes 25-35 seconds.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/80 font-medium">
                Progress: {Math.round(progress)}%
              </span>
              <span className="text-sm text-white/60">
                ~{estimatedTimeRemaining}s remaining
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#296AFF] rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-white">
                {currentStep.label}
              </h3>
            </div>
            <p className="text-white/70 ml-5">
              {currentStep.description}
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3 mb-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index === currentStepIndex
                    ? 'bg-[#296AFF]/10 border border-[#296AFF]/20'
                    : index < currentStepIndex
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStepIndex
                    ? 'bg-[#296AFF] text-white animate-pulse'
                    : index < currentStepIndex
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white/60'
                }`}>
                  {index < currentStepIndex ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    index === currentStepIndex ? 'text-[#296AFF]' : 
                    index < currentStepIndex ? 'text-green-400' : 'text-white/60'
                  }`}>
                    {step.label}
                  </div>
                </div>
                <div className={`text-sm ${
                  index === currentStepIndex ? 'text-[#296AFF]/80' : 
                  index < currentStepIndex ? 'text-green-400/80' : 'text-white/40'
                }`}>
                  {index < currentStepIndex ? 'Complete' : 
                   index === currentStepIndex ? 'In Progress' : 'Pending'}
                </div>
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <div className="text-center">
              <button
                onClick={onCancel}
                className="text-white/60 hover:text-white/80 text-sm transition-colors"
              >
                Cancel Analysis
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Did you know?</h4>
          <p className="text-sm text-white/70">
            {mode === 'audit' 
              ? 'Our AI analyzes over 50 ranking factors to identify the biggest opportunities for your listing.'
              : 'We use advanced AI to create listings that are optimized for both Amazon\'s algorithm and human buyers.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
