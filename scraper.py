import requests
from bs4 import BeautifulSoup
import json

def scrape_cybersecurity_news():
    url = "https://thehackernews.com/"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    articles = []

    # Extract news articles
    for item in soup.find_all("div", class_="body-post"):
        title = item.find("h2", class_="home-title")
        description = item.find("div", class_="home-desc")
        link = item.find("a", class_="story-link")

        if title and link:
            articles.append({
                "title": title.text.strip(),
                "description": description.text.strip() if description else "No description available",
                "url": link["href"]
            })

    return articles

def save_news_to_file(news, filename="news.json"):
    with open(filename, "w") as file:
        json.dump(news, file, indent=4)

if __name__ == "__main__":
    news = scrape_cybersecurity_news()
    save_news_to_file(news)
    print("News scraped and saved to news.json")