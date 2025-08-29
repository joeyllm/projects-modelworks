from openai import OpenAI
from bot.AI_skeleton import AI
from bot.tools import sql
from bot.tool_call_parser import Parser
from bot.tool_caller import Caller
from dotenv import load_dotenv
import os

load_dotenv()

key = os.getenv('API_KEY')
print(key)
client = OpenAI(
        api_key=key
        )

def llm_call(message: str): 
        response = client.responses.create(model="gpt-3.5-turbo", input=message)
        return response.output[0].content[0].text

parser = Parser()
tool_caller = Caller([sql.sql])

def bot():
        bot = AI(parser, tool_caller, llm_call)
        return bot
