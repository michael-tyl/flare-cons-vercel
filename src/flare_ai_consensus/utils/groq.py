from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.environ.get("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1/chat/completions")

def request_groq(msg: str):
    return client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": msg,
                }],
                model="groq-2-latest",
            )