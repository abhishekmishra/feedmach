import wx


class OPMLImportDialog(wx.Dialog):

    def __init__(self, *args, **kw):
        super(OPMLImportDialog, self).__init__(*args, **kw)

        self.InitUI()
        self.SetSize((250, 200))
        self.SetTitle("Import Feeds from OPML file.")
        self.opml_file = None


    def InitUI(self):

        pnl = wx.Panel(self)
        vbox = wx.BoxSizer(wx.VERTICAL)

        sb = wx.StaticBox(pnl, label='OPML File')
        sbs = wx.StaticBoxSizer(sb, orient=wx.VERTICAL)

        hbox1 = wx.BoxSizer(wx.HORIZONTAL)
        browseButton = wx.Button(self, label='Browse')
        browseButton.Bind(wx.EVT_BUTTON, self.open_file)

        hbox1.Add(wx.TextCtrl(pnl), flag=wx.LEFT, border=5)
        hbox1.Add(browseButton, flag=wx.EXPAND, border=5)
        sbs.Add(hbox1)

        pnl.SetSizer(sbs)

        hbox2 = wx.BoxSizer(wx.HORIZONTAL)
        okButton = wx.Button(self, label='Ok')
        closeButton = wx.Button(self, label='Close')
        hbox2.Add(okButton)
        hbox2.Add(closeButton, flag=wx.LEFT, border=5)

        vbox.Add(pnl, proportion=1,
            flag=wx.ALL|wx.EXPAND, border=5)
        vbox.Add(hbox2, flag=wx.ALIGN_CENTER|wx.TOP|wx.BOTTOM, border=10)

        self.SetSizer(vbox)

        okButton.Bind(wx.EVT_BUTTON, self.OnClose)
        closeButton.Bind(wx.EVT_BUTTON, self.OnClose)

    def open_file(self, e):
        with wx.FileDialog(self, "Open OPML file", wildcard="OPML files (*.opml)|*.opml",
                           style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST) as fileDialog:

            if fileDialog.ShowModal() == wx.ID_CANCEL:
                return  # the user changed their mind

            # Proceed loading the file chosen by the user
            pathname = fileDialog.GetPath()
            try:
                with open(pathname, 'r') as file:
                    self.choose_opml_file(file)
            except IOError:
                wx.LogError("Cannot open file '%s'." % pathname)

    def choose_opml_file(self, file):
        self.opml_file = file

    def OnClose(self, e):

        self.Destroy()