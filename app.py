from flask import Flask, jsonify
from flask_cors import CORS 
import requests
import json
from flask_apscheduler import APScheduler
import subprocess

app = Flask(__name__)
CORS(app)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

# NewsAPI configuration
NEWS_API_KEY = "1bde3b2ab6194cfa8def8d1907b543a6"  # Replace with your NewsAPI key
NEWS_API_URL = "https://newsapi.org/v2/everything"

def fetch_news_from_newsapi():
    try:
        params = {
            "q": "cybersecurity",
            "apiKey": NEWS_API_KEY,
            "pageSize": 10  # Limit the number of results
        }
        response = requests.get(NEWS_API_URL, params=params)
        response.raise_for_status()
        return response.json().get("articles", [])
    except Exception as e:
        print(f"Error fetching news from NewsAPI: {e}")
        return []

def scrape_and_save_news():
    print("Scraping news...")
    subprocess.run(["python", "scraper.py"])

def load_news_from_file(filename="news.json"):
    try:
        with open(filename, "r") as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading news from file: {e}")
        return []

def combine_news():
    # Fetch news from NewsAPI
    newsapi_articles = fetch_news_from_newsapi()

    # Load scraped news from file
    scraped_articles = load_news_from_file()

    # Combine results
    combined_articles = newsapi_articles + scraped_articles
    return combined_articles

# Schedule scraping every 10 minutes
@scheduler.task("interval", id="scrape_news", minutes=10)
def scheduled_scrape():
    scrape_and_save_news()

@app.route("/api/news", methods=["GET"])
def get_news():
    try:
        news = combine_news()
        return jsonify({"articles": news})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)