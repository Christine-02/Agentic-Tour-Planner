# OpenAI/OpenRouter Setup Guide

This project uses OpenAI-compatible APIs (including OpenRouter) for LLM capabilities and embeddings.

## 1. Create a `.env` file

In the `backend-ai/app/` directory, create a `.env` file with the following content:

```
# OpenAI/OpenRouter API Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=meta-llama/llama-3.1-8b-instruct
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# ChromaDB persistent directory
CHROMA_DIR=./chroma_db
```

### Configuration Options

- **OPENAI_API_KEY**: Your API key (required)

  - For OpenRouter: Get from [OpenRouter Dashboard](https://openrouter.ai/keys)
  - For OpenAI: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

- **OPENAI_MODEL**: The model to use for LLM (optional, defaults to `gpt-3.5-turbo`)

  - For OpenRouter: Use model names like `meta-llama/llama-3.1-8b-instruct`
  - For OpenAI: Use model names like `gpt-4`, `gpt-3.5-turbo`

- **OPENAI_BASE_URL**: API endpoint URL (optional, defaults to OpenAI endpoint)

  - For OpenRouter: `https://openrouter.ai/api/v1`
  - For OpenAI: Leave empty or omit to use default OpenAI endpoint

- **CHROMA_DIR**: Directory for ChromaDB persistent storage (optional, defaults to `./chroma_db`)

## 2. Install Dependencies

Make sure you have installed all required packages:

```bash
cd backend-ai/app
pip install -r requirements.txt
```

## 3. Verify Setup

The application will automatically load environment variables from the `.env` file using `python-dotenv`.

You can verify it's working by:

- Checking the health endpoint: `http://localhost:8000/health`
- Making a trip planning request to `/plan_trip`

If the API key is not set, you'll receive an error message indicating the key is missing.

## Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Your API key should be kept secure and not shared publicly
- When using OpenRouter, make sure your API key has access to the model you're using
