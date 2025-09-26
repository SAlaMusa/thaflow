'use client';

import React from 'react';
import { WorkflowStep } from '@/lib/types';

interface WorkflowStepCardProps {
  step: WorkflowStep;
  isLast?: boolean;
}

export default function WorkflowStepCard({ step, isLast = false }: WorkflowStepCardProps) {
  const getBottleneckColor = (bottlenecks: string) => {
    if (bottlenecks === 'None' || bottlenecks === 'none') return 'text-[#D3DAD9] bg-[#44444E]';
    return 'text-[#D3DAD9] bg-[#715A5A]';
  };

  const getDurationColor = (duration: string) => {
    return 'text-[#D3DAD9] bg-[#715A5A]';
  };

  return (
    <div className="relative">
      <div className="flex items-start space-x-4">
        {/* Step number indicator */}
        <div className="flex-shrink-0 w-8 h-8 bg-[#37353E] text-[#D3DAD9] rounded-full flex items-center justify-center text-sm font-bold">
          {step.step}
        </div>

        {/* Step content */}
        <div className="flex-1 bg-[#D3DAD9] rounded-lg border border-[#715A5A] p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <h4 className="font-semibold text-[#37353E] mb-1">Action</h4>
                <p className="text-[#44444E]">{step.action}</p>
              </div>
              
              <div className="mb-3">
                <h4 className="font-semibold text-[#37353E] mb-1">Actor</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#715A5A] text-[#D3DAD9]">
                  {step.actor}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-3">
                <h4 className="font-semibold text-[#37353E] mb-1">Duration</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDurationColor(step.duration)}`}>
                  {step.duration}
                </span>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold text-[#37353E] mb-1">Tools</h4>
                <p className="text-[#44444E] text-sm">{step.tools}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#715A5A]">
            <div>
              <h4 className="font-semibold text-[#37353E] mb-1">Dependencies</h4>
              <p className="text-[#44444E] text-sm">{step.dependencies}</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#37353E] mb-1">Bottlenecks</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBottleneckColor(step.bottlenecks)}`}>
                {step.bottlenecks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting line to next step */}
      {!isLast && (
        <div className="absolute left-4 top-12 w-0.5 h-6 bg-[#715A5A]"></div>
      )}
    </div>
  );
}
