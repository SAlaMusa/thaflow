'use client';

import React from 'react';
import { BusinessProcess } from '@/lib/types';
import WorkflowStepCard from './WorkflowStepCard';

interface ProcessCardProps {
  process: BusinessProcess;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#D3DAD9] bg-[#37353E] border-[#37353E]';
      case 'Medium': return 'text-[#D3DAD9] bg-[#715A5A] border-[#715A5A]';
      case 'Low': return 'text-[#D3DAD9] bg-[#44444E] border-[#44444E]';
      default: return 'text-[#D3DAD9] bg-[#44444E] border-[#44444E]';
    }
  };

  const getAutomationColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-[#D3DAD9] bg-[#37353E]';
      case 'Medium': return 'text-[#D3DAD9] bg-[#715A5A]';
      case 'Low': return 'text-[#D3DAD9] bg-[#44444E]';
      default: return 'text-[#D3DAD9] bg-[#44444E]';
    }
  };

  const getPainColor = (painLevel: string) => {
    switch (painLevel) {
      case 'High': return 'text-[#D3DAD9] bg-[#37353E]';
      case 'Medium': return 'text-[#D3DAD9] bg-[#715A5A]';
      case 'Low': return 'text-[#D3DAD9] bg-[#44444E]';
      default: return 'text-[#D3DAD9] bg-[#44444E]';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Core': return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
      case 'Support': return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
      case 'Management': return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
      default: return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
    }
  };

  return (
    <div className="bg-[#D3DAD9] dark:bg-[#37353E] rounded-xl shadow-lg border border-[#715A5A]/30 dark:border-[#44444E] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#37353E] to-[#44444E] px-6 py-4 text-[#D3DAD9]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">{process.name}</h2>
            <p className="text-[#D3DAD9]/80 text-sm">{process.function}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{process.confidence}%</div>
            <div className="text-xs text-[#D3DAD9]/70">Confidence</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-6 py-4 bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 border-b border-[#715A5A]/30">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(process.priority)}`}>
              {process.priority}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Priority</p>
          </div>
          
          <div className="text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAutomationColor(process.automationPotential)}`}>
              {process.automationPotential}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automation</p>
          </div>
          
          <div className="text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPainColor(process.painLevel)}`}>
              {process.painLevel}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pain Level</p>
          </div>
          
          <div className="text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(process.type)}`}>
              {process.type}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Type</p>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{process.steps}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Steps</p>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="p-6 space-y-6">
        {/* Stakeholders */}
        {process.stakeholders && process.stakeholders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">👥 Stakeholders</h3>
            <div className="flex flex-wrap gap-2">
              {process.stakeholders.map((stakeholder, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pain Points */}
        {process.painPoints && process.painPoints.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">⚠️ Pain Points</h3>
            <ul className="space-y-2">
              {process.painPoints.map((painPoint, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">{painPoint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Opportunities */}
        {process.opportunities && process.opportunities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💡 Opportunities</h3>
            <ul className="space-y-2">
              {process.opportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 dark:text-gray-300">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Workflow Steps */}
        {process.workflow && process.workflow.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔄 Workflow Steps</h3>
            <div className="space-y-4">
              {process.workflow.map((step, index) => (
                <WorkflowStepCard 
                  key={index} 
                  step={step} 
                  isLast={index === process.workflow.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
