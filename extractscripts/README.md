# CMU Flow - Business Process Analysis Tool

AI-powered tool that transforms meeting transcripts into structured business process insights.

## Tools
- Python for scripting
- Google Gemini for extraction and content generation

## Features

- Extract business processes from documents
- Map workflows and identify bottlenecks
- Suggest automation opportunities
- Output structured JSON data

## Quick Start

**Prerequisites:** Python 3.8+, [Gemini API key](https://aistudio.google.com/app/apikey)

```bash
cd extractscripts
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_api_key" > .env
python analysis_server.py
```

**Access:** http://localhost:8000/docs

## Usage

**Supported files:** .txt, .pdf, .docx (16MB max)

```bash
curl -X POST "http://localhost:8000/api/analyze" -F "file=@meeting.txt"
```

## API Endpoints

- `POST /api/analyze` - Analyze document
- `GET /api/status` - Server status
- `GET /docs` - Interactive API docs

## Configuration

Set environment variables in `.env`:
```bash
GEMINI_API_KEY=your_api_key_here
HOST=0.0.0.0
PORT=8000
```