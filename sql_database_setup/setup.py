import sqlite3
import os
import yaml

with open("config.yaml", "r") as f:
    config = yaml.load(f, Loader=yaml.FullLoader)

try:
    conn = sqlite3.connect(config["database"])
    cursor = conn.cursor()

    with open("sql_database_setup/hr_sample_create.sql", "r") as sql_file:
        script = sql_file.read()
    cursor.executescript(script)

    with open("sql_database_setup/hr_sample_fill_data.sql", "r") as sql_file:
        script = sql_file.read()
    cursor.executescript(script)

except sqlite3.Error as e:
    print(f"An SQLite3 error occured: {e}")
    if 'conn' in locals() and conn:
        conn.rollback()

finally:
    if 'conn' in locals() and conn:
        conn.close()