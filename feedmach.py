import feedparser
import PySimpleGUI as sg
import feed

# Set the theme
sg.theme("Default1")


def get_posts_details(rss=None):
    """
    Fetches an RSS feed and returns details about the posts.

    Args:
        rss (str): URL of the RSS feed.

    Returns:
        dict: A dictionary containing blog details and post information.
    """
    if rss is not None:
        blog_feed = feedparser.parse(rss)
        posts = blog_feed.entries

        posts_details = {
            "Blog title": blog_feed.feed.title,
            "Blog link": blog_feed.feed.link,
        }

        post_list = []
        for post in posts:
            temp = dict()
            try:
                temp["Title"] = post.title
                temp["Link"] = post.link
                temp["Author"] = post.author
                temp["Published"] = post.published
                temp["Tags"] = [tag.term for tag in post.tags]
                temp["Authors"] = [author.name for author in post.authors]
                temp["Summary"] = post.summary
            except:
                pass
            post_list.append(temp)

        posts_details["posts"] = post_list
        return posts_details
    else:
        return None


def select_values(posts_data, headers):
    """
    Selects values belonging to specified headers from a list of dictionaries.

    Args:
        posts_data (list): A list of dictionaries containing post information.
        headers (list): A list of headers to select.

    Returns:
        list: A list of list containing selected post information.
    """
    selected_data = [
        [post[header] for header in headers if header in post] for post in posts_data
    ]
    return selected_data


def get_feed_name(feed_url):
    """
    Given a feed URL, fetches the feed and returns its title (name).

    Args:
        feed_url (str): The URL of the RSS or Atom feed.

    Returns:
        str: The title (name) of the feed.
    """
    try:
        feed = feedparser.parse(feed_url)
        return feed.feed.title
    except Exception as e:
        print(f"Error fetching feed from {feed_url}: {e}")
        return None


def main():
    feed_url = "http://localhost:8000/feeds/all.rss.xml"

    posts_data = get_posts_details(rss=feed_url)["posts"]

    # the headers to display
    headers = ["Title", "Published"]

    # list of posts values selected (stripped of headers)
    posts_list = select_values(posts_data, headers)

    feeds_list = feed.load_feeds()
    print(feeds_list)
    feed_name_list = [feeds_list[feed_item].name for feed_item in feeds_list]
    print(feed_name_list)
    # print(posts_list)

    width = 800
    initial_selection = [0]
    # Define the layout for PySimpleGUI window
    layout = [
        [
            sg.Button("Add Feed", key="-BTN-ADDFEED-"),
            sg.Button("Refresh"),
            sg.Button("Refresh All"),
            sg.Button("Exit"),
        ],
        [
            [
                sg.Listbox(
                    values=feed_name_list,
                    size=(20, 5),
                    key="-FEEDS-",
                    expand_y=True,
                    enable_events=True,
                ),
                sg.Table(
                    values=posts_list,
                    headings=headers,
                    justification="left",
                    num_rows=min(len(posts_list), 20),
                    # col_widths=[30, 25],
                    auto_size_columns=True,
                    display_row_numbers=True,
                    key="-POSTS-",
                    enable_events=True,
                    size=(width, 500),
                    select_mode=sg.TABLE_SELECT_MODE_BROWSE,
                    #   select_rows=initial_selection,
                    #   alternating_row_color="#f0f0f0"
                ),
            ]
        ],
        [sg.Multiline(size=(20, 5), expand_x=True, key="-POST-")],
    ]

    window = sg.Window("FeedMach: RSS Feed Reader", layout, finalize=True)

    # select the first row of the table
    window["-POSTS-"].update(select_rows=initial_selection)

    while True:
        event, values = window.read()
        print(event)
        if event == sg.WINDOW_CLOSED or event == "Exit":
            break
        elif event == "-POSTS-":
            row_index = values["-POSTS-"][0]
            selected_row = posts_data[row_index]
            # print(selected_row['Summary'])
            window["-POST-"].update(selected_row["Summary"])
        elif event == "-FEEDS-":
            selected_item = values["-FEEDS-"][0]  # Get the selected item
            print(f"Selected item: {selected_item}")

        elif event == "-BTN-ADDFEED-":
            print("add a new feed")

            # Define the layout for the dialog
            dialog_layout = [
                [sg.Text("Enter a value:")],
                [sg.InputText(key="input")],
                [sg.Button("OK"), sg.Button("Cancel")],
            ]

            # Create the dialog window
            dialog_window = sg.Window("Dialog", dialog_layout, modal=True)

            feed_url = None
            while True:
                dialog_event, dialog_values = dialog_window.read()

                if dialog_event == sg.WIN_CLOSED or dialog_event == "Cancel":
                    break
                elif dialog_event == "OK":
                    feed_url = dialog_values["input"]
                    if not feed_url:
                        sg.popup("Input cannot be empty!")
                    break

            if feed_url:
                print("feed url is", feed_url)
                feed_name = get_feed_name(feed_url)
                if feed_name:
                    print(f"Feed name: {feed_name}")
                    feed.subscribe_feed(feed_name, feed_url)
                else:
                    print("Unable to fetch feed name.")

            dialog_window.close()

    window.close()


if __name__ == "__main__":
    main()
