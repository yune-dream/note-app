import os
import sqlite3
from datetime import datetime


class Database:
    """Database wrapper supporting SQLite (local) and PostgreSQL (Railway)."""
    
    def __init__(self):
        self.url = os.environ.get("DATABASE_URL", "")
        self.is_pg = bool(self.url)
        self._conn = None
    
    def connect(self):
        if self.is_pg:
            import psycopg2
            import psycopg2.extras
            self._conn = psycopg2.connect(self.url)
            self._conn.autocommit = False
        else:
            self._conn = sqlite3.connect("notes.db")
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA foreign_keys=ON")
        return self._conn
    
    def execute(self, sql, params=None):
        conn = self._conn if self._conn else self.connect()
        if self.is_pg:
            sql = sql.replace("?", "%s")
        if params:
            return conn.execute(sql, params)
        return conn.execute(sql)
    
    def commit(self):
        self._conn.commit()
    
    def close(self):
        if self._conn:
            self._conn.close()
            self._conn = None
    
    def insert(self, sql, params):
        """Insert and return the new row ID."""
        if self.is_pg:
            sql = sql.replace("?", "%s") + " RETURNING id"
            cursor = self.execute(sql, params)
            return cursor.fetchone()[0]
        else:
            cursor = self.execute(sql, params)
            return cursor.lastrowid


def get_db():
    return Database()


def init_db():
    url = os.environ.get("DATABASE_URL", "")
    conn = get_db()
    
    if url:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL DEFAULT '',
                content TEXT NOT NULL DEFAULT '',
                tags TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        """)
    else:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL DEFAULT '',
                content TEXT NOT NULL DEFAULT '',
                tags TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
    conn.commit()
    conn.close()


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
