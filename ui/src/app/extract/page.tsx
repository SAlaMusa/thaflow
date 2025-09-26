'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import MeetingOverviewCard from '@/components/MeetingOverviewCard';
import ProcessCard from '@/components/ProcessCard';
import { AnalysisResult } from '@/lib/types';

export default function ExtractPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setError(null);
    setIsAnalyzing(false);

    // Save to local storage
    try {
      const { WorkflowStorage } = require('@/lib/localStorage');
      const analysisId = WorkflowStorage.saveAnalysisResult(result);
      console.log('✅ Analysis result saved to local storage with ID:', analysisId);
    } catch (error) {
      console.error('❌ Failed to save to local storage:', error);
    }
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleStartOver = () => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const actions = analysisResult ? (
    <button
      onClick={handleStartOver}
      className="bg-[#37353E] hover:bg-[#44444E] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
    >
      New Analysis
    </button>
  ) : null;

  return (
    <DashboardLayout 
      title="Extract Workflows"
      subtitle="Upload documents to extract business processes and workflows"
      actions={actions}
    >
      <div className="space-y-8">
        {!analysisResult && !isAnalyzing && !error && (
          <div className="max-w-3xl mx-auto">
            {/* <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 text-blue-600">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload & Analyze Document
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                One click to upload and analyze meeting transcripts, process documentation, or workflow descriptions.
                AI automatically extracts and structures business processes.
              </p>
            </div> */}
            
            
            <FileUpload
            
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisError={handleAnalysisError}
            />
          </div>
        )}

        {isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center shadow-sm">
              <div className="animate-spin w-12 h-12 border-4 border-[#37353E] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Analyzing Document...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while our AI extracts business processes from your document.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center shadow-sm">
              <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Analysis Failed
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={handleStartOver}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-8">
            {/* Meeting Overview */}
            <MeetingOverviewCard overview={analysisResult.meetingOverview} />

            {/* Process Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📋 Extracted Processes ({analysisResult.processes.length})
                </h2>
                {analysisResult.processes.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        const { WorkflowDownloader } = require('@/lib/download');
                        WorkflowDownloader.downloadAnalysisResult(analysisResult, 'pdf', {
                          filename: 'workflow_analysis_report',
                          includeMetadata: true
                        });
                      }}
                      className="bg-[#37353E] hover:bg-[#44444E] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Complete Report
                    </button>
                  </div>
                )}
              </div>

              {analysisResult.processes.length > 0 ? (
                <div className="space-y-8">
                  {analysisResult.processes.map((process, index) => (
                    <ProcessCard key={process.id || index} process={process} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center shadow-sm">
                  <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Processes Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The document didn't contain identifiable business processes.
                    Try uploading a document with clear workflow descriptions or meeting transcripts.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
