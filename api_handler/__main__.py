from fastapi import FastAPI
from pydantic import BaseModel
from bot import AI
import uvicorn

class Query(BaseModel):
    message: str

app = FastAPI()

@app.post("/")
async def query_endpoint(query: Query):
    message = query.message
    bot = AI.bot()
    bot_response = bot.call(message)
    return {
        "sql" : bot_response[0], 
        "response" : bot_response[1]
    }

# uvicorn.run(app, host="0.0.0.0", port=7860)
uvicorn.run(app)