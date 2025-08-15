class Rag():
    def __init__(self, model, embedding, database):
        """RAG description placeholder"""
        self.model = model
        self.embedding = embedding
        self.database = database

    def call(self, msg:str):
        embed = self.embedding(msg)
        similar_chunks = self.database.get_similar(embed)
        context = "\n".join(similar_chunks)
        prompt = f"Refer to the following information to answer the question:\n\n{context}\n\nQuestion: {msg}"
        response = self.model(prompt)
        return response
    
class Chatbot():
    def __init__(self, model, embedding, database, history):
        self.model = model
        self.embedding = embedding
        self.database = database
        self.history = history
    
    def call(self, msg:str, chat):
        self.history.append(msg)
        summary = self.history.summary()
        embed = self.embedding(summary)
        similar_chunks = self.database.get_similar(embed)
        similar_chunks = self.rerank(similar_chunks, summary)
        context = "\n".join(similar_chunks)
        prompt = f"Refer to the following information to answer the question:\n\n{context}\n\nQuestion: {summary}"
        response = self.model(prompt)
        return response
