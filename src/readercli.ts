/**
 * file: index.mjs
 * 
 * date: 05/02/2024
 * author: Abhishek Mishra
 * 
 * feedmach is a CLI to download, extract and organize rss feeds.
 */
// import { get } from 'http';
import { Command } from 'commander';
import chalk from 'chalk';
import { RSSFeed } from './rssfeed';

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

