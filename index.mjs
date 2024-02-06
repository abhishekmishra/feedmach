/**
 * file: index.mjs
 * 
 * date: 05/02/2024
 * author: Abhishek Mishra
 * 
 * feedmach is a CLI to download, extract and organize rss feeds.
 */
// import { get } from 'http';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { Command } from 'commander';
import * as uuid from 'uuid';
import * as htmlparser2 from 'htmlparser2';
import chalk from 'chalk';

// the download folder
// TODO: this should be loaded from config/environment
const downloadFolder = '.work';

class RSSFeed 
{
    feedUrl;
    filePath;
    
    constructor(feedUrl)
    {
        this.feedUrl = feedUrl;
        this.downloadFeed();
    }

    // download the feed at the given url
    downloadFeed() {
        let fileName = uuid.v4() + '-' + basename(this.feedUrl);
        this.filePath = join(downloadFolder, fileName);
        const file = createWriteStream(this.filePath);

        fetch(this.feedUrl)
        .then(response => response.text())
        .then(data => {
            // console.log(data);
            writeFileSync(this.filePath, data);
            console.log(chalk.hex('#FFA500')('downloaded ' + this.filePath));
            let feedContents = readFileSync(this.filePath, 'utf8');
            // console.log(feedContents);
            let parseContent = htmlparser2.parseFeed(feedContents);
            for(let i = 0; i < parseContent.items.length; i++)
            {
                console.log(parseContent.items[i].title);
            }
            console.log(chalk.black.bgGreen(`feed name is ${parseContent.title}`));
        })
        .catch(error => console.error('Error:', error));
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
  .action((url, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(chalk.red.bgBlue.bold(`are you trying to add the feed "${url}"?`));
    new RSSFeed(url);
  });

program.command('list')
  .description('List feeds.')
  .option('-u, --unread', 'only feeds with unread article(s)')
  .action((options)  => {
    console.log(options.unread);
    const list_all = !options.unread;
    console.log(`listing all = ${list_all}`);
  });

program.parse();

// downloadFeed('http://localhost:8000/feeds/all.rss.xml');

