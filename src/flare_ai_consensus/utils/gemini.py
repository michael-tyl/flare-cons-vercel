from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def request_gemini(msg):
    return client.models.generate_content(
                model="gemini-2.0-flash",
                contents=msg,
            )
