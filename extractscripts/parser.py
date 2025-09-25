"""
Business Analysis Parser Module.
Contains logic for parsing AI-generated business process analysis text into structured data.
"""

import re
from typing import List, Dict, Any
from models import (
    AnalysisResult,
    BusinessProcess,
    MeetingOverview,
    WorkflowStep,
    PriorityLevel,
    AutomationPotential,
    PainLevel,
    ProcessType
)
from config import config

class BusinessAnalysisParser:
    """Parser for converting AI analysis text to structured business process data."""

    def __init__(self):
        """Initialize the parser."""
        pass

    def parse_analysis(self, analysis_text: str) -> AnalysisResult:
        """
        Parse the business analyzer text output into structured JSON for the UI.

        Args:
            analysis_text: Raw text output from the AI business analyzer

        Returns:
            AnalysisResult: Structured analysis data
        """
        try:
            processes = self._extract_processes(analysis_text)

            # If no processes were extracted, create a default summary process
            if not processes:
                processes = [self._create_default_process()]

            meeting_overview = self._create_meeting_overview(processes)

            return AnalysisResult(
                meetingOverview=meeting_overview,
                processes=processes
            )

        except Exception as e:
            print(f"Error parsing analysis: {e}")
            return self._create_default_analysis_result()

    def _extract_processes(self, analysis_text: str) -> List[BusinessProcess]:
        """Extract individual processes from the analysis text."""
        processes = []

        # Try to split by the expected format first
        process_sections = re.split(r'====================\s*PROCESS #\d+:', analysis_text)

        # If that doesn't work, treat the entire text as one process
        if len(process_sections) <= 1:
            process_sections = [analysis_text]

        for i, section in enumerate(process_sections[1:] if len(process_sections) > 1 else process_sections, 1):
            try:
                process = self._parse_single_process(section, i)
                if process:
                    processes.append(process)
            except Exception as e:
                print(f"Error parsing process {i}: {e}")
                continue

        return processes

    def _parse_single_process(self, section: str, process_number: int) -> BusinessProcess:
        """Parse a single process section into a BusinessProcess object."""
        # Extract process name
        name = self._extract_process_name(section, process_number)

        # Extract basic information
        function = self._extract_field(section, 'Function', config.DEFAULT_FUNCTION)
        process_type = self._extract_process_type(section)
        priority = self._extract_priority(section)
        automation_potential = self._extract_automation_potential(section)
        pain_level = self._extract_pain_level(section)

        # Extract complex data
        stakeholders = self._extract_stakeholders(section)
        pain_points = self._extract_pain_points(section)
        opportunities = self._extract_opportunities(section)
        workflow = self._extract_workflow(section)

        return BusinessProcess(
            id=f"process-{process_number}",
            name=name,
            steps=len(workflow),
            confidence=config.DEFAULT_CONFIDENCE,
            priority=priority,
            automationPotential=automation_potential,
            painLevel=pain_level,
            function=function,
            type=process_type,
            stakeholders=stakeholders if stakeholders else ["Unknown"],
            painPoints=pain_points if pain_points else ["No specific pain points identified"],
            opportunities=opportunities if opportunities else ["Review for automation opportunities"],
            workflow=workflow if workflow else [self._create_default_workflow_step()]
        )

    def _extract_process_name(self, section: str, process_number: int) -> str:
        """Extract process name using multiple patterns."""
        patterns = [
            r'====================\s*\n(.+?)\n',
            r'Name:\s*(.+?)(?:\n|Function:)',
            r'Process.*?:\s*(.+?)(?:\n|\r)'
        ]

        for pattern in patterns:
            match = re.search(pattern, section)
            if match:
                return match.group(1).strip()

        return f"Extracted Process {process_number}"

    def _extract_field(self, section: str, field_name: str, default: str) -> str:
        """Extract a simple field value from the section."""
        pattern = f'{field_name}:\\s*(.+?)(?:\\n|Type:|Summary:|Automation|Priority:|Pain|$)'
        match = re.search(pattern, section)
        return match.group(1).strip() if match else default

    def _extract_process_type(self, section: str) -> ProcessType:
        """Extract and validate process type."""
        type_text = self._extract_field(section, 'Type', config.DEFAULT_TYPE)
        try:
            return ProcessType(type_text)
        except ValueError:
            return ProcessType.CORE

    def _extract_priority(self, section: str) -> PriorityLevel:
        """Extract and validate priority level."""
        priority_text = self._extract_field(section, 'Priority', config.DEFAULT_PRIORITY)
        try:
            return PriorityLevel(priority_text)
        except ValueError:
            return PriorityLevel.MEDIUM

    def _extract_automation_potential(self, section: str) -> AutomationPotential:
        """Extract and validate automation potential."""
        automation_text = self._extract_field(section, 'Automation Potential', config.DEFAULT_AUTOMATION_POTENTIAL)
        try:
            return AutomationPotential(automation_text)
        except ValueError:
            return AutomationPotential.MEDIUM

    def _extract_pain_level(self, section: str) -> PainLevel:
        """Extract and validate pain level."""
        pain_text = self._extract_field(section, 'Pain Level', config.DEFAULT_PAIN_LEVEL)
        try:
            return PainLevel(pain_text)
        except ValueError:
            return PainLevel.MEDIUM

    def _extract_stakeholders(self, section: str) -> List[str]:
        """Extract stakeholders from the section."""
        stakeholders = []

        # Look for internal stakeholders
        stakeholders_match = re.search(r'Internal Stakeholders:\s*(.+?)(?:\n|External)', section)
        if stakeholders_match:
            stakeholders_text = stakeholders_match.group(1)
            stakeholders = [s.strip() for s in stakeholders_text.split(',') if s.strip()]

        return stakeholders

    def _extract_pain_points(self, section: str) -> List[str]:
        """Extract pain points from the section."""
        pain_points = []
        pain_section = re.search(r'PAIN POINTS(.*?)(?:TRANSFORMATION|$)', section, re.DOTALL)

        if pain_section:
            pain_lines = pain_section.group(1).split('\n')
            for line in pain_lines:
                if any(keyword in line for keyword in ['Explicit Issues:', 'Manual Effort:', 'Impact:']):
                    clean_line = re.sub(r'(Explicit Issues:|Manual Effort:|Impact:)', '', line).strip()
                    if clean_line and clean_line not in pain_points:
                        pain_points.append(clean_line)

        return pain_points

    def _extract_opportunities(self, section: str) -> List[str]:
        """Extract transformation opportunities from the section."""
        opportunities = []
        opp_section = re.search(r'TRANSFORMATION OPPORTUNITIES(.*?)(?:====|$)', section, re.DOTALL)

        if opp_section:
            opp_lines = opp_section.group(1).split('\n')
            keywords = ['AI Opportunities:', 'Digital Transformation:', 'Business Automation:', 'Quick Wins:']

            for line in opp_lines:
                if any(keyword in line for keyword in keywords):
                    clean_line = re.sub(r'(' + '|'.join(keywords) + ')', '', line).strip()
                    if clean_line and clean_line not in opportunities:
                        opportunities.append(clean_line)

        return opportunities

    def _extract_workflow(self, section: str) -> List[WorkflowStep]:
        """Extract workflow steps from the section."""
        workflow = []
        workflow_section = re.search(r'AS-IS WORKFLOW MAPPING(.*?)(?:STAKEHOLDERS|$)', section, re.DOTALL)

        if workflow_section:
            steps = re.findall(r'Step (\d+):\s*(.+?)(?=Step \d+:|STAKEHOLDERS|$)',
                             workflow_section.group(1), re.DOTALL)

            for step_num, step_content in steps:
                workflow_step = self._parse_workflow_step(int(step_num), step_content)
                workflow.append(workflow_step)

        return workflow

    def _parse_workflow_step(self, step_number: int, step_content: str) -> WorkflowStep:
        """Parse a single workflow step."""
        lines = step_content.split('\n')
        actor_action = lines[0].strip() if lines else ""

        # Parse actor and action
        actor_match = re.search(r'(.+?)\s+does\s+(.+)', actor_action)
        if actor_match:
            actor = actor_match.group(1).strip()
            action = actor_match.group(2).strip()
        else:
            actor = "Unknown"
            action = actor_action or "Action needs clarification"

        # Extract additional details
        details = {
            'duration': "Unknown",
            'tools': "Unspecified",
            'dependencies': "None",
            'bottlenecks': "None"
        }

        for line in lines[1:]:
            for key in details.keys():
                if f'{key.title()}:' in line:
                    details[key] = line.split(f'{key.title()}:')[1].strip()

        return WorkflowStep(
            step=step_number,
            actor=actor,
            action=action,
            duration=details['duration'],
            tools=details['tools'],
            dependencies=details['dependencies'],
            bottlenecks=details['bottlenecks']
        )

    def _create_default_workflow_step(self) -> WorkflowStep:
        """Create a default workflow step when none can be extracted."""
        return WorkflowStep(
            step=1,
            actor="Unknown",
            action="Process details need further clarification",
            duration="Unknown",
            tools="Unspecified",
            dependencies="None",
            bottlenecks="None"
        )

    def _create_default_process(self) -> BusinessProcess:
        """Create a default process when analysis extraction fails."""
        return BusinessProcess(
            id="summary-1",
            name="General Business Process Analysis",
            steps=1,
            confidence=60,
            priority=PriorityLevel.MEDIUM,
            automationPotential=AutomationPotential.MEDIUM,
            painLevel=PainLevel.MEDIUM,
            function=config.DEFAULT_FUNCTION,
            type=ProcessType.CORE,
            stakeholders=["Various stakeholders mentioned"],
            painPoints=["Process details need further analysis"],
            opportunities=["Review transcript for specific improvement opportunities"],
            workflow=[WorkflowStep(
                step=1,
                actor="Team",
                action="Complete process analysis from meeting transcript",
                duration="Unknown",
                tools="Various",
                dependencies="Meeting participation",
                bottlenecks="Manual analysis required"
            )]
        )

    def _create_meeting_overview(self, processes: List[BusinessProcess]) -> MeetingOverview:
        """Create meeting overview from extracted processes."""
        return MeetingOverview(
            totalProcesses=len(processes),
            participants=["Meeting participants"],
            primaryFunctions=list(set(p.function for p in processes)),
            keyThemes=["Process improvement", "Automation opportunities"],
            overallAutomationReadiness="Medium",
            estimatedAnnualSavings=config.ESTIMATED_ANNUAL_SAVINGS,
            participantSentiment=config.PARTICIPANT_SENTIMENT
        )

    def _create_default_analysis_result(self) -> AnalysisResult:
        """Create default analysis result when parsing fails completely."""
        default_process = BusinessProcess(
            id="extracted-1",
            name="Extracted Business Process",
            steps=1,
            confidence=70,
            priority=PriorityLevel.MEDIUM,
            automationPotential=AutomationPotential.MEDIUM,
            painLevel=PainLevel.MEDIUM,
            function=config.DEFAULT_FUNCTION,
            type=ProcessType.CORE,
            stakeholders=["Team members"],
            painPoints=["Manual process analysis needed"],
            opportunities=["Further investigation required"],
            workflow=[WorkflowStep(
                step=1,
                actor="Team",
                action="Analyze and document process details",
                duration="Unknown",
                tools="Manual analysis",
                dependencies="Meeting transcript",
                bottlenecks="Limited detail in source"
            )]
        )

        overview = MeetingOverview(
            totalProcesses=1,
            participants=["Unknown"],
            primaryFunctions=[config.DEFAULT_FUNCTION],
            keyThemes=["Business Process Analysis"],
            overallAutomationReadiness="Medium",
            estimatedAnnualSavings=0,
            participantSentiment=config.PARTICIPANT_SENTIMENT
        )

        return AnalysisResult(
            meetingOverview=overview,
            processes=[default_process]
        )