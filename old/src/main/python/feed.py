import feedparser

if __name__ == "__main__":
    f = feedparser.parse(r'/Users/abhishekmishra/tmp/rss samples/ndtvrss.xml')
    print(f['feed']['title'])
    print(f.feed.get('updated', 'No updated date.'))
    print(f.feed.get('published', 'No published date.'))
    print(f.version)
