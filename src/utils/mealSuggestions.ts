import { MealSuggestions } from '../types/diet';
import ingredients from './ingredients';

export const mealSuggestions: MealSuggestions = {
  beginner: {
    quick: [
      { name: 'Simple Stir-Fry', ingredients: ['Chicken', 'Rice', 'Carrots', 'Bell Peppers', 'Onions'] },
      { name: 'Quick Jollof Rice', ingredients: ['Rice', 'Tomatoes', 'Onions', 'Pepper', 'Spices'] },
      { name: 'Fried Plantains', ingredients: ['Plantains', 'Palm Oil', 'Salt'] },
      { name: 'Vegetable Noodles', ingredients: ['Noodles', 'Carrots', 'Peas', 'Onions'] },
      { name: 'Boiled Yam and Egg Sauce', ingredients: ['Yam', 'Eggs', 'Onions', 'Tomatoes', 'Spices'] },
      { name: 'Avocado Toast', ingredients: ['Bread', 'Avocado', 'Salt', 'Pepper'] },
      { name: 'Coconut Rice', ingredients: ['Rice', 'Coconut Milk', 'Onions', 'Pepper'] },
      { name: 'Fried Egg Sandwich', ingredients: ['Bread', 'Eggs', 'Tomatoes', 'Onions'] },
      { name: 'Tomato and Basil Pasta', ingredients: ['Pasta', 'Tomatoes', 'Basil', 'Cheese'] },
      { name: 'Spicy Eggplant Stir-Fry', ingredients: ['Eggplant', 'Garlic', 'Ginger', 'Chili Peppers'] },
      { name: 'Sweet Corn Salad', ingredients: ['Sweet Corn', 'Tomatoes', 'Cucumber', 'Lettuce'] },
      { name: 'Grilled Cheese Sandwich', ingredients: ['Bread', 'Cheese', 'Butter'] },
      { name: 'Banana Pancakes', ingredients: ['Bananas', 'Flour', 'Milk', 'Eggs'] },
      { name: 'Vegetable Soup', ingredients: ['Carrots', 'Celery', 'Onions', 'Potatoes'] },
      { name: 'Fruit Salad', ingredients: ['Mango', 'Pineapple', 'Watermelon', 'Grapes'] }
    ],
    medium: [
      { name: 'Vegetable Yam Porridge', ingredients: ['Yam', 'Spinach', 'Tomatoes', 'Onions', 'Palm Oil'] },
      { name: 'Fried Plantain and Beans', ingredients: ['Plantains', 'Beans', 'Palm Oil', 'Onions'] },
      { name: 'Egusi Soup and Eba', ingredients: ['Egusi', 'Palm Oil', 'Spinach', 'Garri', 'Spices'] },
      { name: 'Chicken Stew with Rice', ingredients: ['Chicken', 'Tomatoes', 'Rice', 'Onions'] },
      { name: 'Vegetable Stir-Fry with Couscous', ingredients: ['Couscous', 'Carrots', 'Peas', 'Bell Peppers'] },
      { name: 'Baked Tilapia with Vegetables', ingredients: ['Tilapia', 'Carrots', 'Onions', 'Pepper'] },
      { name: 'Groundnut Soup with Rice Balls', ingredients: ['Groundnuts', 'Chicken', 'Rice', 'Onions', 'Pepper'] },
      { name: 'Plantain Frittata', ingredients: ['Plantains', 'Eggs', 'Onions', 'Tomatoes', 'Spices'] },
      { name: 'Chickpea Curry', ingredients: ['Chickpeas', 'Coconut Milk', 'Curry Powder', 'Onions'] },
      { name: 'Grilled Chicken with Sweet Potatoes', ingredients: ['Chicken', 'Sweet Potatoes', 'Garlic', 'Thyme'] },
      { name: 'Stuffed Bell Peppers', ingredients: ['Bell Peppers', 'Rice', 'Cheese', 'Tomatoes'] },
      { name: 'Lentil Soup', ingredients: ['Lentils', 'Carrots', 'Onions', 'Garlic'] },
      { name: 'Pasta Primavera', ingredients: ['Pasta', 'Carrots', 'Zucchini', 'Bell Peppers'] },
      { name: 'Fried Rice', ingredients: ['Rice', 'Carrots', 'Peas', 'Onions', 'Soy Sauce'] },
      { name: 'Sweet Potato Curry', ingredients: ['Sweet Potatoes', 'Coconut Milk', 'Curry Powder', 'Onions'] }
    ]
  },
  intermediate: {
    quick: [
      { name: 'Grilled Tilapia with Rice', ingredients: ['Tilapia', 'Rice', 'Onions', 'Spices'] },
      { name: 'Vegetable Fried Rice', ingredients: ['Rice', 'Carrots', 'Peas', 'Onions', 'Bell Peppers'] },
      { name: 'Shrimp Stir-Fry', ingredients: ['Shrimp', 'Rice', 'Carrots', 'Bell Peppers'] },
      { name: 'Egg and Potato Hash', ingredients: ['Potatoes', 'Eggs', 'Onions', 'Pepper'] },
      { name: 'Chicken Salad', ingredients: ['Chicken', 'Lettuce', 'Tomatoes', 'Cucumber'] },
      { name: 'Fish Tacos', ingredients: ['Fish', 'Tortilla', 'Cabbage', 'Lime'] },
      { name: 'Tofu and Vegetable Curry', ingredients: ['Tofu', 'Coconut Milk', 'Carrots', 'Peas', 'Spices'] },
      { name: 'Spinach and Egg Wrap', ingredients: ['Spinach', 'Eggs', 'Tortilla', 'Cheese'] },
      { name: 'Peanut Stir-Fry', ingredients: ['Peanuts', 'Tofu', 'Bell Peppers', 'Rice'] },
      { name: 'Zucchini Noodles', ingredients: ['Zucchini', 'Tomatoes', 'Garlic', 'Parmesan'] },
      { name: 'Prawn Fried Rice', ingredients: ['Rice', 'Prawns', 'Eggs', 'Peas'] },
      { name: 'Grilled Chicken Sandwich', ingredients: ['Bread', 'Chicken', 'Lettuce', 'Tomatoes'] },
      { name: 'Stuffed Zucchini Boats', ingredients: ['Zucchini', 'Rice', 'Cheese', 'Tomatoes'] },
      { name: 'Garlic Butter Shrimp', ingredients: ['Shrimp', 'Garlic', 'Butter', 'Parsley'] },
      { name: 'Vegetable Pad Thai', ingredients: ['Rice Noodles', 'Peanuts', 'Carrots', 'Bell Peppers'] }
    ],
    medium: [
      { name: 'Egusi Soup with Fufu', ingredients: ['Egusi', 'Spinach', 'Palm Oil', 'Pepper', 'Goat Meat'] },
      { name: 'Ghanaian Light Soup with Rice Balls', ingredients: ['Tomatoes', 'Pepper', 'Onions', 'Chicken', 'Rice'] },
      { name: 'Jollof Rice with Chicken', ingredients: ['Rice', 'Tomatoes', 'Chicken', 'Onions', 'Pepper'] },
      { name: 'Peanut Butter Stew', ingredients: ['Groundnuts', 'Chicken', 'Tomatoes', 'Pepper'] },
      { name: 'Beef Kebabs with Veggies', ingredients: ['Beef', 'Bell Peppers', 'Onions', 'Tomatoes'] },
      { name: 'Plantain Curry', ingredients: ['Plantains', 'Coconut Milk', 'Spices', 'Onions'] },
      { name: 'Fish Stew with Yam', ingredients: ['Fish', 'Yam', 'Tomatoes', 'Onions'] },
      { name: 'Stuffed Bell Peppers', ingredients: ['Bell Peppers', 'Rice', 'Ground Beef', 'Cheese'] },
      { name: 'Biryani', ingredients: ['Rice', 'Chicken', 'Yogurt', 'Spices'] },
      { name: 'Sweet Potato Pie', ingredients: ['Sweet Potatoes', 'Milk', 'Butter', 'Sugar'] },
      { name: 'Coconut Lentil Curry', ingredients: ['Lentils', 'Coconut Milk', 'Curry Powder', 'Tomatoes'] },
      { name: 'Salmon Teriyaki', ingredients: ['Salmon', 'Soy Sauce', 'Honey', 'Garlic'] },
      { name: 'Chicken Alfredo', ingredients: ['Pasta', 'Chicken', 'Cream', 'Parmesan'] },
      { name: 'Vegetable Risotto', ingredients: ['Rice', 'Carrots', 'Zucchini', 'Onions'] },
      { name: 'Taco Bowls', ingredients: ['Rice', 'Ground Beef', 'Tomatoes', 'Cheese'] }
    ]
  },
  advanced: {
    quick: [
      { name: 'Prawn Coconut Curry', ingredients: ['Prawns', 'Coconut Milk', 'Pepper', 'Onions', 'Spices'] },
      { name: 'Kelewele with Peanut Dip', ingredients: ['Plantains', 'Ginger', 'Pepper', 'Peanuts'] },
      { name: 'Thai Chicken Soup', ingredients: ['Chicken', 'Coconut Milk', 'Lemongrass', 'Spices'] },
      { name: 'Sushi Rolls', ingredients: ['Rice', 'Seaweed', 'Fish', 'Vegetables'] },
      { name: 'Lamb Tagine', ingredients: ['Lamb', 'Spices', 'Apricots', 'Chickpeas'] },
      { name: 'Homemade Pasta', ingredients: ['Flour', 'Eggs', 'Tomatoes', 'Cheese'] },
      { name: 'Grilled Lobster', ingredients: ['Lobster', 'Butter', 'Garlic', 'Parsley'] },
      { name: 'Duck Confit', ingredients: ['Duck', 'Potatoes', 'Garlic', 'Thyme'] },
      { name: 'Clam Chowder', ingredients: ['Clams', 'Potatoes', 'Milk', 'Onions'] },
      { name: 'Bouillabaisse', ingredients: ['Fish', 'Tomatoes', 'Fennel', 'Garlic'] },
      { name: 'Seafood Paella', ingredients: ['Rice', 'Shrimp', 'Mussels', 'Peas', 'Spices'] },
      { name: 'Osso Buco', ingredients: ['Veal', 'Tomatoes', 'Onions', 'Carrots'] },
      { name: 'Chicken Tagine', ingredients: ['Chicken', 'Olives', 'Lemons', 'Spices'] },
      { name: 'Beef Wellington', ingredients: ['Beef', 'Mushrooms', 'Pastry', 'Spices'] },
      { name: 'Duck à l’Orange', ingredients: ['Duck', 'Oranges', 'Honey', 'Garlic'] }
    ],
    medium: [
      { name: 'Homemade Jollof Rice with Grilled Chicken', ingredients: ['Rice', 'Tomatoes', 'Chicken', 'Onions', 'Pepper', 'Spices'] },
      { name: 'Waakye with Fried Fish', ingredients: ['Rice', 'Beans', 'Fish', 'Palm Oil', 'Gari'] },
      { name: 'Ratatouille', ingredients: ['Zucchini', 'Eggplant', 'Tomatoes', 'Bell Peppers', 'Spices'] },
      { name: 'Beef Wellington', ingredients: ['Beef', 'Mushrooms', 'Pastry', 'Spices'] },
      { name: 'Seafood Paella', ingredients: ['Rice', 'Shrimp', 'Mussels', 'Peas', 'Spices'] },
      { name: 'Chicken Tagine', ingredients: ['Chicken', 'Olives', 'Lemons', 'Spices'] },
      { name: 'Bouillabaisse', ingredients: ['Fish', 'Tomatoes', 'Fennel', 'Garlic'] },
      { name: 'Osso Buco', ingredients: ['Veal', 'Tomatoes', 'Onions', 'Carrots'] },
      { name: 'Gumbo', ingredients: ['Okra', 'Shrimp', 'Sausage', 'Rice'] },
      { name: 'Vegetable Lasagna', ingredients: ['Pasta', 'Zucchini', 'Tomatoes', 'Cheese'] },
      { name: 'Biryani', ingredients: ['Rice', 'Chicken', 'Yogurt', 'Spices'] },
      { name: 'Duck à l’Orange', ingredients: ['Duck', 'Oranges', 'Honey', 'Garlic'] },
      { name: 'Lobster Bisque', ingredients: ['Lobster', 'Cream', 'Tomatoes', 'Garlic'] },
      { name: 'Spaghetti Carbonara', ingredients: ['Pasta', 'Eggs', 'Parmesan', 'Bacon'] },
      { name: 'Shepherd’s Pie', ingredients: ['Ground Beef', 'Potatoes', 'Carrots', 'Onions'] }
    ]
  }
};
