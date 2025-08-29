class Caller():
    def __init__(self, tools):
        self.tools = tools
    
    def call(self, name, args):
        for tool in self.tools:
            if name == tool.__name__:
                return tool(args)
        tools = [tool.__name__ for tool in self.tools]
        raise ValueError(f"Could not match name \"{name}\" to tool in {tools}")