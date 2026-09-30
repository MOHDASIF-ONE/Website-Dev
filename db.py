import os
USE_SQLITE_FALLBACK = False
_sqlite_conn = None

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_PG = True
except ImportError:
    HAS_PG = False

from dotenv import load_dotenv
load_dotenv()

def _wants_sqlite():
    # Use sqlite when DB_PASSWORD is missing/placeholder or USE_SQLITE=1
    pw = os.getenv("DB_PASSWORD", "")
    if os.getenv("USE_SQLITE", "") == "1":
        return True
    if not pw or pw == "CHANGE_ME":
        return True
    return False

def get_conn():
    """Postgres connection, or SQLite fallback (local dev without password)."""
    global USE_SQLITE_FALLBACK
    if _wants_sqlite() or not HAS_PG:
        USE_SQLITE_FALLBACK = True
        import sqlite3
        conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "reach.db"))
        conn.row_factory = sqlite3.Row
        return conn
    USE_SQLITE_FALLBACK = False
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "reach_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""))

def is_sqlite(conn=None):
    if conn is not None:
        return type(conn).__name__ == "Connection" and "sqlite" in type(conn).__module__
    return USE_SQLITE_FALLBACK or _wants_sqlite() or not HAS_PG

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    if is_sqlite(conn):
        cur.execute("""CREATE TABLE IF NOT EXISTS quotes(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          business_type TEXT NOT NULL,
          contact TEXT NOT NULL,
          plan TEXT NOT NULL,
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );""")
        cur.execute("""CREATE TABLE IF NOT EXISTS subscribers(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );""")
    else:
        cur.execute("""CREATE TABLE IF NOT EXISTS quotes(
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          business_type TEXT NOT NULL,
          contact TEXT NOT NULL,
          plan TEXT NOT NULL,
          message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );""")
        cur.execute("""CREATE TABLE IF NOT EXISTS subscribers(
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );""")
    conn.commit()
    try:
        cur.close()
    except Exception:
        pass
    try:
        conn.close()
    except Exception:
        pass
    mode = "SQLite (reach.db)" if is_sqlite() else "Postgres"
    print(f"DB ready [{mode}]: quotes + subscribers tables OK")

if __name__ == "__main__":
    init_db()

