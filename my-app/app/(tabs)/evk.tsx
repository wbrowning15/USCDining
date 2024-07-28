import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { auth, firestore } from '../firebaseConfig'; 

interface FoodItem {
  food: string;
  allergen_data: string[];
  starred?: boolean; 
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

interface UserFavorites {
  favorites: string[];
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

const getCurrentMeal = (): number => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 0 && currentHour <= 10) {
    return 0; // Breakfast
  } else if (currentHour >= 11 && currentHour <= 15) {
    return 1; // Lunch
  } else {
    return 2; // Dinner
  }
};

const EVKScreen: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMeal, setSelectedMeal] = useState<number>(getCurrentMeal());

  if (!auth.currentUser) {
    return (
        <Text>Authentication went wrong</Text>
    );
  }
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA'); //YYYY-MM-DD format
        const menuDocRef = doc(firestore, 'menus', today);
        const docSnap = await getDoc(menuDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as MenuData;
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.exists() ? userDocSnap.data() as UserFavorites : { favorites: [] };

          Object.values(data.meals).forEach((meal) => {
            Object.values(meal).forEach((hall) => {
              (hall as Category[]).forEach((category) => {
                category.foods.forEach((food) => {
                  food.starred = userData.favorites.includes(food.food);
                });
              });
            });
          });
          setMenuData(data);
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

  const toggleStar = async (foodItem: FoodItem) => {
    if (!menuData) return;

    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      if (foodItem.starred) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(foodItem.food)
        });
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(foodItem.food)
        });
      }
      foodItem.starred = !foodItem.starred;
      setMenuData({ ...menuData, meals: { ...menuData.meals } });
    } catch (error) {
      console.error('Error updating favorites: ', error);
    }
  };

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

  const mealKeys = ['breakfast', 'lunch', 'dinner'];
  const selectedMealKey = mealKeys[selectedMeal] as keyof MealMenu;
  const hallData = menuData.meals[selectedMealKey]['Everybody\'s Kitchen'];

  return (
    <View style={styles.container}>
      
      <ScrollView>
        <Text style={styles.title}>Everybody's Kitchen</Text>
        <Text style={styles.subtitle}>Star an item to be notified when it's being served!</Text>
        <SegmentedControl
        values={['Breakfast', 'Lunch', 'Dinner']}
        selectedIndex={selectedMeal}
        onChange={(event) => {
          setSelectedMeal(event.nativeEvent.selectedSegmentIndex);
        }}
        style={styles.segmentedControl}
        tintColor= "#FFD700"
        backgroundColor="white"
        fontStyle={{ color: 'gray', fontSize: 14 }}
        activeFontStyle={{ color: 'white', fontSize: 14 }}
      />
        {hallData.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            {category.foods.map((foodItem, idx) => (
              <View key={idx} style={styles.foodItemContainer}>
                <TouchableOpacity onPress={() => toggleStar(foodItem)}>
                  <Ionicons
                    name={foodItem.starred ? 'star' : 'star-outline'}
                    size={18}
                    color={foodItem.starred ? 'gold' : 'gray'}
                  />
                </TouchableOpacity>
                <Text style={styles.foodItem}>{foodItem.food}</Text>
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
              </View>
            ))}
          </View>
        ))}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 38,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle:{
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
    padding: 12,
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
  },
  foodItem: {
    fontSize: 16,
    flex: 1,
    marginLeft: 5,
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
    marginTop: 12,
    padding: 12,
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
  star: {
    fontSize: 20,
    color: 'gold',
  },
  segmentedControl: {
    margin: 10,
    borderWidth: 0,
  },
});

export default EVKScreen;
