import sqlite3


def main(db):
    conn = sqlite3.connect(db)
    c = conn.cursor()
    c.execute(
        '''
        CREATE TABLE IF NOT EXISTS FEEDS
        (
            ID          NOT NULL INTEGER PRIMARY KEY,
            NAME        NOT NULL TEXT,
            URL         TEXT NOT NULL UNIQUE,
            ADDED_DATE  NOT NULL NUMERIC
        )
        '''
    )

    conn.commit()

    c.execute(
        '''
        INSERT INTO FEEDS VALUES
        (
            "blah-blah-blah-guid",
            "test feed",
            "http://abhishekmishra.in/test"
        )
        '''
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    rssmonkdb = "/Users/abhishekmishra/.rssmonk/rssmonk.db"
    main(rssmonkdb)