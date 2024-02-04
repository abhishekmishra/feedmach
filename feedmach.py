import feedparser
import PySimpleGUI as sg

# Set the theme
sg.theme('Default1')

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
            "Blog link": blog_feed.feed.link
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
    selected_data = [[post[header] for header in headers if header in post] for post in posts_data]
    return selected_data

def main():
    feed_url = "http://localhost:8000/feeds/all.rss.xml"

    posts_data = get_posts_details(rss=feed_url)["posts"]

    # the headers to display
    headers=["Title", "Published"]
    
    # list of posts values selected (stripped of headers)
    posts_list = select_values(posts_data, headers)

    # print(posts_list)

    width = 800
    initial_selection=[0]
    # Define the layout for PySimpleGUI window
    layout = [
        [sg.Table(values=posts_list,
                  headings=headers,
                  justification="left",
                  num_rows=min(len(posts_list), 20),
                  #col_widths=[30, 25],
                  auto_size_columns=True,
                  display_row_numbers=True,
                  key="-POSTS-",
                  enable_events=True,
                  size=(width, 500),
                  select_mode=sg.TABLE_SELECT_MODE_BROWSE,
                #   select_rows=initial_selection,
                #   alternating_row_color="#f0f0f0"
                  )],
        [sg.Multiline(size=(20, 5), expand_x=True,key='-POST-')],
        [sg.Button("Exit")],
    ]

    window = sg.Window("FeedMach: RSS Feed Reader", layout, finalize=True)

    #select the first row of the table
    window['-POSTS-'].update(select_rows=initial_selection)

    while True:
        event, values = window.read()
        print(event)
        if event == sg.WINDOW_CLOSED or event == "Exit":
            break
        elif event == '-POSTS-':
            row_index = values['-POSTS-'][0]
            selected_row = posts_data[row_index]
            # print(selected_row['Summary'])
            window['-POST-'].update(selected_row['Summary'])


    window.close()

if __name__ == "__main__":
    main()