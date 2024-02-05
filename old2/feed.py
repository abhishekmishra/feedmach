from dbutil import *
from datetime import datetime


class Feed:
    """
    An object representing an entry in the subscribed feeds.
    """

    def __init__(self, id, name, url, added_date):
        self.id = id
        self.name = name
        self.url = url
        self.added_date = added_date
        self.all_read = False
        self.last_modified = None
        self.last_checked = None

    def __str__(self):
        s = "id = " + str(self.id) + ", "
        s += "name = " + self.name + ", "
        s += "url = " + self.url + ", "
        s += "added_date = " + str(self.added_date) + ", "
        return s


def load_feeds():
    feeds = {}
    conn = get_conn()
    c = conn.cursor()
    c.execute('''
        SELECT f.*, cf.*, c.NAME CATEGORY_NAME FROM FEED f
        LEFT OUTER JOIN CATEGORY_FEED cf
        ON f.ID = cf.FEED_ID
        LEFT OUTER JOIN CATEGORY c
        ON c.ID = cf.CATEGORY_ID
    ''')
    while True:
        row = c.fetchone()
        if not row:
            break
        print(row)
        f = Feed(row['ID'], row['NAME'], row['URL'], row['ADDED_DATE'])
        feeds[row['URL']] = f
    close_conn(conn)
    return feeds


def is_feed_subscribed(url):
    conn = get_conn()
    c = conn.cursor()
    res = c.execute('SELECT * from FEED WHERE url = ?', (url, ))
    found = False
    for row in res:
        if row['URL'] == url:
            found = True
            break
    close_conn(conn)
    return found


def subscribe_feed(name, url, category=[]):
    for c in category:
        print('Adding category {}'.format(c))
        register_category(c)
        link_feed_to_category(url, c)
    if is_feed_subscribed(url):
        return
    conn = get_conn()
    c = conn.cursor()
    res = c.execute('INSERT INTO FEED(name, url, added_date) values (?, ?, ?)',
                    (name, url, datetime.now()))
    conn.commit()
    close_conn(conn)


def is_category_registered(category):
    conn = get_conn()
    c = conn.cursor()
    res = c.execute('SELECT * from CATEGORY WHERE name = ?', (category, ))
    found = False
    for row in res:
        if row['NAME'] == category:
            found = True
            break
    close_conn(conn)
    print('Found {}?: {}'.format(category, found))
    return found


def register_category(category):
    if is_category_registered(category):
        return
    conn = get_conn()
    c = conn.cursor()
    res = c.execute('INSERT INTO CATEGORY(name) values (?)',
                    (category, ))
    conn.commit()
    close_conn(conn)


def link_feed_to_category(feed_url, category):
    conn = get_conn()
    c = conn.cursor()
    res = c.execute(
        '''
        INSERT OR IGNORE INTO CATEGORY_FEED(CATEGORY_ID, FEED_ID)
        WITH t1 AS (
            Select id from FEED where url = ?
          ), t2 AS (
            Select id from CATEGORY where name = ?
          )
        select t1.id, t2.id from t1,t2
        ''', (feed_url, category))
    conn.commit()
    close_conn(conn)


def unsubscribe_feed_by_url(url):
    conn = get_conn()
    c = conn.cursor()
    c.execute('DELETE FROM FEED WHERE URL=?', (url, ))
    conn.commit()
    close_conn(conn)


if __name__ == "__main__":
    fs = load_feeds()
    for f in fs:
        print(f)
    subscribe_feed('testfeed', 'testurl')
    print('feed testurl is subscribed: {}'.format(is_feed_subscribed('testurl')))
    fs = load_feeds()
    for f in fs.values():
        print(f)
    unsubscribe_feed_by_url('testurl')
    print('feed testurl is subscribed: {}'.format(is_feed_subscribed('testurl')))
    fs = load_feeds()
    for f in fs:
        print(f)
