from openai import OpenAI
from bot.tools import sql
from bot.sql_parser import Parser
from bot.tool_caller import Caller
from dotenv import load_dotenv

import bot.table_sampler as s
import bot.prompts as p
import os

load_dotenv()
key = os.getenv('API_KEY')
client = OpenAI(api_key=key)
parser = Parser()
tool_caller = Caller([sql.sql])
sample = s.sample(["regions", "countries", "locations", "departments", "jobs", "employees", "dependents"])

def llm_call(message: str): 
        print(message)
        response = client.responses.create(model="gpt-3.5-turbo", input=message)
        return response.output[0].content[0].text

class AI():
    def __init__(self):
        pass

# assumes query is a data access request
    def call(self, query):
        response = llm_call(p.context.format(sample) + query)
        func, args = parser.parse(response)
        print(func, args)
        try:
             out = tool_caller.call(func, args)
        except ValueError:
             out = "Unable to query database."
        return (args, out)