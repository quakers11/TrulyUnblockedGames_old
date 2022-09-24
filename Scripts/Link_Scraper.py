import requests
from bs4 import BeautifulSoup as bs
import json
import concurrent.futures

debug = True


def exists(url):
    page = requests.get(url)
    if page.status_code != 404:
        return True
    return False


def edit():
    output = []

    url = "https://edit.coolmath-games.com/1-complete-game-list/view-all"
    page = requests.get(url)

    if debug:
        print("Request succeded")

    soup = bs(page.content, "html.parser")
    games = soup.find_all(
        "div", class_="view-content")[0].find_all("span", class_="game-title")

    for game in games:
        link = game.findChildren()[0]
        gameurl = "https://edit.coolmath-games.com" + link["href"] + "/play"

        if not exists(gameurl):
            continue

        name = link.get_text()

        output.append([name, gameurl])
        if debug:
            print([name, gameurl])
    return output


def coolmath():
    output = []

    url = "https://www.coolmathgames.com/1-complete-game-list/view-all"
    page = requests.get(url)

    if debug:
        print("Request succeded")

    soup = bs(page.content, "html.parser")
    # find all game links
    games = soup.find_all(
        "div", class_="view-content")[2].find_all("span", class_="game-title")

    # for each game, if it's last sibling had the first class "icon-gamethumbnail-all-game-pg", it is a flash game and needs to be removed
    for game in games:
        if game.parent.contents[-1]["class"][0] == 'icon-gamethumbnail-all-game-pg':
            games.remove(game)

    for game in games:
        link = game.contents[0]
        gameurl = "https://www.coolmathgames.com" + link["href"] + "/play"

        if not exists(gameurl):
            continue

        name = link.get_text()

        output.append([name, gameurl])
        if debug:
            print([name, gameurl])
    return output


def unblocked66processgame(game):
    link = game.contents[0].contents[0]
    gameurl = "https://sites.google.com" + link["href"]

    if not exists(gameurl):
        return

    try:
        gamepage = requests.get(gameurl)
        if gamepage.status_code == 404:
            return
        gamesoup = bs(gamepage.content, "html.parser")
        innerurl = gamesoup.find_all("iframe")[1]["src"]
        if "x-shockwave-flash" in innerurl:
            return
    except:
        return

    name = link.get_text()
    if debug:
        print([name, gameurl])
    return [name, gameurl]

def unblocked66():
    output = []

    url = "https://sites.google.com/site/unblockedgames66ez/"
    page = requests.get(url)

    if debug:
        print("Request succeded")

    soup = bs(page.content, "html.parser")
    # find all game links
    games = soup.find_all(
        "div", class_="sites-embed-content sites-sidebar-nav")[0].contents[0].contents[1:]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(unblocked66processgame, games)

        results = [x for x in results if x != None]

        return results


def google():
    return [
        ["Google Snake", "https://www.google.com/fbx?fbx=snake_arcade"],
        ["Google Minesweeper", "https://www.google.com/fbx?fbx=minesweeper"],
        ["Google Pacman", "https://www.google.com/fbx?fbx=pacman"],
        ["Google Doodle Baseball",
            "https://www.google.com/logos/2019/july4th19/r6/july4th19.html?hl=en&sdoodles=1"],
        ["Google Doodle Halloween",
            "https://www.google.com/logos/2020/halloween20/rc1/halloween20.html?hl=en&sdoodles=1"]
    ]


def main():
    output = {}
    output["coolmath"] = coolmath()
    output["edit"] = edit()
    output["unblocked66"] = unblocked66()
    output["google"] = google()

    print("coolmath: " + str(len(output["coolmath"])))
    print("edit: " + str(len(output["edit"])))
    print("unblocked66: " + str(len(output["unblocked66"])))
    print("google: " + str(len(output["google"])))

    with open("Website/links.json", "w") as f:
        f.write(json.dumps(output, separators=(',', ':')))


if __name__ == "__main__":
    main()
