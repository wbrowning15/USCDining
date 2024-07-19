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
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  },
  foodItem: {
    fontSize: 16,
  },
});
