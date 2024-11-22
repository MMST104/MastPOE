import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { menuItems as initialMenuItems } from './menuItems';
import { calculateAveragePrice } from './avgPriceCalculator';
import { MenuItem } from './menuItem';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', course: 'starter' });
  const [averages, setAverages] = useState({ starter: 0, main: 0, dessert: 0 });

  import { MenuItem } from './menuItem';

  export function calculateAveragePrice(menuItems: MenuItem[], course?: string): number {
    const filteredItems = course ? menuItems.filter(item => item.course === course) : menuItems;
    if (filteredItems.length === 0) return 0;
    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
    return totalPrice / filteredItems.length;
  }
  

  useEffect(() => {
    updateAverages();
  }, [menuItems]);

  const updateAverages = () => {
    setAverages({
      starter: calculateAveragePrice(menuItems, 'starter'),
      main: calculateAveragePrice(menuItems, 'main'),
      dessert: calculateAveragePrice(menuItems, 'dessert'),
    });
  };

  const addMenuItem = () => {
    const price = parseFloat(newItem.price);
    if (!newItem.name || isNaN(price) || price <= 0) {
      alert('Please enter valid details.');
      return;
    }
    setMenuItems([...menuItems, { ...newItem, price }]);
    setNewItem({ name: '', description: '', price: '', course: 'starter' });
  };

  const removeMenuItem = (name: string) => {
    setMenuItems(menuItems.filter(item => item.name !== name));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Chef</Text>

      <View>
        <Text>Starter Average: ${averages.starter.toFixed(2)}</Text>
        <Text>Main Average: ${averages.main.toFixed(2)}</Text>
        <Text>Dessert Average: ${averages.dessert.toFixed(2)}</Text>
      </View>

      <View style={styles.inputSection}>
        <Text>Add a New Dish:</Text>
        <TextInput
          placeholder="Dish Name"
          style={styles.input}
          value={newItem.name}
          onChangeText={(text) => setNewItem({ ...newItem, name: text })}
        />
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={newItem.description}
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
        />
        <TextInput
          placeholder="Price"
          style={styles.input}
          keyboardType="numeric"
          value={newItem.price}
          onChangeText={(text) => setNewItem({ ...newItem, price: text })}
        />
        <TextInput
          placeholder="Course (starter/main/dessert)"
          style={styles.input}
          value={newItem.course}
          onChangeText={(text) => setNewItem({ ...newItem, course: text as 'starter' | 'main' | 'dessert' })}
        />
        <Button title="Add Dish" onPress={addMenuItem} />
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - ${item.price.toFixed(2)} ({item.course})</Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.name)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 29,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  removeText: {
    color: 'red',
  },
});
