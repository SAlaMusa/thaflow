'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function HelpPage() {
  return (
    <DashboardLayout
      title="Help & Instructions"
      subtitle="Learn how to use CMU Flow for business process extraction"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Getting Started */}
        <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#37353E] rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#37353E]">Getting Started</h2>
          </div>

          <div className="space-y-6 text-[#44444E]">
            <div className="bg-gradient-to-r from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-lg p-4 border border-[#715A5A]/30">
              <p className="text-[#37353E]">
                <strong>CMU Flow</strong> is an intelligent AI-powered platform that transforms unstructured business documents
                into clear, actionable workflow diagrams. It automatically identifies processes, actors, dependencies, and
                optimization opportunities from your meeting transcripts and process documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-lg p-4 border border-[#715A5A]/30">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#44444E] rounded-full flex items-center justify-center mr-3">
                    <span className="text-[#D3DAD9] font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-semibold text-[#37353E]">Upload & Analyze</h3>
                </div>
                <p className="text-sm text-[#44444E]">
                  Simply drag and drop your meeting transcripts, process docs, or workflow descriptions.
                  Supports TXT and PDF up to 16MB.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-lg p-4 border border-[#715A5A]/30">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#715A5A] rounded-full flex items-center justify-center mr-3">
                    <span className="text-[#D3DAD9] font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-semibold text-[#37353E]">AI Processing</h3>
                </div>
                <p className="text-sm text-[#44444E]">
                  Advanced NLP algorithms extract business processes, identify actors, dependencies,
                  bottlenecks, and automation opportunities automatically.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-lg p-4 border border-[#715A5A]/30">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#37353E] rounded-full flex items-center justify-center mr-3">
                    <span className="text-[#D3DAD9] font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-semibold text-[#37353E]">Review & Export</h3>
                </div>
                <p className="text-sm text-[#44444E]">
                  Review extracted workflows with confidence scores, edit details, and export
                  professional reports as PDF files.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Guide */}
        <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#44444E] rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#37353E]">Page Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#37353E] rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 7 4-4 4 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#37353E]">Dashboard</h3>
              </div>
              <p className="text-sm text-[#44444E]">
                Central hub showing workflow metrics, recent extractions, and quick access to key features. View total workflows and documents processed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#44444E] rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#37353E]">Extract</h3>
              </div>
              <p className="text-sm text-[#44444E]">
                AI-powered document analysis engine. Upload files, view real-time processing, and get structured workflow output with confidence scores.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#715A5A] rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#37353E]">Workflows</h3>
              </div>
              <p className="text-sm text-[#44444E]">
                Comprehensive workflow library with search, filtering, and detailed views. Access stakeholder info, pain points, and improvement opportunities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#37353E] rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#37353E]">Editor</h3>
              </div>
              <p className="text-sm text-[#44444E]">
                Advanced workflow editor with tabbed interface. Modify workflow steps, update stakeholders, and refine process details with full editing capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#715A5A] rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#37353E]">Tips & Best Practices</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#D3DAD9]/25 to-[#D3DAD9]/15 rounded-xl p-5 border border-[#715A5A]/30">
              <h3 className="font-semibold text-[#37353E] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#715A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Document Preparation
              </h3>
              <ul className="space-y-3 text-sm text-[#37353E]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Encourage participants to clearly articulate problems and pain points during meetings
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Ensure everyone states their role, department, and responsibilities explicitly
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Have participants mention specific tools, systems, and platforms they use
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Guide discussions to include step-by-step process walkthroughs with timing
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <h3 className="font-semibold text-[#37353E] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Optimization Tips
              </h3>
              <ul className="space-y-3 text-sm text-[#44444E]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Include pain points, bottlenecks, and current process inefficiencies
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Mention automation opportunities and technology solutions explicitly
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Use standard business process terminology and industry language
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Include metrics, KPIs, and performance measurements where possible
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#D3DAD9]/20 to-[#D3DAD9]/10 rounded-xl p-5 border border-[#715A5A]/30">
              <h3 className="font-semibold text-[#37353E] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quality Assurance
              </h3>
              <ul className="space-y-3 text-sm text-[#44444E]">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Always review extracted workflows for accuracy and completeness
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Use the Editor to refine and add missing process details
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Validate stakeholder information and process dependencies
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#715A5A] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  Export finalized workflows for team review and documentation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#D3DAD9]/30 border border-[#715A5A] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#37353E] rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#D3DAD9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#37353E]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
              <h3 className="font-medium text-[#37353E] mb-2">What file formats are supported?</h3>
              <p className="text-sm text-[#44444E]">
                CMU Flow supports TXT and PDF files up to 16MB in size. For best results, use text-heavy documents with clear process descriptions.
              </p>
            </div>

            <div className="border-b border-[#715A5A]/30 pb-4">
              <h3 className="font-medium text-[#37353E] mb-2">How accurate is the AI extraction?</h3>
              <p className="text-sm text-[#44444E]">
                The AI provides confidence scores for each extracted process. Higher scores indicate more reliable extractions. Always review and edit results for accuracy.
              </p>
            </div>

            <div className="border-b border-[#715A5A]/30 pb-4">
              <h3 className="font-medium text-[#37353E] mb-2">Can I export my workflows?</h3>
              <p className="text-sm text-[#44444E]">
                Yes! You can download your workflows as PDF files for documentation, sharing, or further analysis.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#37353E] mb-2">What makes a good document for extraction?</h3>
              <p className="text-sm text-[#44444E]">
                Documents with detailed meeting transcripts, process walkthroughs, or step-by-step procedures work best. Include specific roles, tools, timing, and dependencies.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-[#37353E] to-[#44444E] rounded-lg p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Need More Help?</h2>
          <p className="mb-4">
            Have questions or need assistance with workflow extraction? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#37353E] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              📧 Contact Support
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[#37353E] transition-colors">
              📚 Documentation
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
