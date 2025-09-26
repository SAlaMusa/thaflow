'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Analytics() {
  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Insights and metrics for your workflows"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Coming soon - Advanced analytics and insights
        </p>
      </div>
    </DashboardLayout>
  );
}
