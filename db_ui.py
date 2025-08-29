import sqlite3
import yaml 

with open("config.yaml", "r") as f:
    config = yaml.load(f, Loader=yaml.FullLoader)

db_path = config['database']

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

while (True):
    command = input(":")
    if command == "exit":
        break
    try:
        cursor.execute(command)
    except sqlite3.OperationalError as e:
        print(f"Operational Error: {e}")
    except sqlite3.IntegrityError as e:
        print(f"Integrity Error: {e}")
    except sqlite3.Error as e:
        print(f"SQLite Error: {e}")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

conn.close()