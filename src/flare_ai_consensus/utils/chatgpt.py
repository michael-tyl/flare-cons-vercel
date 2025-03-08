from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def request_chatgpt(msg: str):
    return client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": msg,
                }],
                model="gpt-4o-mini",
            )