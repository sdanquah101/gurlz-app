import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { mealSuggestions } from '../../utils/mealSuggestions';

const ingredients = {
  vegetables: [
    'Spinach', 'Kale', 'Cabbage', 'Okra', 'Pumpkin Leaves', 'Carrots', 'Onions', 'Garlic', 'Ginger', 'Bell Peppers', 'Tomatoes', 'Eggplant', 'Zucchini', 'Cauliflower', 'Green Beans', 'Sweet Corn', 'Beetroot', 'Lettuce', 'Celery', 'Leeks', 'Chili Peppers', 'Spring Onions', 'Radishes', 'Turnips', 'Peas', 'Brussels Sprouts'
  ],
  fruits: [
    'Bananas', 'Pineapple', 'Mango', 'Papaya', 'Avocado', 'Coconut', 'Oranges', 'Lemons', 'Limes', 'Watermelon', 'Apples', 'Pears', 'Grapes', 'Guava', 'Tangerines', 'Pomegranate', 'Plums', 'Peaches', 'Apricots', 'Blackberries', 'Blueberries', 'Strawberries', 'Raspberries', 'Dragon Fruit', 'Passion Fruit', 'Lychee', 'Kiwi', 'Cranberries'
  ],
  grains: [
    'Rice', 'Brown Rice', 'Millet', 'Quinoa', 'Sorghum', 'Maize', 'Cassava', 'Plantains', 'Barley', 'Oats', 'Couscous', 'Farro', 'Amaranth', 'Bulgur', 'Teff', 'Fonio', 'Semolina'
  ],
  proteins: [
    'Chicken', 'Beef', 'Goat Meat', 'Fish', 'Tilapia', 'Catfish', 'Shrimp', 'Eggs', 'Tofu', 'Lentils', 'Beans', 'Peas', 'Groundnuts', 'Turkey', 'Duck', 'Crab', 'Lobster', 'Octopus', 'Squid', 'Snails', 'Pork', 'Mutton', 'Salmon', 'Sardines', 'Anchovies', 'Chickpeas'
  ],
  spices: [
    'Thyme', 'Rosemary', 'Bay Leaves', 'Black Pepper', 'Paprika', 'Nutmeg', 'Cloves', 'Cardamom', 'Curry Powder', 'Chili Powder', 'Turmeric', 'Cumin', 'Cinnamon', 'Vanilla', 'Star Anise', 'Fennel Seeds', 'Coriander', 'Dill', 'Parsley', 'Oregano', 'Mint', 'Basil', 'Lemongrass', 'Fenugreek', 'Allspice', 'Sumac', 'Saffron'
  ],
  dairy: [
    'Milk', 'Yoghurt', 'Cheese', 'Butter', 'Cream', 'Ghee', 'Condensed Milk', 'Evaporated Milk', 'Powdered Milk'
  ],
  oils: [
    'Palm Oil', 'Vegetable Oil', 'Coconut Oil', 'Olive Oil', 'Sesame Oil', 'Peanut Oil', 'Sunflower Oil', 'Canola Oil', 'Avocado Oil', 'Corn Oil'
  ],
  condiments: [
    'Salt', 'Sugar', 'Honey', 'Soy Sauce', 'Vinegar', 'Ketchup', 'Mustard', 'Mayonnaise', 'Hot Sauce', 'Barbecue Sauce', 'Fish Sauce', 'Tamarind Paste', 'Chutney', 'Hoisin Sauce', 'Tahini'
  ],
  nuts_and_seeds: [
    'Cashews', 'Almonds', 'Sesame Seeds', 'Sunflower Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Flaxseeds', 'Pistachios', 'Walnuts', 'Macadamia Nuts', 'Hazelnuts', 'Pine Nuts', 'Coconut Flakes'
  ],
  others: [
    'Bread', 'Pasta', 'Yam', 'Sweet Potatoes', 'Irish Potatoes', 'Plantain Chips', 'Tapioca', 'Arrowroot', 'Rice Noodles', 'Udon', 'Couscous', 'Naan', 'Chapati', 'Pita Bread', 'Flatbread', 'Crackers', 'Bagels', 'Biscuits', 'Dumplings'
  ]
};

const dietaryPreferences = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Low-Carb', 'High-Protein', 'None'
];

const cookingSkills = [
  'Beginner - Basic cooking skills',
  'Intermediate - Comfortable in the kitchen',
  'Advanced - Experienced cook'
];

const timePreferences = [
  '15-30 minutes',
  '30-60 minutes'
];

export default function DietQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    ingredients: [],
    dietary: [],
    cooking: [],
    time: []
  });

  const handleSelect = (category, value) => {
    setAnswers(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const getMealSuggestions = () => {
    if (!answers.cooking.length || !answers.time.length) return [];

    const skillLevel = answers.cooking[0].split(' ')[0].toLowerCase();
    const timePreference = answers.time[0].includes('15-30') ? 'quick' : 'medium';

    return mealSuggestions[skillLevel]?.[timePreference] || [];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Available Ingredients</h3>
            {Object.entries(ingredients).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-secondary">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {items.map(ingredient => (
                    <button
                      key={ingredient}
                      onClick={() => handleSelect('ingredients', ingredient)}
                      className={`p-3 rounded-lg text-sm transition-all
                        ${answers.ingredients.includes(ingredient)
                          ? 'bg-primary text-white'
                          : 'bg-secondary/10 hover:bg-secondary/20'
                        }`}
                    >
                      {ingredient}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Dietary Preferences</h3>
            <div className="grid grid-cols-2 gap-3">
              {dietaryPreferences.map(pref => (
                <button
                  key={pref}
                  onClick={() => handleSelect('dietary', pref)}
                  className={`p-3 rounded-lg text-sm transition-all
                    ${answers.dietary.includes(pref)
                      ? 'bg-primary text-white'
                      : 'bg-secondary/10 hover:bg-secondary/20'
                    }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Cooking Experience</h3>
            <div className="space-y-3">
              {cookingSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, cooking: [skill] }));
                  }}
                  className={`w-full p-4 rounded-lg text-sm transition-all
                    ${answers.cooking.includes(skill)
                      ? 'bg-primary text-white'
                      : 'bg-secondary/10 hover:bg-secondary/20'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Time Available</h3>
            <div className="space-y-3">
              {timePreferences.map(time => (
                <button
                  key={time}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, time: [time] }));
                  }}
                  className={`w-full p-4 rounded-lg text-sm transition-all
                    ${answers.time.includes(time)
                      ? 'bg-primary text-white'
                      : 'bg-secondary/10 hover:bg-secondary/20'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        const suggestions = getMealSuggestions();
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">Meal Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((meal, index) => (
                <div
                  key={index}
                  className="bg-secondary/10 p-4 rounded-xl space-y-2"
                >
                  <h4 className="font-medium">{meal.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-white rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/physical')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Physical
        </Button>
        <h1 className="text-3xl font-bold mb-2">Diet Quiz</h1>
        <p className="text-secondary-light/90">Get personalized meal suggestions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {renderStep()}

              <div className="flex justify-between">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Previous
                  </Button>
                )}
                {step < 5 && (
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="ml-auto"
                  >
                    Next
                    <ChevronRight size={20} className="ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
