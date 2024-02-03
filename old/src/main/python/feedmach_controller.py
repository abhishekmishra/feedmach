"""
The controller for the application.
UI should not interact with models directly.
"""
import os
import threading
import asyncio
import db.dbsetup


DEFAULT_DB_NAME='feedmach.db'
DEFAULT_CONFIG_FOLDER=os.path.join(os.environ['HOME'], '.feedmach')


class FeedMachControllerThread(threading.Thread):
    def __init__(self):
        super(FeedMachControllerThread, self).__init__()
        self.controller = FeedMachController()

    def run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        self.controller.start_loop()


class FeedMachController():
    """
    FeedMach Controller, provides lifecycle methods for the application.
    """

    def __init__(self, config_folder=DEFAULT_CONFIG_FOLDER, db_name=DEFAULT_DB_NAME):
        self.config_folder = config_folder
        self.db_name = db_name
        self.db_path = os.path.join(self.config_folder, self.db_name)
        self.loop = None

    def start_loop(self):
        self.loop = asyncio.get_event_loop()
        self.loop.run_forever()

    def stop_loop(self):
        self.loop.stop()

    #TODO: remove
    def generic_callback(self):
        print('done')

    # Some Admin Functions
    def init_schema(self):
        self.loop.call_later(10, self.generic_callback)

    def _init_schema(self):
        db.dbsetup.main(self.db_path)

    # Subscription Functions
    def subscribe_feed(self, name, url, categories=[]):
        pass

    def unsubscribe_feed_by_url(self, url):
        pass

    def unsubscribe_feed(self, feed_id):
        pass

    def get_all_subscribed_feeds(self, with_status=True):
        pass

    def get_feed_status(self, feed_id):
        pass

    # Feed fetch functions
    def refresh_feed(self, feed_id):
        pass

    def refresh_all(self):
        pass

    # Reading functions
    def get_entries(self, feed_id):
        pass

    def mark_entry_read(self, feed_id, entry_id):
        pass

    def get_entry_status(self):
        pass

    # Telemetry functions
    def log_event(self, context, type, message):
        pass


if __name__ == "__main__":
    fmct = FeedMachControllerThread()
    fmct.start()
    fmct.controller.init_schema()