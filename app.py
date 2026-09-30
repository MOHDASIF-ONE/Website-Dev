from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_conn, init_db, is_sqlite
import os
load_dotenv()
app=Flask(__name__, static_folder=".", static_url_path="")
CORS(app)
@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/api/health")
def health():
    try:
        c=get_conn(); c.close()
        mode="sqlite" if is_sqlite() else "postgres"
        return jsonify(ok=True, db="connected", mode=mode)
    except Exception as e:
        return jsonify(ok=False, error=str(e)), 500
@app.route("/api/quote", methods=["POST"])
def quote():
    d=request.get_json(force=True)
    if not all([d.get("name"),d.get("business_type"),d.get("contact"),d.get("plan")]):
        return jsonify(ok=False, error="Missing fields"), 400
    conn=get_conn()
    cur=conn.cursor()
    if is_sqlite(conn):
        cur.execute("INSERT INTO quotes(name,business_type,contact,plan,message) VALUES(?,?,?,?,?);",
            (d["name"],d["business_type"],d["contact"],d["plan"],d.get("message","")))
        nid=cur.lastrowid
    else:
        cur.execute("INSERT INTO quotes(name,business_type,contact,plan,message) VALUES(%s,%s,%s,%s,%s) RETURNING id;",
            (d["name"],d["business_type"],d["contact"],d["plan"],d.get("message","")))
        nid=cur.fetchone()[0]
    conn.commit()
    try: cur.close()
    except Exception: pass
    conn.close()
    return jsonify(ok=True, id=nid, msg="Quote saved! We reply in 24 hrs.")
@app.route("/api/quotes")
def quotes():
    conn=get_conn()
    if is_sqlite(conn):
        cur=conn.cursor()
        cur.execute("SELECT * FROM quotes ORDER BY id DESC LIMIT 50;")
        rows=[dict(r) for r in cur.fetchall()]
    else:
        from psycopg2.extras import RealDictCursor
        cur=conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM quotes ORDER BY id DESC LIMIT 50;")
        rows=list(cur.fetchall())
    try: cur.close()
    except Exception: pass
    conn.close()
    return jsonify(rows)
@app.route("/api/subscribe", methods=["POST"])
def sub():
    d=request.get_json(force=True)
    if not d.get("email"):
        return jsonify(ok=False, error="Email required"), 400
    try:
        conn=get_conn(); cur=conn.cursor()
        if is_sqlite(conn):
            cur.execute("INSERT OR IGNORE INTO subscribers(email) VALUES(?);",(d.get("email"),))
        else:
            cur.execute("INSERT INTO subscribers(email) VALUES(%s) ON CONFLICT DO NOTHING;",(d.get("email"),))
        conn.commit()
        try: cur.close()
        except Exception: pass
        conn.close()
        return jsonify(ok=True)
    except Exception as e:
        return jsonify(ok=False, error=str(e)), 400
if __name__=="__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT","5000")), debug=True)

