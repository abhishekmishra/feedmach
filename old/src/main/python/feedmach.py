"""
The main entry point for the feedmach application.

This script does the following before the UI is shown.
1. Command line options are parsed.
2. Does the .feedmach folder and database exist?
    If not, then it is initialized.
"""

import ui.feedmach_frame


def parse_args():
    pass


def check_config():
    pass


if __name__ == "__main__":
    ui.feedmach_frame.main()