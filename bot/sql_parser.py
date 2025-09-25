class Parser():
    def __init__(self):
        self.state = "search"

    # Parse AI output for a function call 
    def parse(self, response: str):
        self.state = "search"
        name = ""
        args = ""
        i = 0
        while (i < len(response)):
            char = response[i]
            match self.state:
                case "search":
                    if char == '<':
                        self.state = "name"
                case "name":
                    if char == '>':
                        self.state = "arguments"
                    else:
                        name += char
                case "arguments":
                    if char == '<':
                        assert response[i+1] == '/'
                        self.state = "exit"
                    else:
                        if char == "\n":
                            args += " "
                        else:
                            args += char
                case "exit":
                    if char == ">":
                        self.state = "search"
            i += 1
        return (name, args)