'use client';

import React from 'react';
import { MeetingOverview } from '@/lib/types';

interface MeetingOverviewCardProps {
  overview: MeetingOverview;
}

export default function MeetingOverviewCard({ overview }: MeetingOverviewCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800';
      case 'negative': return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800';
      case 'neutral': return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800';
      default: return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800';
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness.toLowerCase()) {
      case 'high': return 'text-[#D3DAD9] bg-[#44444E]';
      case 'medium': return 'text-[#D3DAD9] bg-[#715A5A]';
      case 'low': return 'text-[#D3DAD9] bg-[#37353E]';
      default: return 'text-[#D3DAD9] bg-[#715A5A]';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-[#D3DAD9] dark:bg-[#37353E] rounded-xl p-6 shadow-lg border border-[#715A5A]/20 dark:border-[#44444E]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#37353E] dark:text-[#D3DAD9]">📊 Meeting Overview</h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#37353E] dark:text-[#D3DAD9]">{overview.totalProcesses}</div>
          <div className="text-sm text-[#715A5A] dark:text-[#D3DAD9]/70">Processes Identified</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Automation Readiness */}
        <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm border border-[#715A5A]/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9]">🎯 Automation Readiness</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            overview.overallAutomationReadiness === 'High' 
              ? 'bg-[#37353E] text-[#D3DAD9]' 
              : overview.overallAutomationReadiness === 'Medium' 
              ? 'bg-[#715A5A] text-[#D3DAD9]' 
              : 'bg-[#44444E] text-[#D3DAD9]'
          }`}>
            {overview.overallAutomationReadiness}
          </span>
        </div>

        {/* Estimated Savings */}
        <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm border border-[#715A5A]/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9]">💰 Annual Savings</h3>
          </div>
          <div className="text-xl font-bold text-[#37353E] dark:text-[#D3DAD9]">
            {formatCurrency(overview.estimatedAnnualSavings)}
          </div>
        </div>

        {/* Participant Sentiment */}
        <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm border border-[#715A5A]/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9]">😊 Participant Sentiment</h3>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            overview.participantSentiment === 'Positive' 
              ? 'bg-[#37353E] text-[#D3DAD9]' 
              : overview.participantSentiment === 'Neutral' 
              ? 'bg-[#715A5A] text-[#D3DAD9]' 
              : 'bg-[#44444E] text-[#D3DAD9]'
          }`}>
            {overview.participantSentiment}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participants */}
        {overview.participants && overview.participants.length > 0 && (
          <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm border border-[#715A5A]/10">
            <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9] mb-3">👥 Participants</h3>
            <div className="flex flex-wrap gap-2">
              {overview.participants.map((participant, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#44444E] text-[#D3DAD9]">
                  {participant}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Functions */}
        {overview.primaryFunctions && overview.primaryFunctions.length > 0 && (
          <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm border border-[#715A5A]/10">
            <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9] mb-3">🏢 Functions</h3>
            <div className="flex flex-wrap gap-2">
              {overview.primaryFunctions.map((func, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#37353E] text-[#D3DAD9]">
                  {func}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Themes */}
      {overview.keyThemes && overview.keyThemes.length > 0 && (
        <div className="bg-[#D3DAD9]/50 dark:bg-[#44444E]/50 rounded-lg p-4 shadow-sm mt-6 border border-[#715A5A]/10">
          <h3 className="font-semibold text-[#37353E] dark:text-[#D3DAD9] mb-3">🎯 Key Themes</h3>
          <ul className="space-y-2">
            {overview.keyThemes.map((theme, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-[#715A5A] dark:bg-[#715A5A] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-[#37353E] dark:text-[#D3DAD9]">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
