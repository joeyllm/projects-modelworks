import sqlite3
import yaml 

with open("config.yaml", "r") as f:
    config = yaml.load(f, Loader=yaml.FullLoader)
    db_path = config['database']

def sql(query: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute(query)
    except:
        print(conn.Error)
    columns = [info[0] for info in cursor.description]
    out = [tuple(columns)] + cursor.fetchall()
    conn.close()
    return out
    
'''
get examples of entries in the tables so that the AI understands the format of the data when writing SQL
'''
def sample(tables: list[str]): # NOT IMPLEMENTED
    output = ""
    for table in tables:
        data = sql(f"SELECT * FROM {table} LIMIT 2")
        out = "Table : " + table + "\nColumns : " + str(data[0]) + "\nEntries: " + str(data[1:]) + "\n"
        output += out
    return output
