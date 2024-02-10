import * as uuid from 'uuid';
import * as htmlparser2 from 'htmlparser2';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

// the download folder
// TODO: this should be loaded from config/environment
const downloadFolder = '.work';

export class RSSItem {
    media;        //media array
    id;           //id
    title: string;        //title
    link;         //link
    description;  //description
    pubDate;      //pubDate

    constructor(itemData: any) {
        // console.log(itemData);
        this.media = itemData.media;
        this.id = itemData.id;
        this.link = itemData.link;
        this.description = itemData.description;
        this.pubDate = itemData.pubDate;
    }
}

export class RSSFeed {
    /* feed details */
    feedUrl: string;
    feedTitle: string;
    feedDescription: string;
    feedDate: string;
    feedItems: RSSItem[];
    feedFolder: string;

    /* feed internals */
    latestFeedFilePath: string;

    constructor(feedUrl: string) {
        this.feedUrl = feedUrl;
        this.downloadFeed();
    }

    // download the feed at the given url
    downloadFeed() {
        fetch(this.feedUrl)
            .then(response => response.text())
            .then(data => {
                this.writeFeedFileToTemp(data);
                this.extractAndWriteFeedData();
            })
            .catch(error => console.error('Error:', error));
    }

    writeFeedFileToTemp(data: string) {
        const fileName = uuid.v4() + '-' + basename(this.feedUrl);
        this.latestFeedFilePath = join(downloadFolder, fileName);

        writeFileSync(this.latestFeedFilePath, data);
        console.log('downloaded ' + this.latestFeedFilePath);
    }

    /**
     * Replaces characters of a string which are not allowed in paths, with
     * an underscore. This allows the string to be used in a path.
     * 
     * @param {string} p 
     * @returns a string with invalid characters replaced with underscore
     */
    _normalizePath(p: string) {
        return p.replace(/[/\\?%*:|"'<>\s]/g, '_');
    }

    _setTitle(title: string) {
        this.feedTitle = title;
        this.feedFolder = join(downloadFolder, this._normalizePath(this.feedTitle));
        mkdirSync(this.feedFolder, { recursive: true });
    }

    extractAndWriteFeedData() {
        // console.log(data);
        const feedContents = readFileSync(this.latestFeedFilePath, 'utf8');
        // console.log(feedContents);
        const parseContent = htmlparser2.parseFeed(feedContents);
        this._setTitle(parseContent.title);
        this.feedDescription = parseContent.description;
        this.writeMeta();
        this.feedItems = [];
        for (let i = 0; i < parseContent.items.length; i++) {
            const itemTitle = parseContent.items[i].title;
            let filename = itemTitle;
            filename = this._normalizePath(filename);
            filename = join(this.feedFolder, filename + '.json');
            // console.log(itemTitle, filename);
            writeFileSync(filename, JSON.stringify(parseContent.items[i], null, 4));

            // add item to feedItems
            this.feedItems.push(new RSSItem(parseContent.items[i]));
        }

        // console.log(this.feedItems);
        console.log(`feed name is ${parseContent.title}`);

    }

    writeMeta() {
        writeFileSync(
            join(this.feedFolder, '____' + this._normalizePath(this.feedTitle) + '____.json'),
            JSON.stringify(
                {
                    feedTitle: this.feedTitle,
                    feedDate: this.feedDate,
                    feedDescription: this.feedDescription,
                    feedUrl: this.feedUrl
                },
                null, 4));
    }

}
