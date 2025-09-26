'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { WorkflowStorage, StoredWorkflow, StoredAnalysisResult } from '@/lib/localStorage';
import { BusinessProcess } from '@/lib/types';

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [workflows, setWorkflows] = useState<StoredWorkflow[]>([]);

  useEffect(() => {
    // Load workflows from localStorage on component mount
    const storedWorkflows = WorkflowStorage.getAllWorkflows();
    setWorkflows(storedWorkflows);
  }, []);

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actions = (
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => alert('Download All functionality coming soon!')}
        className="text-[#44444E] hover:text-[#37353E] font-medium transition-colors"
      >
        Download All
      </button>
      <Link
        href="/extract"
        className="bg-[#37353E] hover:bg-[#44444E] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        New Workflow
      </Link>
    </div>
  );

  return (
    <DashboardLayout 
      title="All Workflows"
      subtitle="Manage and review your extracted workflows"
      actions={actions}
    >
      <div className="space-y-6">
        {/* Header with count and search */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#37353E]">
            {filteredWorkflows.length} Workflows
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#44444E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#715A5A] rounded-lg bg-[#D3DAD9] text-[#37353E] focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E] w-64"
              />
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-[#D3DAD9] border border-[#715A5A] rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#37353E]/10 dark:bg-[#37353E]/20 rounded-lg">
                    <svg className="w-6 h-6 text-[#37353E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#37353E]">
                      {workflow.name}
                    </h3>
                    <p className="text-[#44444E] text-sm">
                      {workflow.steps} steps • {workflow.confidence}% confidence
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#715A5A] text-[#D3DAD9]">
                    {workflow.priority}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedWorkflow(workflow.id)}
                      className="text-[#44444E] hover:text-[#37353E] font-medium text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const { WorkflowStorage } = require('@/lib/localStorage');
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
                        className="text-[#44444E] hover:text-[#37353E] font-medium text-sm flex items-center"
                        title="Download Complete Report"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Complete Report
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {workflow.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && searchTerm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No workflows found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or clear the search to see all workflows.
            </p>
          </div>
        )}
      </div>

      {/* Workflow Detail Panel */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex z-50">
          {/* Overlay background - click to close */}
          <div 
            className="flex-1" 
            onClick={() => setSelectedWorkflow(null)}
          />
          
          {/* Right Panel */}
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-right flex flex-col h-full">
            {(() => {
              const workflow = workflows.find((w: any) => w.id === selectedWorkflow);
              if (!workflow) return null;

              // Use actual workflow data with fallbacks
              const workflowData = {
                stakeholders: workflow.stakeholders || ['No stakeholders identified'],
                painPoints: workflow.painPoints || ['No pain points identified'],
                opportunities: workflow.opportunities || ['No opportunities identified'],
                workflowSteps: workflow.workflow || []
              };

              const renderTabContent = () => {
                switch (activeTab) {
                  case 'Overview':
                    return (
                      <div className="space-y-6">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflow.confidence}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Confidence Level</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflowData.workflowSteps.length}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Process Steps</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflowData.stakeholders.length}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stakeholders</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflowData.painPoints.length}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pain Points</div>
                          </div>
                        </div>

                        {/* Process Information */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority Level</span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#715A5A] text-[#D3DAD9]">
                                {workflow.priority}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Automation Potential</span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                Medium
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pain Level</span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#715A5A] text-[#D3DAD9]">
                                Medium
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Process Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Process Summary
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            The {workflow.name} process involves multiple stakeholders and manual touchpoints that create inefficiencies. 
                            With {workflow.confidence}% confidence, we've identified key areas for improvement including automated workflows, 
                            digital documentation, and streamlined approval processes.
                          </p>
                        </div>
                      </div>
                    );

                  case 'Workflow':
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Process Flow ({workflowData.workflowSteps.length} Steps)
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {workflowData.workflowSteps.length > 0 ? `${workflowData.workflowSteps.length} steps identified` : 'No workflow steps available'}
                          </div>
                        </div>
                        
                        <div className="space-y-4 scroll-smooth">
                          {workflowData.workflowSteps.length > 0 ? workflowData.workflowSteps.map((step: any, index: number) => (
                            <div key={step.step} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                  {step.step}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{step.action}</h4>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-gray-500 dark:text-gray-400">Actor:</span>
                                      <span className="text-gray-700 dark:text-gray-300 ml-1">{step.actor}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                                      <span className="text-gray-700 dark:text-gray-300 ml-1">{step.duration}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 dark:text-gray-400">Tools:</span>
                                      <span className="text-gray-700 dark:text-gray-300 ml-1">{step.tools}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 dark:text-gray-400">Dependencies:</span>
                                      <span className="text-gray-700 dark:text-gray-300 ml-1">{step.dependencies}</span>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-gray-500 dark:text-gray-400">Bottlenecks:</span>
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ml-1">
                                      {step.bottlenecks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                              <p className="text-gray-600 dark:text-gray-400">No workflow steps available for this process.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );

                  case 'Stakeholders':
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Key Stakeholders ({workflowData.stakeholders.length})
                        </h3>
                        
                        <div className="space-y-3 scroll-smooth">
                          {workflowData.stakeholders.map((stakeholder: any, index: number) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                  {stakeholder.split(' ').map((word: any) => word[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{stakeholder}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {index === 0 ? 'Decision Maker' : 
                                     index === 1 ? 'Process Owner' : 
                                     index === 2 ? 'External Liaison' : 'End User'}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                {index === 0 ? 'Responsible for budget approvals and strategic decisions' :
                                 index === 1 ? 'Manages day-to-day operations and workflow efficiency' :
                                 index === 2 ? 'Coordinates with external vendors and partners' :
                                 'Executes routine tasks and provides process feedback'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'Pain Points':
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Identified Pain Points ({workflowData.painPoints.length})
                        </h3>
                        
                        <div className="space-y-3 scroll-smooth">
                          {workflowData.painPoints.map((painPoint: any, index: number) => (
                            <div key={index} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-0.5">
                                  <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-red-800 dark:text-red-300 text-sm mb-1">
                                    {index === 0 ? 'Process Inefficiency' :
                                     index === 1 ? 'Visibility Issues' :
                                     index === 2 ? 'Workflow Bottlenecks' :
                                     index === 3 ? 'Inconsistent Processes' : 'Quality Issues'}
                                  </h4>
                                  <p className="text-sm text-red-700 dark:text-red-300">{painPoint}</p>
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 mt-2">
                                    {index < 2 ? 'High Impact' : 'Medium Impact'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'Opportunities':
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Improvement Opportunities ({workflowData.opportunities.length})
                        </h3>
                        
                        <div className="space-y-3 scroll-smooth">
                          {workflowData.opportunities.map((opportunity: any, index: number) => (
                            <div key={index} className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                                  <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">
                                    {index === 0 ? 'Automation Initiative' :
                                     index === 1 ? 'Digital Transformation' :
                                     index === 2 ? 'Analytics & Reporting' :
                                     index === 3 ? 'Process Optimization' : 'System Integration'}
                                  </h4>
                                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">{opportunity}</p>
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                      {index < 2 ? 'High ROI' : 'Medium ROI'}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                      {index === 0 ? '3-6 months' :
                                       index === 1 ? '6-9 months' :
                                       index === 2 ? '1-3 months' :
                                       index === 3 ? '2-4 months' : '6-12 months'} timeline
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  default:
                    return null;
                }
              };

              return (
                <>
                  {/* Panel Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-[#37353E] flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {workflow.name}
                    </h2>
                    <button
                      onClick={() => setSelectedWorkflow(null)}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Panel Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                    <nav className="flex px-4">
                      {['Overview', 'Workflow', 'Stakeholders', 'Pain Points', 'Opportunities'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === tab
                              ? 'border-[#37353E] text-[#37353E] bg-white dark:bg-gray-900'
                              : 'border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="p-4">
                      {renderTabContent()}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
