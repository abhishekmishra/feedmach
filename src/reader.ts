import { NuButton, NuColumnPanel, NuRowPanel, NuTop , NuSizeHint, NuSingleLineText, NuFont } from 'ne0ui';

// import { PlainTextEditorView } from './editor_view';

const toolbarButtonFont = new NuFont('Roboto,', 'normal', 1, 'em', 700);


interface ButtonConfig {
    w: number;
    h: number;
    margin: string;
    icon: string;
    text: string;
    font: NuFont;
}

export class ReaderApp extends NuTop {
    toolbarPanel: NuRowPanel;
    statusbarPanel: NuRowPanel;
    contentRow: NuRowPanel;
    leftPanel: NuColumnPanel;
    rightPanel: NuColumnPanel;
    centerPanel: NuColumnPanel;

    leftPanelMinWidth = 300;
    leftPanelMaxWidth = 500;
    rightPanelMinWidth = 300;
    rightPanelMaxWidth = 500;

    // data
    private _feeds: any[] = [];

    constructor() {
        super();

        this._feeds = ["feed1", "feed2", "feed3"];

        this.createToolbar();

        this.createContentRow();

        this.createStatusbar();

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
            bg: 'lightgray'
        });

        this.centerPanel = new NuColumnPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
            bg: 'lightgray'
        });

        this.rightPanel = new NuColumnPanel({
            w: new NuSizeHint(this.rightPanelMinWidth, this.rightPanelMinWidth, this.rightPanelMaxWidth),
            h: new NuSizeHint(120, 120, Infinity),
            margin: '2px',
            bg: 'lightgray'
        });

        this.add(this.contentRow);
        this.contentRow.addComp(this.leftPanel);
        this.contentRow.addComp(this.centerPanel);
        this.contentRow.addComp(this.rightPanel);

        for (const feed in this._feeds) {
            const feedButton = new NuButton(buttonConfig('bi bi-rss', feed));
            this.leftPanel.addComp(feedButton);
        }
    }

    createToolbar() {
        // create a row panel
        this.toolbarPanel = new NuRowPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: 36,
            margin: '2px',
        });

        this.add(this.toolbarPanel);

        const addFeedButton = this.createToolbarButton('file-earmark', 'Add Feed');
        this.toolbarPanel.addComp(addFeedButton);
    
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
        this.statusbarPanel.addComp(editorServerStatusText, 'end');

        this.add(this.statusbarPanel);
    }

    createToolbarButton(icon:string, label:string) {
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