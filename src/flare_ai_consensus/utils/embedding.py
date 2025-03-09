from openai import OpenAI
import numpy as np
import structlog
import asyncio

from dotenv import load_dotenv
import os


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL")


client = OpenAI(api_key=api_key, base_url=base_url)

def cosine_similarity(a: list[float], b: list[float]) -> float:
    import numpy as np
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def get_embeddings(response_text: dict[str, str]) -> dict[tuple[str, str], float]:
    """
    Get embeddings for a given response text.
    Args:
        response_text (dict[str, str]): A dictionary containing the response text.
    Returns:
        dict[tuple[str, str], float]
    """
    dict_convergence = {}
    keys = list(response_text.keys())
    values = list(response_text.values())
    response_embedding = None
    try:
        response_embedding = client.embeddings.create(input=values, model="text-embedding-3-small")
    except Exception as e:
        raise e
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
                key1, key2 = response_embedding.data[i].embedding, response_embedding.data[j].embedding
                sim = cosine_similarity(key1, key2)
                if (keys[i], keys[j]) in dict_convergence or (keys[j], keys[i]) in dict_convergence:
                    continue
                else:
                    dict_convergence[(keys[i], keys[j])] = sim
    return dict_convergence

def concatenate_embedding(responses: dict[tuple[str, str], float]) -> str:
    return "\n\n".join([f"{key}: {value}" for key, value in responses.items()])

'''
response_txt = {
                "chat_gpt": "In the ever-shifting landscape of contemporary society, the interplay between innovation and tradition forms a complex tapestry that invites both introspection and forward thinking. The dynamics of change are evident in the way communities embrace emerging technologies while still cherishing age-old practices passed down through generations. From the bustling urban centers where digital connectivity transforms daily interactions to the quiet rural expanses that maintain a timeless charm, the juxtaposition of past and present creates a unique mosaic of cultural expression. ", 
                "claude": "The realm of technology continues to expand, driving innovation that permeates every facet of modern existence. In a world where artificial intelligence, quantum computing, and renewable energy sources redefine what is possible, the pace of change is both exhilarating and daunting. Research laboratories and startup hubs alike buzz with activity as experts from diverse disciplines collaborate on projects that once belonged solely to the realm of science fiction. Complex algorithms now power decision-making processes, while vast networks of interconnected devices create ecosystems that are as intricate as they are efficient.",
                "deepseek":"Nature and art often serve as profound sources of inspiration, providing a counterbalance to the relentless march of technological progress. The beauty of the natural world, with its intricate ecosystems and vibrant biodiversity, offers a reminder of the delicate interdependence that sustains life. Artists, poets, and musicians draw upon these natural wonders to express a sense of wonder and resilience that transcends the mundane. In sprawling urban parks and secluded wilderness retreats, one can observe the interplay of light, color, and sound that evokes both nostalgia and hope. This creative synthesis is not limited to the aesthetic; it extends to the way communities harness natural resources and traditional wisdom to address modern challenges such as climate change and urban sustainability. ",
                "qwen":"In the ever-shifting landscape of contemporary society, the interplay between innovation and tradition forms a complex tapestry that invites both introspection and forward thinking. The dynamics of change are evident in the way communities embrace emerging technologies while still cherishing age-old practices passed down through generations. From the bustling urban centers where digital connectivity transforms daily interactions to the quiet rural expanses that maintain a timeless charm, the juxtaposition of past and present creates a unique mosaic of cultural expression. "
                }
print(concatenate_embedding(get_embeddings(response_txt)))
'''


