import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

interface FoodItem {
  food: string;
  allergen_data: string[];
}

interface Category {
  category: string;
  foods: FoodItem[];
}

interface Menu {
  loc: string;
  items: Category[];
}

type Allergen = 'Dairy' | 'Vegetarian' | 'Vegan' | 'Wheat / Gluten' | 'Soy' | 'Pork' | 'Eggs' | 'Sesame';

const allergenColors: { [key in Allergen]: string } = {
  Dairy: 'purple',
  Vegetarian: 'green',
  Vegan: 'lightgreen',
  'Wheat / Gluten': 'red',
  Soy: 'yellow',
  Pork: 'pink',
  Eggs: 'orange',
  Sesame: 'gray',
};

export default function EVKScreen() {
  const [menuData, setMenuData] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      const EVKMenuData: Menu = require('../../assets/breakfast_everybodys_kitchen_menu.json');
      setMenuData(EVKMenuData);
    };

    fetchMenuData();
  }, []);

  if (!menuData) {
    return (
      <View style={styles.center}>
        <Text>Loading menu data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{menuData.loc}</Text>
      {menuData.items.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.foods.map((foodItem, idx) => (
            <View key={idx} style={styles.foodItemContainer}>
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
