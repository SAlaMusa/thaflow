"""
Configuration settings for the Business Process Analysis Server.
Contains all configurable constants and settings used across the application.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration settings."""

    # Server settings
    HOST = "0.0.0.0"
    PORT = 8000
    DEBUG = True
    RELOAD = True

    # API settings
    API_TITLE = "Business Process Analysis API"
    API_DESCRIPTION = "FastAPI-based server for structured business process analysis"
    API_VERSION = "1.0.0"

    # File upload settings
    UPLOAD_FOLDER = 'temp'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size
    MAX_FILE_SIZE_MB = MAX_FILE_SIZE // (1024 * 1024)

    # CORS settings
    CORS_ORIGINS = ["*"]  # Configure appropriately for production
    CORS_CREDENTIALS = True
    CORS_METHODS = ["*"]
    CORS_HEADERS = ["*"]

    # External API settings
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    # Default analysis values
    DEFAULT_CONFIDENCE = 85
    DEFAULT_PRIORITY = "Medium"
    DEFAULT_AUTOMATION_POTENTIAL = "Medium"
    DEFAULT_PAIN_LEVEL = "Medium"
    DEFAULT_FUNCTION = "General"
    DEFAULT_TYPE = "Core"

    # Analysis output settings
    ESTIMATED_ANNUAL_SAVINGS = 50000
    PARTICIPANT_SENTIMENT = "Neutral"

    @classmethod
    def validate_config(cls) -> bool:
        """Validate that required configuration is present."""
        if not cls.GEMINI_API_KEY:
            return False
        return True

    @classmethod
    def get_api_key_status(cls) -> bool:
        """Check if API key is configured."""
        return bool(cls.GEMINI_API_KEY)

# Create a global config instance
config = Config()