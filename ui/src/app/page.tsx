'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { WorkflowStorage, StoredWorkflow, StoredAnalysisResult } from '@/lib/localStorage';
import { BusinessProcess } from '@/lib/types';

export default function Dashboard() {
  const [storedWorkflows, setStoredWorkflows] = useState<StoredWorkflow[]>([]);
  const [storageStats, setStorageStats] = useState<any>(null);

  useEffect(() => {
    // Load stored workflows and stats
    const workflows = WorkflowStorage.getAllWorkflows();
    const stats = WorkflowStorage.getStorageStats();
    setStoredWorkflows(workflows);
    setStorageStats(stats);
  }, []);

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      WorkflowStorage.deleteWorkflow(workflowId);
      const updatedWorkflows = WorkflowStorage.getAllWorkflows();
      const updatedStats = WorkflowStorage.getStorageStats();
      setStoredWorkflows(updatedWorkflows);
      setStorageStats(updatedStats);
    }
  };
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Overview of your business process workflows"
    >
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#44444E]">Total Workflows</p>
                <p className="text-2xl font-bold text-[#37353E] mt-2">{storageStats?.totalWorkflows || 0}</p>
              </div>
              <div className="p-3 bg-[#37353E]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#37353E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#44444E]">Documents Processed</p>
                <p className="text-2xl font-bold text-[#37353E] mt-2">{storageStats?.totalAnalysisResults || 0}</p>
              </div>
              <div className="p-3 bg-[#37353E]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#37353E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#44444E]">Avg Confidence</p>
                <p className="text-2xl font-bold text-[#37353E] mt-2">0%</p>
              </div>
              <div className="p-3 bg-[#37353E]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#37353E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#44444E]">Avg Processing Time</p>
                <p className="text-2xl font-bold text-[#37353E] mt-2">45s</p>
              </div>
              <div className="p-3 bg-[#37353E]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#37353E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workflows */}
        {storedWorkflows.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#37353E]">
                Recent Workflows ({storedWorkflows.length})
              </h2>
              <Link
                href="/workflows"
                className="text-[#37353E] hover:text-[#44444E] font-medium transition-colors"
              >
                View All ?
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storedWorkflows.slice(0, 6).map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#37353E] text-sm">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-[#44444E] mt-1">
                        {workflow.function} • {workflow.steps} steps
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="text-[#44444E] hover:text-red-600 transition-colors"
                      title="Delete workflow"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        workflow.priority === 'High' ? 'bg-[#37353E] text-[#D3DAD9]' :
                        workflow.priority === 'Medium' ? 'bg-[#715A5A] text-[#D3DAD9]' :
                        'bg-[#44444E] text-[#D3DAD9]'
                      }`}>
                        {workflow.priority}
                      </span>
                      <span className="text-xs text-[#44444E]">
                        {workflow.confidence}% confidence
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          const { WorkflowDownloader } = require('@/lib/download');
                          
                          // Find the analysis result that contains this workflow
                          const analysisResults = WorkflowStorage.getAllAnalysisResults();
                          const containingResult = analysisResults.find((result: StoredAnalysisResult) => 
                            result.analysisResult.processes.some((process: BusinessProcess) => 
                              process.name === workflow.name && 
                              result.originalFileName === workflow.originalFileName
                            )
                          );
                          
                          if (containingResult) {
                            WorkflowDownloader.downloadAnalysisResult(
                              containingResult.analysisResult, 
                              'pdf', 
                              {
                                filename: `${workflow.originalFileName?.replace(/\.[^/.]+$/, "") || 'analysis'}_report`,
                                includeMetadata: true
                              }
                            );
                          } else {
                            alert('Could not find the complete analysis report for this workflow.');
                          }
                        }}
                        className="text-[#44444E] hover:text-[#37353E]"
                        title="Download Complete Report"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#715A5A]">
                    <p className="text-xs text-[#44444E]">
                      Extracted: {new Date(workflow.extractedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#44444E]">
                      Source: {workflow.originalFileName || 'Unknown File'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No Workflows State */
          <div className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 text-[#44444E]">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#37353E] mb-2">
              No workflows extracted yet
            </h3>
            <p className="text-[#44444E] mb-6">
              Upload a meeting transcript to extract business processes
            </p>
            <Link
              href="/extract"
              className="bg-[#37353E] hover:bg-[#44444E] text-[#D3DAD9] px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Extract Workflows
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
