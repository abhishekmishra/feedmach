import wx
import sys

"""
A simple feed UI
"""

import wx
import wx.html as html
import wx.dataview as dataview
import feedparser
import db.feed
import ui.opml_import_dialog
from wx.lib.mixins.listctrl import ListCtrlAutoWidthMixin


APP_EXIT = 1
APP_OPML_IMPORT = 2


class AutoWidthListCtrl(wx.ListCtrl, ListCtrlAutoWidthMixin):
    def __init__(self, parent):
        wx.ListCtrl.__init__(self, parent, -1, style=wx.LC_REPORT)
        ListCtrlAutoWidthMixin.__init__(self)


class RSSNajaFrame(wx.Frame):
    """
    The top level window for the application.
    It will have a menubar, a toolbar, a statusbar and the main content
    area at the bottom
    """

    def __init__(self, title):
        super(RSSNajaFrame, self).__init__(None,
                                           title=title,
                                           size=(1024, 768))

        self.feeds = db.feed.load_feeds()
        self.feed_names = []
        for f in self.feeds.values():
            self.feed_names.append(f.name)

        self.list = None

        self.init_ui()
        self.Center()

    def init_ui(self):
        panel = wx.Panel(self)

        self.create_menubar()

        font = wx.SystemSettings.GetFont(wx.SYS_SYSTEM_FONT)

        font.SetPointSize(9)

        vbox = wx.BoxSizer(wx.VERTICAL)

        hbox2 = wx.BoxSizer(wx.HORIZONTAL)
        # topics_list_box = wx.ListBox(panel, -1, choices=self.feed_names)
        # hbox2.Add(topics_list_box, 1, flag=wx.EXPAND | wx.ALL, border=8)

        feed_list = dataview.TreeListCtrl(panel)
        cat_column = feed_list.AppendColumn('Feed')
        feed_list.AppendColumn('Items')
        uncat_item = feed_list.AppendItem(feed_list.GetRootItem(), 'Uncategorized')
        for f in self.feed_names:
            feed_list.AppendItem(uncat_item, f)
        hbox2.Add(feed_list, 1, flag=wx.EXPAND | wx.ALL, border=8)
        feed_list.Expand(uncat_item)

        feedpaneVBox = wx.BoxSizer(wx.VERTICAL)

        self.list = AutoWidthListCtrl(panel)
        self.list.InsertColumn(0, 'title', width=400)
        #self.list.InsertColumn(1, 'description', width=300)
        self.list.InsertColumn(1, 'date', wx.LIST_FORMAT_RIGHT, 50)
        for x in self.feeds.values():
            f = feedparser.parse(x.url)
            break
        for i in f.entries:
            index = self.list.InsertItem(0, i.title)
            #self.list.SetItem(index, 1, i.description)
            self.list.SetItem(index, 1, i.published)

        print(f['feed'])

        feedpaneVBox.Add(self.list, 1, wx.EXPAND)

        htmlwin = html.HtmlWindow(panel, -1, style=wx.NO_BORDER)
        htmlwin.SetBackgroundColour(wx.RED)
        htmlwin.SetStandardFonts()
        htmlwin.SetPage(f.entries[0].description +
                        "<br><hr> <a href='{}'>Link to article</a>".format(f.entries[0].link))

        feedpaneVBox.Add(htmlwin, 1, wx.EXPAND)

        hbox2.Add(feedpaneVBox, 1, wx.EXPAND)

        vbox.Add(hbox2, 1, flag=wx.EXPAND | wx.LEFT | wx.RIGHT | wx.TOP | wx.BOTTOM, border=10)

        hbox3 = wx.BoxSizer(wx.HORIZONTAL)
        vbox.Add(hbox3, 1, flag=wx.EXPAND | wx.LEFT | wx.RIGHT | wx.TOP | wx.BOTTOM, border=10)

        # vbox.Add((-1, 10))
        panel.SetSizer(vbox)

    def create_menubar(self):
        menubar = wx.MenuBar()
        fileMenu = wx.Menu()
        qmi = wx.MenuItem(fileMenu, APP_EXIT, '&Quit\tCtrl+Q')
        fileMenu.Append(qmi)
        self.Bind(wx.EVT_MENU, self.OnQuit, id=APP_EXIT)
        menubar.Append(fileMenu, '&File')

        importMenu = wx.Menu()
        opml_import = wx.MenuItem(importMenu, APP_OPML_IMPORT, 'Import &OPML')
        importMenu.Append(opml_import)
        self.Bind(wx.EVT_MENU, self.import_opml, id=APP_OPML_IMPORT)
        menubar.Append(importMenu, '&Import')

        self.SetMenuBar(menubar)

    def set_state(self):
        self.topics.extend(self.qindex.topics.keys())

    def OnQuit(self, e):
        self.Close()

    def import_opml(self, e):
        opml_import_dlg = ui.opml_import_dialog.OPMLImportDialog(None,
                                                          title='Import OPML')
        opml_import_dlg.ShowModal()
        opml_import_dlg.Destroy()


def main():
    app = wx.App()
    ex = RSSNajaFrame(title='RSS Naja')
    ex.Show()
    app.MainLoop()


if __name__ == "__main__":
    #db.feed.unsubscribe_feed_by_url('file:///Users/abhishekmishra/tmp/rss_samples/newsrss.xml')
    #db.feed.unsubscribe_feed_by_url('file:///home/abhishek/DropBox/newsrss.xml')
    #db.feed.subscribe_feed('News', 'file:///home/abhishek/Dropbox/newsrss.xml')
    main()