import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape_menu():
    url = "https://hospitality.usc.edu/residential-dining-menus/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    menu_data = {"date": str(datetime.now().date()), "meals": {"breakfast": {}, "lunch": {}, "dinner": {}, "brunch": {}}}

    sections = soup.find_all("div", class_="hsp-accordian-container")
    for section in sections:
        meal_title = section.find("h2", class_="fw-accordion-title").get_text(strip=True)
        meal = ""
        if "Breakfast" in meal_title:
            meal = "breakfast"
        elif "Lunch" in meal_title:
            meal = "lunch"
        elif "Dinner" in meal_title:
            meal = "dinner"
        elif "Brunch" in meal_title:
            meal = "brunch"

        if meal:
            dining_halls = section.find_all("div", class_="col-sm-6 col-md-4")
            for hall in dining_halls:
                hall_name = hall.find("h3", class_="menu-venue-title").get_text(strip=True)
                if hall_name not in menu_data["meals"][meal]:
                    menu_data["meals"][meal][hall_name] = []
                
                categories = hall.find_all("h4")
                for category in categories:
                    category_name = category.get_text(strip=True)
                    if category_name == "No items to display for this date":
                        menu_data["meals"][meal][hall_name].append({
                            "category": category_name,
                            "foods": []
                        })
                    else:
                        food_items = []
                        menu_list = category.find_next("ul", class_="menu-item-list")
                        if menu_list:
                            foods = menu_list.find_all("li")
                            for food in foods:
                                food_name = food.contents[0].strip()
                                allergens = [allergen.find("span").get_text(strip=True) for allergen in food.find_all("i", class_="fa-allergen")]
                                food_items.append({"food": food_name, "allergen_data": allergens})
                        menu_data["meals"][meal][hall_name].append({"category": category_name, "foods": food_items})

    return menu_data

def save_to_firestore(data):
    logger.info("Saving data to Firestore:")
    logger.info(json.dumps(data, indent=4))
    db.collection('menus').document(data['date']).set(data)
    logger.info("Data saved to Firestore successfully.")

if __name__ == "__main__":
    # Initialize Firestore DB connection once
    cred = credentials.Certificate("./secrets/uscdining-3f162-6cbe1b3d6a1a.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("Firestore DB initialized.")

    try:
        menu_data = scrape_menu()
        logger.info(f"Scraped menu data for {menu_data['date']}:")
        save_to_firestore(menu_data)
    except Exception as e:
        logger.error(f"An error occurred: {e}")
