'use client';

import React, { useState, useCallback, useRef } from 'react';
import { WorkflowAPI, APIError } from '@/lib/api';
import { AnalysisResult } from '@/lib/types';

interface FileUploadProps {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  onAnalysisError?: (error: string) => void;
}

export default function FileUpload({ onAnalysisStart, onAnalysisComplete, onAnalysisError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isProcessingRef = useRef(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessingRef.current) {
      console.log('⚠️ Upload already in progress, ignoring drop');
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('🎯 File dropped for immediate analysis:', files[0].name);
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 handleFileSelect triggered');
    const files = e.target.files;

    if (files && files.length > 0) {
      if (isProcessingRef.current) {
        console.log('⚠️ Upload already in progress, ignoring file selection');
        return;
      }

      console.log('🚀 File selected for immediate analysis:', files[0].name);

      // Immediate processing - no additional confirmation needed
      try {
        await processFile(files[0]);
      } finally {
        // Clear the input value after processing to allow re-selecting the same file
        if (e.target) {
          console.log('🧹 Clearing input value');
          e.target.value = '';
        }
      }
    } else {
      console.log('⚠️ No files selected');
    }
  }, []);

  const processFile = async (file: File) => {
    console.log('🚀 ProcessFile called for:', file.name);
    
    // Prevent multiple simultaneous uploads using ref
    if (isProcessingRef.current) {
      console.log('⚠️ Upload already in progress, skipping...');
      return;
    }

    try {
      isProcessingRef.current = true;
      setIsAnalyzing(true);
      setUploadProgress(0);
      onAnalysisStart?.();

      console.log('🚀 Starting immediate analysis:', file.name, file.type, file.size);

      // Direct API call for immediate processing
      console.log('⚡ Processing file immediately...');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Analyze file
      console.log('📤 Calling WorkflowAPI.analyzeFile...');
      const result = await WorkflowAPI.analyzeFile(file);
      console.log('📥 API result received:', result);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.analysis) {
        console.log('✅ Analysis successful, calling onAnalysisComplete');
        onAnalysisComplete?.(result.analysis);
      } else {
        console.error('❌ Analysis failed:', result.error);
        throw new Error(result.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('🔥 ProcessFile error:', error);
      const errorMessage = error instanceof APIError ? error.message : 
                          error instanceof Error ? error.message : 
                          'An unexpected error occurred';
      onAnalysisError?.(errorMessage);
    } finally {
      isProcessingRef.current = false;
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-36">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragging ? 'border-[#37353E] bg-[#37353E]/5' : 'border-[#715A5A] hover:border-[#44444E]'}
          ${isAnalyzing ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="file-input"
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isAnalyzing}
        />

        <div className="space-y-4 flex flex-col items-center justify-center">
          {isAnalyzing ? (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-[#37353E] border-t-transparent rounded-full mx-auto"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-[#37353E]">Analyzing Document...</p>
                <div className="w-full bg-[#715A5A] rounded-full h-2">
                  <div
                    className="bg-[#37353E] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#44444E]">
                  {uploadProgress < 90 ? 'Uploading...' : 'Processing with AI...'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 text-[#37353E]">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-[#37353E]">
                  Drop your document here, or{' '}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🖱️ Upload button clicked');
                      const fileInput = document.getElementById('file-input') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      } else {
                        console.error('File input not found');
                      }
                    }}
                    className="text-[#37353E] hover:text-[#44444E] font-semibold transition-colors"
                  >
                    click to upload & analyze
                  </button>
                </p>
                <p className="text-sm text-[#44444E] mt-2">
                  Supports TXT and PDF files up to 16MB • Analysis starts automatically
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
        <p>📄 Upload meeting transcripts, process documentation, or workflow descriptions</p>
        <p>🚀 One click to upload and analyze • AI extracts workflows automatically</p>
      </div> */}
    </div>
  );
}
