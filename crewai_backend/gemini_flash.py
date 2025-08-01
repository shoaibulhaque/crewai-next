from langchain_google_genai import ChatGoogleGenerativeAI


def get_gemini_flash_llm():
    """Returns a Gemini Flash LLM instance for LangChain."""
    return ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest")
