// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function POST(req: Request) {
  const { messages } = await req.json()

  const question = messages[messages.length - 1].content
  console.log(question)

  const result = await fetch('http://34.174.16.226:80/api/routes/chat/', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'system_message': 'Answer the user question with a factual answer',
            'user_message': question
        })
    });

  console.log(result)

    const json = await result.json()
    if (json != null) {
        return new Response(json.response)
    }
    return new Response()
}

