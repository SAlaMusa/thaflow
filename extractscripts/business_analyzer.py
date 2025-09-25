#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Business Process Analyzer
Uses Google Gemini AI to analyze business process documents and transcripts
"""

import os
import io
import docx
import PyPDF2
import google.generativeai as genai
from typing import Dict, Any


class BusinessProcessAnalyzer:
    """Business process analyzer using Google Gemini AI."""

    def __init__(self, api_key: str):
        """Initialize the analyzer with Google Gemini API key."""
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def extract_text_from_bytes(self, file_content: bytes, filename: str) -> str:
        """Extract text content from file bytes based on file extension."""
        file_extension = filename.lower().split('.')[-1] if '.' in filename else ''

        if file_extension == 'txt':
            return file_content.decode('utf-8', errors='replace')

        elif file_extension == 'pdf':
            try:
                pdf_file = io.BytesIO(file_content)
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
            except Exception as e:
                raise Exception(f"Error reading PDF file: {str(e)}")

        elif file_extension == 'docx':
            try:
                doc_file = io.BytesIO(file_content)
                doc = docx.Document(doc_file)
                text = ""
                for paragraph in doc.paragraphs:
                    text += paragraph.text + "\n"
                return text
            except Exception as e:
                raise Exception(f"Error reading DOCX file: {str(e)}")

        else:
            raise Exception(f"Unsupported file type: {file_extension}")

    def analyze_from_bytes(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Analyze business processes from file bytes."""
        try:
            # Extract text from the file
            text_content = self.extract_text_from_bytes(file_content, filename)

            if not text_content.strip():
                return {
                    "success": False,
                    "error": "No readable text content found in the file"
                }

            # Create analysis prompt
            prompt = self._create_analysis_prompt(text_content)

            # Generate analysis using Gemini
            response = self.model.generate_content(prompt)

            if not response or not response.text:
                return {
                    "success": False,
                    "error": "No response generated from AI model"
                }

            return {
                "success": True,
                "analysis": response.text,
                "response_length": len(response.text)
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Analysis failed: {str(e)}"
            }

    def _create_analysis_prompt(self, text_content: str) -> str:
        """Create a detailed prompt for business process analysis."""
        return f"""
You are an expert business process analyst. Carefully read through the entire document and identify ALL business processes mentioned, no matter how briefly described. Look for:

- Workflows and procedures
- Tasks and activities
- Decision-making processes
- Communication flows
- Review and approval processes
- Development/deployment processes
- Quality assurance activities
- Administrative tasks
- Any other business activities

For EACH process you identify, provide a comprehensive analysis using this exact format:

====================
PROCESS #[NUMBER]: [Process Name]
====================

Name: [Clear, descriptive process name]
Function: [Business function/department - e.g., Development, QA, Operations, Management]
Type: [Core/Support/Management]
Priority: [High/Medium/Low - based on business impact]
Automation Potential: [High/Medium/Low - how easily it could be automated]
Pain Level: [High/Medium/Low - current level of problems/inefficiencies]

AS-IS WORKFLOW MAPPING:
Step 1: [Actor/Role] does [Specific action or task]
Duration: [Time estimate if mentioned, or "Not specified"]
Tools/Systems: [Systems, tools, or platforms used]
Dependencies: [What this step depends on]
Bottlenecks: [Identified delays or problems]

Step 2: [Actor/Role] does [Next action]
Duration: [Time estimate if mentioned, or "Not specified"]
Tools/Systems: [Systems used]
Dependencies: [Dependencies]
Bottlenecks: [Problems identified]

[Continue mapping ALL steps mentioned or implied...]

STAKEHOLDERS:
Primary Process Owner: [Name/Role if mentioned, or inferred role]
Internal Stakeholders: [All internal people/teams involved]
External Stakeholders: [External parties if any]

PAIN POINTS:
Explicit Issues: [Problems directly stated in the document]
Implied Issues: [Problems you can infer from the description]
Manual Effort: [Manual tasks that could be automated]
Time Delays: [Where time is wasted or things take too long]
Quality Issues: [Errors, inconsistencies, or quality problems]
Communication Gaps: [Information flow problems]
Impact: [Business impact of these issues]

TRANSFORMATION OPPORTUNITIES:
AI Opportunities: [Specific ways AI could help this process]
Automation Opportunities: [Tasks that could be automated]
Digital Transformation: [Digital tools or systems that could help]
Process Improvements: [Ways to streamline or optimize]
Quick Wins: [Easy improvements that could be implemented soon]
Long-term Improvements: [Bigger changes that would require more effort]

====================

IMPORTANT INSTRUCTIONS:
1. Read the ENTIRE document carefully before starting your analysis
2. Create a separate section for EVERY distinct business process mentioned
3. Even if a process is only briefly mentioned, include it and analyze based on what you can infer
4. Look for processes in meeting discussions, action items, problem descriptions, and casual mentions
5. If you're unsure about details, make reasonable inferences based on common business practices
6. Number each process clearly (PROCESS #1, PROCESS #2, etc.)
7. Be thorough - don't miss any processes, no matter how small

Document to analyze:

{text_content}

Begin your analysis now, ensuring you capture ALL processes mentioned in the document:
"""