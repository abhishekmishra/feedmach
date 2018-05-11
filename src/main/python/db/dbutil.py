import os
import sqlite3


MURKH_DB = os.path.join(os.environ['HOME'], ".murkh/murkh.db")


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def get_conn():
    conn = sqlite3.connect(MURKH_DB)
    conn.row_factory = dict_factory
    return conn


def close_conn(conn):
    conn.close()
