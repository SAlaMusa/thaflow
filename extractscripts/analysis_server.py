#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Business Process Analysis Server
Modular FastAPI-based server that provides REST API endpoints for structured business process analysis.
Integrates with the Next.js frontend UI.

This is the main application entry point that orchestrates all the modular components:
- config.py: Configuration management
- models.py: Data models and type definitions
- parser.py: Business analysis parsing logic
- api_routes.py: API route handlers
- business_analyzer.py: AI-powered analysis engine
"""

import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import config
from api_routes import router

# Ensure UTF-8 encoding for stdout
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Initialize FastAPI app with configuration
app = FastAPI(
    title=config.API_TITLE,
    description=config.API_DESCRIPTION,
    version=config.API_VERSION
)

# Add CORS middleware with configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_CREDENTIALS,
    allow_methods=config.CORS_METHODS,
    allow_headers=config.CORS_HEADERS,
)

# Include API routes
app.include_router(router)

# Ensure upload folder exists
os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)

def main():
    """Main entry point for the application."""
    import uvicorn

    print(f"Starting {config.API_TITLE}...")
    print(f"Server will run on http://{config.HOST}:{config.PORT}")
    print(f"API docs: http://{config.HOST}:{config.PORT}/docs")
    print(f"API endpoint: http://{config.HOST}:{config.PORT}/api/analyze")
    print(f"Status endpoint: http://{config.HOST}:{config.PORT}/api/status")
    print("Press Ctrl+C to stop the server")

    # Validate configuration before starting
    if not config.validate_config():
        print("⚠️  Warning: GEMINI_API_KEY not configured. Analysis will fail.")
        print("   Please set the GEMINI_API_KEY environment variable.")

    # Run the FastAPI server with uvicorn
    uvicorn.run(
        "analysis_server:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.RELOAD
    )

if __name__ == '__main__':
    main()