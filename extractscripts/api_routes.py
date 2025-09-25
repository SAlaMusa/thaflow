"""
API Route Handlers for Business Process Analysis Server.
Contains all FastAPI route endpoints and their business logic.
"""

import os
from fastapi import File, UploadFile, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from business_analyzer import BusinessProcessAnalyzer
from parser import BusinessAnalysisParser
from models import AnalysisResponse, StatusResponse, RootResponse, FileUploadError, AnalysisError
from config import config

# Create API router
router = APIRouter()

class FileValidator:
    """Utility class for validating uploaded files."""

    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Check if the uploaded file has an allowed extension."""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

    @staticmethod
    def validate_file_upload(file: UploadFile) -> None:
        """
        Validate uploaded file for type and basic requirements.

        Args:
            file: The uploaded file to validate

        Raises:
            FileUploadError: If file validation fails
        """
        if not file:
            raise FileUploadError("No file uploaded")

        if not file.filename:
            raise FileUploadError("No file selected")

        if not FileValidator.allowed_file(file.filename):
            allowed = ", ".join(config.ALLOWED_EXTENSIONS)
            raise FileUploadError(f"Invalid file type. Please upload {allowed.upper()} files only.")

    @staticmethod
    async def validate_file_size(file: UploadFile) -> bytes:
        """
        Read and validate file size.

        Args:
            file: The uploaded file to validate

        Returns:
            bytes: File content

        Raises:
            FileUploadError: If file is too large
        """
        file_content = await file.read()
        if len(file_content) > config.MAX_FILE_SIZE:
            raise FileUploadError(
                f"File too large. Maximum size is {config.MAX_FILE_SIZE_MB}MB"
            )
        return file_content

class AnalysisService:
    """Service class for handling business analysis operations."""

    def __init__(self):
        """Initialize the analysis service."""
        self.parser = BusinessAnalysisParser()

    def validate_api_key(self) -> str:
        """
        Validate that API key is configured.

        Returns:
            str: The API key

        Raises:
            AnalysisError: If API key is not configured
        """
        api_key = config.GEMINI_API_KEY
        if not api_key:
            raise AnalysisError("GEMINI_API_KEY environment variable not set")
        return api_key

    def analyze_file_content(self, file_content: bytes, filename: str, api_key: str) -> dict:
        """
        Analyze file content using the business analyzer.

        Args:
            file_content: Raw file bytes
            filename: Original filename
            api_key: Gemini API key

        Returns:
            dict: Analysis result from the business analyzer

        Raises:
            AnalysisError: If analysis fails
        """
        try:
            analyzer = BusinessProcessAnalyzer(api_key)
            result = analyzer.analyze_from_bytes(file_content, filename)

            if not result.get('success'):
                error_msg = result.get('error', 'Unknown analysis error')
                raise AnalysisError(f"Analysis failed: {error_msg}")

            return result

        except Exception as e:
            raise AnalysisError(f"Analysis failed: {str(e)}")

    def process_analysis_result(self, result: dict) -> AnalysisResponse:
        """
        Process the raw analysis result into structured format.

        Args:
            result: Raw analysis result from business analyzer

        Returns:
            AnalysisResponse: Structured analysis response
        """
        if result.get('success') and result.get('analysis'):
            structured_data = self.parser.parse_analysis(result['analysis'])
            return AnalysisResponse(
                success=True,
                analysis=structured_data,
                response_length=result.get('response_length', 0)
            )
        else:
            return AnalysisResponse(
                success=False,
                error=result.get('error', 'Analysis processing failed')
            )

# Initialize services
analysis_service = AnalysisService()

@router.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_transcript(file: UploadFile = File(...)):
    """
    Analyze uploaded transcript file using structured business process analyzer.

    Args:
        file: Uploaded file (TXT, PDF, or DOCX)

    Returns:
        AnalysisResponse: Structured analysis results

    Raises:
        HTTPException: For various error conditions
    """
    try:
        # Validate API configuration
        api_key = analysis_service.validate_api_key()

        # Validate file upload
        FileValidator.validate_file_upload(file)

        # Read and validate file size
        file_content = await FileValidator.validate_file_size(file)

        # Perform analysis
        result = analysis_service.analyze_file_content(file_content, file.filename, api_key)

        # Process and return structured results
        response = analysis_service.process_analysis_result(result)

        if response.success:
            return response
        else:
            return JSONResponse(
                content=response.dict(),
                status_code=500
            )

    except FileUploadError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except AnalysisError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )

@router.get("/api/status", response_model=StatusResponse)
async def get_status():
    """
    Get server status and configuration information.

    Returns:
        StatusResponse: Server status and configuration details
    """
    return StatusResponse(
        status="running",
        api_key_configured=config.get_api_key_status(),
        allowed_file_types=list(config.ALLOWED_EXTENSIONS),
        max_file_size_mb=config.MAX_FILE_SIZE_MB,
        upload_folder=config.UPLOAD_FOLDER
    )

@router.get("/", response_model=RootResponse)
async def root():
    """
    Root endpoint with API information and available endpoints.

    Returns:
        RootResponse: API metadata and endpoint information
    """
    return RootResponse(
        message=config.API_TITLE,
        version=config.API_VERSION,
        docs="/docs",
        status_endpoint="/api/status",
        analyze_endpoint="/api/analyze"
    )