/**
 * file: index.mjs
 * 
 * date: 05/02/2024
 * author: Abhishek Mishra
 * 
 * feedmach is a CLI to download, extract and organize rss feeds.
 */
import { get } from 'http';
import { createWriteStream, readFileSync } from 'fs';
import { join, basename } from 'path';
import { Command } from 'commander';
import * as htmlparser2 from 'htmlparser2';
import chalk from 'chalk';

// the download folder
// TODO: this should be loaded from config/environment
const downloadFolder = '.work';

// download the feed at the given url
function downloadFeed(url) {
  let fileName = basename(url);
  let filePath = join(downloadFolder, fileName);
  const file = createWriteStream(filePath);
  const request = get(url, function (response) {
    response.pipe(file);
    console.log(chalk.hex('#FFA500')('downloaded ' + filePath));
  });
  return filePath;
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
    let feedFile = downloadFeed(url);
    let feedContents = readFileSync(feedFile, 'utf8');
    let parseContent = htmlparser2.parseFeed(feedContents);
    console.log(chalk.black.bgGreen(`feed name is ${parseContent.title}`));
  });

program.parse();

// downloadFeed('http://localhost:8000/feeds/all.rss.xml');

