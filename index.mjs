/**
 * file: index.mjs
 * 
 * date: 05/02/2024
 * author: Abhishek Mishra
 * 
 * feedmach is a CLI to download, extract and organize rss feeds.
 */
// import { get } from 'http';
import { createWriteStream, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, parse } from 'path';
import { Command } from 'commander';
import * as uuid from 'uuid';
import * as htmlparser2 from 'htmlparser2';
import chalk from 'chalk';

// the download folder
// TODO: this should be loaded from config/environment
const downloadFolder = '.work';

class RSSItem
{
  media;        //media array
  id;           //id
  title;        //title
  link;         //link
  description;  //description
  pubDate;      //pubDate

  constructor(itemData)
  {
    // console.log(itemData);
    this.media = itemData.media;
    this.id = itemData.id;
    this.link = itemData.link;
    this.description = itemData.description;
    this.pubDate = itemData.pubDate;
  }
}

class RSSFeed
{
  /* feed details */
  feedUrl;
  feedTitle;
  feedDescription;
  feedDate;
  feedItems;

  /* feed internals */
  latestFeedFilePath;

  constructor(feedUrl)
  {
    this.feedUrl = feedUrl;
    this.downloadFeed();
  }

  // download the feed at the given url
  downloadFeed()
  {
    fetch(this.feedUrl)
      .then(response => response.text())
      .then(data =>
      {
        this.writeFeedFileToTemp(data);
        this.extractAndWriteFeedData();
      })
      .catch(error => console.error('Error:', error));
  }

  writeFeedFileToTemp(data)
  {
    let fileName = uuid.v4() + '-' + basename(this.feedUrl);
    this.latestFeedFilePath = join(downloadFolder, fileName);

    writeFileSync(this.latestFeedFilePath, data);
    console.log(chalk.hex('#FFA500')('downloaded ' + this.latestFeedFilePath));
  }

  /**
   * Replaces characters of a string which are not allowed in paths, with
   * an underscore. This allows the string to be used in a path.
   * 
   * @param {string} p 
   * @returns a string with invalid characters replaced with underscore
   */
  _normalizePath(p)
  {
    return p.replace(/[/\\?%*:|"'<>\s]/g, '_');
  }

  _setTitle(title)
  {
    this.feedTitle = title;
    this.feedFolder = join(downloadFolder, this._normalizePath(this.feedTitle));
    mkdirSync(this.feedFolder, { recursive: true });
  }

  extractAndWriteFeedData()
  {
    // console.log(data);
    let feedContents = readFileSync(this.latestFeedFilePath, 'utf8');
    // console.log(feedContents);
    let parseContent = htmlparser2.parseFeed(feedContents);
    this._setTitle(parseContent.title);
    this.feedDescription = parseContent.description;
    this.writeMeta();
    this.feedItems = [];
    for (let i = 0; i < parseContent.items.length; i++)
    {
      let itemTitle = parseContent.items[i].title;
      let filename = itemTitle;
      filename = this._normalizePath(filename);
      filename = join(this.feedFolder, filename + '.json');
      // console.log(itemTitle, filename);
      writeFileSync(filename, JSON.stringify(parseContent.items[i], null, 4));

      // add item to feedItems
      this.feedItems.push(new RSSItem(parseContent.items[i]));
    }

    // console.log(this.feedItems);
    console.log(chalk.black.bgGreen(`feed name is ${parseContent.title}`));

  }

  writeMeta()
  {
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


// create the program object
const program = new Command();

// configure the cli program name and options
program
  .name('feedmach')
  .description(`feedmach is a CLI to download, extract, organize and read` +
    `RSS/ATOM feeds.`)
  .version('0.1.0');

program.command('add')
  .description('Subscribe to a new feed.')
  .argument('<string>', 'the feed url')
  .action((url, options) =>
  {
    const limit = options.first ? 1 : undefined;
    console.log(chalk.red.bgBlue.bold(`are you trying to add the feed "${url}"?`));
    new RSSFeed(url);
  });

program.command('list')
  .description('List feeds.')
  .option('-u, --unread', 'only feeds with unread article(s)')
  .action((options) =>
  {
    console.log(options.unread);
    const list_all = !options.unread;
    console.log(`listing all = ${list_all}`);
  });

program.parse();

// downloadFeed('http://localhost:8000/feeds/all.rss.xml');

