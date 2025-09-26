'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { WorkflowStorage, StoredWorkflow, StoredAnalysisResult } from '@/lib/localStorage';
import WorkflowStepCard from '@/components/WorkflowStepCard';
import { WorkflowDownloader } from '@/lib/download';
import { WorkflowStep } from '@/lib/types';

export default function Editor() {
  const [storedWorkflows, setStoredWorkflows] = useState<StoredWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<StoredWorkflow | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<StoredWorkflow | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const workflows = WorkflowStorage.getAllWorkflows();
    setStoredWorkflows(workflows);
  }, []);

  const filteredWorkflows = storedWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.function.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditWorkflow = (workflow: StoredWorkflow) => {
    setEditingWorkflow({ ...workflow });
    setSelectedWorkflow(workflow);
    setIsEditing(true);
  };

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      WorkflowStorage.updateWorkflowWithSync(editingWorkflow);
      const updatedWorkflows = WorkflowStorage.getAllWorkflows();
      setStoredWorkflows(updatedWorkflows);
      setSelectedWorkflow(editingWorkflow);
      setIsEditing(false);
      setEditingWorkflow(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkflow(null);
    setIsEditing(false);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      WorkflowStorage.deleteWorkflow(workflowId);
      const updatedWorkflows = WorkflowStorage.getAllWorkflows();
      setStoredWorkflows(updatedWorkflows);
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
      }
    }
  };

  const updateWorkflowField = (field: keyof StoredWorkflow, value: any) => {
    if (editingWorkflow) {
      setEditingWorkflow({ ...editingWorkflow, [field]: value });
    }
  };

  const updateWorkflowStep = (stepIndex: number, field: keyof WorkflowStep, value: string) => {
    if (editingWorkflow) {
      const updatedSteps = [...editingWorkflow.workflow];
      updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], [field]: value };
      setEditingWorkflow({ ...editingWorkflow, workflow: updatedSteps });
    }
  };

  const addNewStep = () => {
    if (editingWorkflow) {
      const newStep: WorkflowStep = {
        step: editingWorkflow.workflow.length + 1,
        actor: '',
        action: '',
        duration: '',
        tools: '',
        dependencies: '',
        bottlenecks: 'None'
      };
      setEditingWorkflow({ 
        ...editingWorkflow, 
        workflow: [...editingWorkflow.workflow, newStep],
        steps: editingWorkflow.workflow.length + 1
      });
    }
  };

  const removeStep = (stepIndex: number) => {
    if (editingWorkflow && editingWorkflow.workflow.length > 1) {
      const updatedSteps = editingWorkflow.workflow.filter((_, index) => index !== stepIndex);
      // Renumber steps
      const renumberedSteps = updatedSteps.map((step, index) => ({ ...step, step: index + 1 }));
      setEditingWorkflow({ 
        ...editingWorkflow, 
        workflow: renumberedSteps,
        steps: renumberedSteps.length
      });
    }
  };

  return (
    <DashboardLayout 
      title="Workflow Editor" 
      subtitle="Edit and manage your business process workflows"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
        {/* Workflow List Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[#37353E] mb-4">Saved Workflows</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#44444E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-[#715A5A] rounded-lg bg-[#D3DAD9]/20 text-[#37353E] placeholder-[#44444E] focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E]"
              />
            </div>

            {/* Workflow List */}
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
              {filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedWorkflow?.id === workflow.id
                      ? 'border-[#37353E] bg-[#37353E]/10'
                      : 'border-[#715A5A] hover:border-[#37353E] hover:bg-[#D3DAD9]/10'
                  }`}
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setIsEditing(false);
                    setEditingWorkflow(null);
                  }}
                >
                  <h3 className="font-medium text-[#37353E] text-sm">{workflow.name}</h3>
                  <p className="text-xs text-[#44444E] mt-1">{workflow.steps} steps</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.confidence >= 90 ? 'bg-[#37353E] text-[#D3DAD9]' :
                      workflow.confidence >= 70 ? 'bg-[#715A5A] text-[#D3DAD9]' :
                      'bg-[#44444E] text-[#D3DAD9]'
                    }`}>
                      {workflow.confidence}%
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkflow(workflow);
                        }}
                        className="text-[#44444E] hover:text-[#37353E] text-xs px-2 py-1 rounded border border-[#715A5A] hover:border-[#37353E]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkflow(workflow.id);
                        }}
                        className="text-[#44444E] hover:text-[#37353E] text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredWorkflows.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#44444E]">
                  {searchTerm ? 'No workflows found matching your search.' : 'No workflows saved yet.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Workflow Editor/Details Panel */}
        <div className="lg:col-span-2">
          {selectedWorkflow ? (
            <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-6 space-y-6 shadow-sm">
              {isEditing && editingWorkflow ? (
                // Edit Mode
                <div>
                  {/* Edit Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#37353E]">Editing Workflow</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveWorkflow}
                        className="px-4 py-2 bg-[#37353E] text-[#D3DAD9] rounded-lg hover:bg-[#44444E] transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-[#715A5A] text-[#44444E] rounded-lg hover:bg-[#D3DAD9]/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Basic Info Editing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#37353E] mb-2">Workflow Name</label>
                      <input
                        type="text"
                        value={editingWorkflow.name}
                        onChange={(e) => updateWorkflowField('name', e.target.value)}
                        className="w-full px-3 py-2 border border-[#715A5A] rounded-lg focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E] text-[#37353E] bg-[#D3DAD9]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#37353E] mb-2">Function</label>
                      <input
                        type="text"
                        value={editingWorkflow.function}
                        onChange={(e) => updateWorkflowField('function', e.target.value)}
                        className="w-full px-3 py-2 border border-[#715A5A] rounded-lg focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E] text-[#37353E] bg-[#D3DAD9]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#37353E] mb-2">Priority</label>
                      <select
                        value={editingWorkflow.priority}
                        onChange={(e) => updateWorkflowField('priority', e.target.value as 'High' | 'Medium' | 'Low')}
                        className="w-full px-3 py-2 border border-[#715A5A] rounded-lg focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E] text-[#37353E] bg-[#D3DAD9]/20"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#37353E] mb-2">Automation Potential</label>
                      <select
                        value={editingWorkflow.automationPotential}
                        onChange={(e) => updateWorkflowField('automationPotential', e.target.value as 'High' | 'Medium' | 'Low')}
                        className="w-full px-3 py-2 border border-[#715A5A] rounded-lg focus:ring-2 focus:ring-[#37353E] focus:border-[#37353E] text-[#37353E] bg-[#D3DAD9]/20"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Workflow Steps Editing */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#37353E]">
                        Workflow Steps ({editingWorkflow.workflow.length})
                      </h3>
                      <button
                        onClick={addNewStep}
                        className="px-3 py-2 bg-[#715A5A] text-[#D3DAD9] rounded-lg hover:bg-[#44444E] transition-colors text-sm font-medium"
                      >
                        + Add Step
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {editingWorkflow.workflow.map((step, index) => (
                        <div key={index} className="border border-[#715A5A] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-[#37353E]">Step {step.step}</h4>
                            {editingWorkflow.workflow.length > 1 && (
                              <button
                                onClick={() => removeStep(index)}
                                className="text-[#44444E] hover:text-[#37353E] text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#44444E] mb-1">Actor</label>
                              <input
                                type="text"
                                value={step.actor}
                                onChange={(e) => updateWorkflowStep(index, 'actor', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-[#715A5A] rounded focus:ring-1 focus:ring-[#37353E] focus:border-[#37353E] bg-[#D3DAD9]/20 text-[#37353E]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#44444E] mb-1">Duration</label>
                              <input
                                type="text"
                                value={step.duration}
                                onChange={(e) => updateWorkflowStep(index, 'duration', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-[#715A5A] rounded focus:ring-1 focus:ring-[#37353E] focus:border-[#37353E] bg-[#D3DAD9]/20 text-[#37353E]"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-[#44444E] mb-1">Action</label>
                              <textarea
                                value={step.action}
                                onChange={(e) => updateWorkflowStep(index, 'action', e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-[#715A5A] rounded focus:ring-1 focus:ring-[#37353E] focus:border-[#37353E] bg-[#D3DAD9]/20 text-[#37353E]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#44444E] mb-1">Tools</label>
                              <input
                                type="text"
                                value={step.tools}
                                onChange={(e) => updateWorkflowStep(index, 'tools', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-[#715A5A] rounded focus:ring-1 focus:ring-[#37353E] focus:border-[#37353E] bg-[#D3DAD9]/20 text-[#37353E]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#44444E] mb-1">Dependencies</label>
                              <input
                                type="text"
                                value={step.dependencies}
                                onChange={(e) => updateWorkflowStep(index, 'dependencies', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-[#715A5A] rounded focus:ring-1 focus:ring-[#37353E] focus:border-[#37353E] bg-[#D3DAD9]/20 text-[#37353E]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#37353E]">{selectedWorkflow.name}</h2>
                      <p className="text-[#44444E] mt-1">{selectedWorkflow.function}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditWorkflow(selectedWorkflow)}
                        className="px-4 py-2 border border-[#37353E] text-[#37353E] rounded-lg hover:bg-[#37353E] hover:text-[#D3DAD9] transition-colors font-medium"
                      >
                        Edit Workflow
                      </button>
                      <button
                        onClick={() => {
                          const { WorkflowStorage } = require('@/lib/localStorage');
                          const { WorkflowDownloader } = require('@/lib/download');
                          
                          // Find the analysis result that contains this workflow
                          const allAnalysisResults = WorkflowStorage.getAllAnalysisResults();
                          const containingAnalysis = allAnalysisResults.find((result: StoredAnalysisResult) => 
                            result.analysisResult.processes.some(w => w.name === selectedWorkflow.name)
                          );
                          
                          if (containingAnalysis) {
                            WorkflowDownloader.downloadCompleteAnalysis(
                              containingAnalysis.analysisResult,
                              {
                                includeOverview: true,
                                includeProcesses: true,
                                includeWorkflows: true,
                                includeMetadata: true
                              }
                            );
                          } else {
                            alert('Could not find the complete analysis report for this workflow.');
                          }
                        }}
                        className="px-4 py-2 bg-[#37353E] text-[#D3DAD9] rounded-lg hover:bg-[#44444E] transition-colors font-medium"
                      >
                        Download Report
                      </button>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedWorkflow.confidence >= 90 ? 'bg-[#37353E] text-[#D3DAD9]' :
                        selectedWorkflow.confidence >= 70 ? 'bg-[#715A5A] text-[#D3DAD9]' :
                        'bg-[#44444E] text-[#D3DAD9]'
                      }`}>
                        {selectedWorkflow.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#37353E] mb-4">
                      Workflow Steps ({selectedWorkflow.workflow.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedWorkflow.workflow.map((step, index) => (
                        <WorkflowStepCard
                          key={index}
                          step={step}
                          isLast={index === selectedWorkflow.workflow.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-12 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 text-[#44444E]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#37353E] mb-2">Select a Workflow</h3>
              <p className="text-[#44444E]">
                Choose a workflow from the list to view and edit its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
