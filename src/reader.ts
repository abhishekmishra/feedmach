import { NuButton, NuColumnPanel, NuRowPanel, NuTop } from 'ne0ui';
import { NuSizeHint, NuSingleLineText } from 'ne0ui';
// import { PlainTextEditorView } from './editor_view';

interface ButtonConfig {
    w: number;
    h: number;
    margin: string;
    icon: string;
    text: string;
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

    constructor() {
        super();

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
    }

    createToolbar() {
        // create a row panel
        this.toolbarPanel = new NuRowPanel({
            w: new NuSizeHint(120, 120, Infinity),
            h: 27,
            margin: '2px',
        });

        this.add(this.toolbarPanel);

        const newButton = new NuButton(buttonConfig('bi bi-file-earmark', 'New'));
        this.toolbarPanel.addComp(newButton);
        const openButton = new NuButton(buttonConfig('bi bi-folder2-open', 'Open'));
        this.toolbarPanel.addComp(openButton);
        const saveButton = new NuButton(buttonConfig('bi bi-file-arrow-down', 'Save'));
        this.toolbarPanel.addComp(saveButton);
        const saveAsButton = new NuButton(buttonConfig('bi bi-file-arrow-down', 'Save As'));
        this.toolbarPanel.addComp(saveAsButton);
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
}

function buttonConfig(icon: string, text: string): ButtonConfig {
    return {
        w: 80,
        h: 24,
        margin: '1px',
        icon: icon,
        text: text,
    };
}