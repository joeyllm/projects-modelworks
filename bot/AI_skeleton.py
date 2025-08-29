import bot.prompts as p

class AI():
    def __init__(self, parser, caller, model):
        self.parser = parser
        self.caller = caller
        self.model = model

# assumes query is a data access request
    def call(self, query):
        response = self.model(p.context + p.db_description + query)
        func, args = self.parser.parse(response)
        return (args, self.caller.call(func, args))