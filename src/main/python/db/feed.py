from db.dbutil import *
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
    feeds = []
    conn = get_conn()
    c = conn.cursor()
    c.execute('SELECT * FROM FEED')
    while True:
        row = c.fetchone()
        if not row:
            break
        print(row)
        f = Feed(row['ID'], row['NAME'], row['URL'], row['ADDED_DATE'])
        feeds.append(f)
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


def subscribe_feed(name, url):
    if is_feed_subscribed(url):
        return
    conn = get_conn()
    c = conn.cursor()
    res = c.execute('INSERT INTO FEED(name, url, added_date) values (?, ?, ?)',
                    (name, url, datetime.now()))
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
    for f in fs:
        print(f)
    unsubscribe_feed_by_url('testurl')
    print('feed testurl is subscribed: {}'.format(is_feed_subscribed('testurl')))
    fs = load_feeds()
    for f in fs:
        print(f)
