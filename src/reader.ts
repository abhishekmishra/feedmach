import { NuButton, NuColumnPanel, NuRowPanel, NuTop, NuSizeHint, NuSingleLineText, NuFont, NuLabel, NuMargin, NuWindow, NuDialog } from 'ne0ui';

// import { PlainTextEditorView } from './editor_view';

const toolbarButtonFont = new NuFont('Roboto,', 'normal', 1, 'em', 700);
const feedNameTextFont = new NuFont('Roboto,', 'normal', 1.4, 'em', 500);


interface ButtonConfig {
    w: number;
    h: number;
    margin: string;
    icon: string;
    text: string;
    font: NuFont;
}

export class ReaderTop extends NuTop {
    window: ReaderApp;

    constructor() {
        super();
        this.window = new ReaderApp();
        this.add(this.window);
        this.addClass('window');
    }
}

export class ReaderApp extends NuColumnPanel {
    toolbarPanel: NuRowPanel;
    statusbarPanel: NuRowPanel;
    contentRow: NuRowPanel;
    leftPanel: NuColumnPanel;
    rightPanel: NuColumnPanel;
    centerPanel: NuColumnPanel;

    newFeedDialog: NuDialog;

    leftPanelMinWidth = 300;
    leftPanelMaxWidth = 500;
    rightPanelMinWidth = 300;
    rightPanelMaxWidth = 500;

    // data
    private _feeds: any[] = [];

    constructor() {
        super({
            w: new NuSizeHint(800, 120, Infinity),
            h: new NuSizeHint(500, 120, Infinity),
        });

        this.addClass('window-body');

        this._feeds = ["dude it is a feed1", "dude it is a feed2", "dude it is a feed3"];

        this.createToolbar();

        this.createContentRow();

        this.createStatusbar();

        this.newFeedDialog = new NuDialog();
    }

    createContentRow() {
        this.contentRow = new NuRowPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
        });

        this.leftPanel = new NuColumnPanel({
            w: new NuSizeHint(this.leftPanelMinWidth, this.leftPanelMinWidth, this.leftPanelMaxWidth),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
            // bg: 'lightgray'
        });

        this.leftPanel.addClass('window');

        this.centerPanel = new NuColumnPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
            // bg: 'lightgray'
        });

        this.centerPanel.addClass('window');

        this.rightPanel = new NuColumnPanel({
            w: new NuSizeHint(this.rightPanelMinWidth, this.rightPanelMinWidth, this.rightPanelMaxWidth),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
            // bg: 'lightgray'
        });

        this.rightPanel.addClass('window');

        this.addComp(this.contentRow);
        this.contentRow.addComp(this.leftPanel);
        this.contentRow.addComp(this.centerPanel);
        this.contentRow.addComp(this.rightPanel);

        for (const feed in this._feeds) {
            const feedNameDisplay = new NuSingleLineText({
                text: this._feeds[feed],
                w: new NuSizeHint(120, 120, Infinity),
                h: 32,
                font: feedNameTextFont,
                margin: new NuMargin(2, 10, 2, 2),
            });
            feedNameDisplay.setElemStyle('display', 'inline-flex');
            feedNameDisplay.setElemStyle('justify-content', 'right'); /* center the content horizontally */
            feedNameDisplay.setElemStyle('align-items', 'center'); /* center the content vertically */
    
            this.leftPanel.addComp(feedNameDisplay);
        }
    }

    createToolbar() {
        // create a row panel
        this.toolbarPanel = new NuRowPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: 36,
            margin: '2px',
        });

        this.addComp(this.toolbarPanel);

        const addFeedButton = this.createToolbarButton('file-earmark', 'Add Feed');
        this.toolbarPanel.addComp(addFeedButton);
        addFeedButton.on('click', () => {
            this.newFeedDialog.dialogElem.showModal(); // show the dialog
            console.log('btn2 is working');
        });

        const refreshFeedButton = this.createToolbarButton('arrow-clockwise', 'Refresh Feed');
        this.toolbarPanel.addComp(refreshFeedButton);
        const refreshAllButton = this.createToolbarButton('arrow-clockwise', 'Refresh All');
        this.toolbarPanel.addComp(refreshAllButton);
        const preferencesButton = this.createToolbarButton('gear', 'Preferences');
        this.toolbarPanel.addComp(preferencesButton);
    }

    createStatusbar() {
        // create a row panel
        this.statusbarPanel = new NuRowPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: 27,
            margin: '2px',
        });

        const editorServerStatusText = new NuSingleLineText({
            w: 80,
            h: 24,
            text: 'Editor status...'
        });
        editorServerStatusText.addClass('status-bar-field');
        this.statusbarPanel.addComp(editorServerStatusText, 'end');

        this.statusbarPanel.addElemClass('status-bar');

        this.addComp(this.statusbarPanel);
    }

    createToolbarButton(icon: string, label: string) {
        const btn = new NuButton(buttonConfig('bi bi-' + icon + ' toolbar-btn-icon', label));
        btn.setElemStyle('display', 'inline-flex');
        btn.setElemStyle('justify-content', ' center'); /* center the content horizontally */
        btn.setElemStyle('align-items', 'center'); /* center the content vertically */
        return btn;
    }
}

function buttonConfig(icon: string, text: string): ButtonConfig {
    return {
        w: 110,
        h: 30,
        margin: '0px',
        icon: icon,
        text: text,
        font: toolbarButtonFont
    };
}