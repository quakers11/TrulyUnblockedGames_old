import requests
from bs4 import BeautifulSoup as bs

url = "https://sites.google.com/site/unblockedgames66ez/home"
page = requests.get(url)

soup = bs(page.content, "html.parser")

games = soup.find_all(attrs={"class": "jYxBte Fpy8Db"})[0]

print(len(games.contents))