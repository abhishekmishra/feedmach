"""
PyBuilder build file for "rssnaja"

Author: Abhishek Mishra (abhishekmishra3@gmail.com)
Date: 10/05/2018

"""

from pybuilder.core import use_plugin, init, Author

use_plugin('python.core')
use_plugin('python.install_dependencies')
use_plugin("python.distutils")

name = 'rssnaja'
authors = [Author('Abhishek Mishra', 'abhishekmishra3@gmail.com')]
license = 'GPL3'
summary = 'rssnaja: A minimalist rss reader'
url = 'https://github.com/abhishekmishra/rssnaja'
version = '0.0.1'

default_task = 'publish'

@init
def initialize (project):
    project.depends_on_requirements("requirements.txt")