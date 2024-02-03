CREATE TABLE IF NOT EXISTS FEED (
    ID NOT NULL INTEGER PRIMARY KEY,
    NAME NOT NULL TEXT,
    URL TEXT NOT NULL UNIQUE,
    ADDED_DATE NOT NULL NUMERIC
)

CREATE TABLE IF NOT EXISTS ENTRY (
    ID NOT NULL INTEGER PRIMARY KEY,
    ITEM_ID NOT NULL TEXT,
    PERMALINK NOT NULL TEXT,
    ADDED_DATE NOT NULL NUMERIC,
    PUBLISHED_DATE NOT NULL NUMERIC
)

CREATE TABLE IF NOT EXISTS FEED_ENTRY (
    FEED_ID NOT NULL INTEGER,
    ENTRY_ID NOT NULL INTEGER,
    FOREIGN KEY (FEED_ID) REFERENCES FEED(ID),
    FOREIGN KEY (ENTRY_ID) REFERENCES ENTRY(ID),
    PRIMARY KEY (FEED_ID, ENTRY_ID)
)

CREATE TABLE IF NOT EXISTS FEED_STATUS (
    FEED_ID NOT NULL INTEGER PRIMARY KEY,
    ALL_READ NOT NULL INTEGER,
    LAST_MODIFIED NOT NULL INTEGER,
    LAST_CHECKED NOT NULL INTEGER,
    FOREIGN KEY (FEED_ID) REFERENCES FEED(ID)
)

CREATE TABLE IF NOT EXISTS ENTRY_STATUS (
    ENTRY_ID NOT NULL INTEGER PRIMARY KEY,
    READ NOT NULL INTEGER,
    RATING NOT NULL INTEGER,
    JUNK NOT NULL INTEGER,
    AD NOT NULL INTEGER,
    CLICKBAIT NOT NULL INTEGER,
    FOREIGN KEY (ENTRY_ID) REFERENCES ENTRY(ID),
)