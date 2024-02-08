/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

console.log('👋 This message is being logged by "renderer.ts", included via Vite');

import { NuTop, NuSingleLineText } from "ne0ui";
import { getSizeHint, NuSizeHint } from "ne0ui";
import { NuBorder } from "ne0ui";
import { NuButton, NuRowPanel, NuWindow } from "ne0ui";

// create the toplevel window
let top = new NuTop();

const showRow = new NuRowPanel({
    w: new NuSizeHint(100, 100, Infinity),
    h: 30,
});

let showBtn = new NuButton({
    w: 100,
    h: 30,
    text: 'Show',
});

let win0 = new NuWindow({
    w: 500,
    h: 301,
    bg: 'slategray'
});

top.appendRect(win0);
top.appendRect(showRow);
showRow.addComp(showBtn);

// center justify the text in the text control

// center the text element in parent
// and keep centered when parent is resized
win0.centerParent();
win0.getParent().onRectEvent('nu_resize', (evt) => {
    win0.centerParent();
});

showRow.centerParent();
showRow.getParent().onRectEvent('nu_resize', (evt) => {
    showRow.centerParent();
});
showRow.hide();

for (let i = 0; i < 9; i++) {
    // create and add a single line text control to the toplevel
    let text = new NuSingleLineText({
        w: new NuSizeHint(50, 50, Infinity),
        h: 30,
        border: new NuBorder(), //empty border
        text: 'Single line text #' + i,
        justify: 'center'
    });

    win0.addComp(text);
}

const lastRow = new NuRowPanel({
    w: new NuSizeHint(50, 50, Infinity),
    h: 30,
});
win0.addComp(lastRow);

const hideBtn = new NuButton({
    w: 100,
    h: 30,
    text: 'Hide',
});

lastRow.addComp(hideBtn, 'end');

hideBtn.on('click', () => {
    win0.hide();
    showRow.show();
});

showBtn.on('click', () => {
    win0.show();
    showRow.hide();
})