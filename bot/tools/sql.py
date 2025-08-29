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
    out = cursor.fetchall()
    conn.close()
    return out
    