/**
 * file: index.mjs
 * 
 * date: 05/02/2024
 * author: Abhishek Mishra
 * 
 * feedmach is a CLI to download, extract and organize rss feeds.
 */
import { get } from 'http';
import { createWriteStream } from 'fs';
import { join, basename } from 'path';

const downloadFolder = '.work';

function downloadFeed(url)
{
    let fileName = basename(url);
    let filePath = join(downloadFolder, fileName);
    const file = createWriteStream(filePath);
    const request = get(url, function(response) {
        response.pipe(file);
        console.log('downloaded ' + filePath);
    });
}

downloadFeed('http://localhost:8000/feeds/all.rss.xml');
