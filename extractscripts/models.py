"""
Data models and type definitions for the Business Process Analysis Server.
Defines the structure of all data objects used throughout the application.
"""

from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field
from enum import Enum

class PriorityLevel(str, Enum):
    """Process priority levels."""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class AutomationPotential(str, Enum):
    """Automation potential levels."""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class PainLevel(str, Enum):
    """Pain level indicators."""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ProcessType(str, Enum):
    """Types of business processes."""
    CORE = "Core"
    SUPPORT = "Support"
    MANAGEMENT = "Management"

class WorkflowStep(BaseModel):
    """Represents a single step in a business process workflow."""
    step: int = Field(..., description="Step number in the workflow")
    actor: str = Field(..., description="Person or role performing this step")
    action: str = Field(..., description="Description of the action taken")
    duration: str = Field(default="Unknown", description="Estimated time to complete this step")
    tools: str = Field(default="Unspecified", description="Tools or systems used in this step")
    dependencies: str = Field(default="None", description="Dependencies for this step")
    bottlenecks: str = Field(default="None", description="Identified bottlenecks in this step")

class BusinessProcess(BaseModel):
    """Represents a complete business process with all its details."""
    id: str = Field(..., description="Unique identifier for the process")
    name: str = Field(..., description="Human-readable name of the process")
    steps: int = Field(..., description="Number of steps in the workflow")
    confidence: int = Field(default=85, description="Confidence level of the analysis (0-100)")
    priority: PriorityLevel = Field(default=PriorityLevel.MEDIUM, description="Process priority level")
    automationPotential: AutomationPotential = Field(default=AutomationPotential.MEDIUM, description="Potential for automation")
    painLevel: PainLevel = Field(default=PainLevel.MEDIUM, description="Current pain level of the process")
    function: str = Field(..., description="Business function or department")
    type: ProcessType = Field(default=ProcessType.CORE, description="Type of process")
    stakeholders: List[str] = Field(default_factory=list, description="List of stakeholders involved")
    painPoints: List[str] = Field(default_factory=list, description="Identified pain points")
    opportunities: List[str] = Field(default_factory=list, description="Improvement opportunities")
    workflow: List[WorkflowStep] = Field(default_factory=list, description="Detailed workflow steps")

class MeetingOverview(BaseModel):
    """Overview summary of the meeting analysis."""
    totalProcesses: int = Field(..., description="Total number of processes identified")
    participants: List[str] = Field(default_factory=list, description="Meeting participants")
    primaryFunctions: List[str] = Field(default_factory=list, description="Primary business functions discussed")
    keyThemes: List[str] = Field(default_factory=list, description="Key themes from the meeting")
    overallAutomationReadiness: str = Field(default="Medium", description="Overall readiness for automation")
    estimatedAnnualSavings: int = Field(default=0, description="Estimated annual savings potential")
    participantSentiment: str = Field(default="Neutral", description="Overall sentiment of participants")

class AnalysisResult(BaseModel):
    """Complete analysis result containing overview and processes."""
    meetingOverview: MeetingOverview = Field(..., description="Meeting overview and summary")
    processes: List[BusinessProcess] = Field(default_factory=list, description="List of identified processes")

class AnalysisResponse(BaseModel):
    """API response for analysis endpoint."""
    success: bool = Field(..., description="Whether the analysis was successful")
    analysis: Optional[AnalysisResult] = Field(None, description="Analysis results if successful")
    response_length: Optional[int] = Field(None, description="Length of the AI response")
    error: Optional[str] = Field(None, description="Error message if analysis failed")

class StatusResponse(BaseModel):
    """API response for status endpoint."""
    status: str = Field(..., description="Server status")
    api_key_configured: bool = Field(..., description="Whether API key is configured")
    allowed_file_types: List[str] = Field(..., description="List of allowed file extensions")
    max_file_size_mb: int = Field(..., description="Maximum file size in MB")
    upload_folder: str = Field(..., description="Upload folder path")

class RootResponse(BaseModel):
    """API response for root endpoint."""
    message: str = Field(..., description="API welcome message")
    version: str = Field(..., description="API version")
    docs: str = Field(..., description="Documentation URL")
    status_endpoint: str = Field(..., description="Status endpoint URL")
    analyze_endpoint: str = Field(..., description="Analyze endpoint URL")

class FileUploadError(Exception):
    """Custom exception for file upload errors."""
    pass

class AnalysisError(Exception):
    """Custom exception for analysis errors."""
    pass