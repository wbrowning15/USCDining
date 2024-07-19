import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

def scrape_menu():
    url = "https://hospitality.usc.edu/residential-dining-menus/" 
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    menu_data = {"date": str(datetime.now().date()), "meals": {"breakfast": [], "lunch": [], "dinner": []}}

    sections = soup.find_all("div", class_="fw-accordion-custom meal-section")
    for section in sections:
        meal_title = section.find("h2", class_="fw-accordion-title").get_text(strip=True)
        meal = ""
        if "Breakfast" in meal_title:
            meal = "breakfast"
        elif "Lunch" in meal_title:
            meal = "lunch"
        elif "Dinner" in meal_title:
            meal = "dinner"

        if meal:
            dining_halls = section.find_all("div", class_="col-sm-6 col-md-4")
            for hall in dining_halls:
                hall_name = hall.find("h3", class_="menu-venue-title").get_text(strip=True)
                categories = hall.find_all("h4")
                for category in categories:
                    category_name = category.get_text(strip=True)
                    food_items = []
                    menu_list = category.find_next("ul", class_="menu-item-list")
                    if menu_list:
                        foods = menu_list.find_all("li")
                        for food in foods:
                            food_name = food.contents[0].strip()
                            allergens = [allergen.get_text(strip=True) for allergen in food.find_all("span", class_="fa-allergen-container i")]
                            food_items.append({"food": food_name, "allergen_data": allergens})
                        menu_data["meals"][meal].append({"hall": hall_name, "category": category_name, "foods": food_items})

    return menu_data

def save_to_firestore(data):
    db.collection('menus').document(data['date']).set(data)

if __name__ == "__main__":
    # Initialize Firestore DB connection once
    cred = credentials.Certificate("./secrets/uscdining-3f162-8f7eb34df03b.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    menu_data = scrape_menu()
    save_to_firestore(menu_data)
