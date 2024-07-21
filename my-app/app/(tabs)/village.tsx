import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; // Adjust the path as needed

interface FoodItem {
  food: string;
  allergen_data: string[];
}

interface Category {
  category: string;
  foods: FoodItem[];
}

interface HallMenu {
  [hall: string]: Category[];
}

interface MealMenu {
  breakfast: HallMenu;
  lunch: HallMenu;
  dinner: HallMenu;
  brunch: HallMenu;
}

interface MenuData {
  date: string;
  meals: MealMenu;
}

type Allergen = 
  'Dairy' | 'Vegetarian' | 'Vegan' | 'Wheat / Gluten' | 'Soy' | 'Pork' | 'Eggs' | 'Sesame' | 'Fish' | 
  'Food Not Analyzed for Allergens' | 'Halal Ingredients' | 'Peanuts' | 'Shellfish' | 'Tree Nuts';

const allergenColors: { [key in Allergen]: string } = {
  Dairy: 'purple',
  Eggs: 'yellow',
  Fish: 'blue',
  'Food Not Analyzed for Allergens': 'black',
  'Halal Ingredients': 'lightpink',
  Peanuts: 'brown',
  Pork: 'red',
  Sesame: 'gray',
  Shellfish: 'lightblue',
  Soy: 'lightpurple',
  'Tree Nuts': 'orange',
  Vegan: 'lightgreen',
  Vegetarian: 'green',
  'Wheat / Gluten': 'pink',
};

export default function VillageScreen() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA'); // Get current date in YYYY-MM-DD format based on local time
        const menuDocRef = doc(firestore, 'menus', today);
        const docSnap = await getDoc(menuDocRef);
        if (docSnap.exists()) {
          setMenuData(docSnap.data() as MenuData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching menu data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading menu data...</Text>
      </View>
    );
  }

  if (!menuData) {
    return (
      <View style={styles.center}>
        <Text>No menu data available for today.</Text>
      </View>
    );
  }

  const hallData = menuData.meals.breakfast['USC Village Dining Hall']; 

  if (!hallData || hallData.length === 0 || (hallData.length === 1 && hallData[0].category === "No items to display for this date")) {
    return (
      <View style={styles.center}>
        <Text>No items to display for this date</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Village Dining Hall</Text>
      {hallData.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.foods.map((foodItem, idx) => (
            <View key={idx} style={styles.foodItemContainer}>
              <Text style={styles.foodItem}>{foodItem.food}</Text>
              {foodItem.allergen_data.length > 0 && (
                <View style={styles.allergenContainer}>
                  {foodItem.allergen_data.map((allergen, allergenIdx) => (
                    <View
                      key={allergenIdx}
                      style={[
                        styles.allergenDot,
                        { backgroundColor: allergenColors[allergen as Allergen] || 'black' },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
      {hallData.some(category => category.category !== "No items to display for this date") && (
        <View style={styles.allergenKeyContainer}>
          <Text style={styles.allergenKeyTitle}>Allergen Key:</Text>
          {Object.keys(allergenColors).map((allergen) => (
            <View key={allergen} style={styles.allergenKeyItem}>
              <View
                style={[
                  styles.allergenDot,
                  { backgroundColor: allergenColors[allergen as Allergen] },
                ]}
              />
              <Text style={styles.allergenKeyText}>{allergen}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  foodItemContainer: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodItem: {
    fontSize: 16,
  },
  allergenContainer: {
    flexDirection: 'row',
  },
  allergenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  allergenKeyContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  allergenKeyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  allergenKeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  allergenKeyText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
