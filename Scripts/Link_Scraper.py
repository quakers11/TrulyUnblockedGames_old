import requests
from bs4 import BeautifulSoup as bs
import json

debug = True


def exists(url):
    page = requests.get(url)
    if page.status_code != 404:
        return True
    return False


def coolmathedit():
    output = []

    base_url = "https://edit.coolmath-games.com/1-complete-game-list/view-all"
    base_page = requests.get(base_url)

    print("request succeded")

    soup = bs(base_page.content, "html.parser")
    games = soup.find_all(
        "div", class_="view-content")[0].find_all("span", class_="game-title")

    for game in games:
        link = game.findChildren()[0]
        url = "https://edit.coolmath-games.com" + link["href"] + "/play"

        if not exists(url):
            continue

        name = link.get_text()

        output.append([name, url])
        if debug:
            print([name, url])
    return output


def coolmath():
    output = []

    base_url = "https://www.coolmathgames.com/1-complete-game-list/view-all"
    base_page = requests.get(base_url)

    print("request succeded")

    soup = bs(base_page.content, "html.parser")
    # find all game links
    games = soup.find_all(
        "div", class_="view-content")[2].find_all("span", class_="game-title")

    # for each game, if it's last sibling had the first class "icon-gamethumbnail-all-game-pg", it is a flash game and needs to be removed
    for game in games:
        if game.parent.contents[-1]["class"][0] == 'icon-gamethumbnail-all-game-pg':
            games.remove(game)
    
    for game in games:
        link = game.contents[0]
        url = "https://www.coolmathgames.com" + link["href"] + "/play"

        if not exists(url):
            continue

        name = link.get_text()

        output.append([name, url])
        if debug: print([name, url])
    return output


regular = coolmath()
edit = coolmathedit()

print("regular: " + str(len(regular)))
print("edit: " + str(len(edit)))

with open("Website/coolmath.js", "w") as f:
    f.write("coolmath = ")
    f.write(str(regular))
    f.write(".sort()")

with open("Website/edit.js", "w") as f:
    f.write("coolmathedit = ")
    f.write(str(edit))
    f.write(".sort()")

google = [
    ["Google Snake", "https://www.google.com/fbx?fbx=snake_arcade"],
    ["Google Minesweeper", "https://www.google.com/fbx?fbx=minesweeper"],
    ["Google Pacman", "https://www.google.com/fbx?fbx=pacman"],
    ["Google Doodle Baseball",
        "https://www.google.com/logos/2019/july4th19/r6/july4th19.html?hl=en&sdoodles=1"],
    ["Google Doodle Halloween",
        "https://www.google.com/logos/2020/halloween20/rc1/halloween20.html?hl=en&sdoodles=1"]
]

with open("Website/google.js", "w") as f:
    f.write("google = ")
    f.write(str(google))
    f.write(".sort()")