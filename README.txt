# Reach - local hosting + Postgres (pgAdmin 4)
1. Open pgAdmin 4 -> Servers -> PostgreSQL 18 -> Databases -> right-click Create > Database -> name: reach_db -> Save.
2. Copy .env.example to .env and put your postgres password:
   DB_PASSWORD=your_real_password
3. Install + run:
   pip install -r requirements.txt
   python db.py
   python app.py
4. Open http://localhost:5000  (form now saves to Postgres!)
5. Check pgAdmin: reach_db > Schemas > public > Tables > quotes > View Data.
API: /api/health /api/quote (POST) /api/quotes /api/subscribe
