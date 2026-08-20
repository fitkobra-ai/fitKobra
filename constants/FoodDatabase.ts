export type DietType = 'Veg' | 'Non-Veg' | 'Vegan' | 'Mix';

export interface FoodItem {
  id: string;
  name: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingGrams?: number;
  diets: DietType[];
  image: string;
  ingredients?: string[];
  instructions?: string[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // ---------------- VEGAN / VEG STAPLES ----------------
  { id: 'f1', name: 'Oats', cals: 150, protein: 5, carbs: 27, fat: 2.5, servingSize: '40g', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' },
  { id: 'f2', name: 'Brown Rice', cals: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: '1 cup cooked', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop' },
  { id: 'f3', name: 'Broccoli', cals: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: '1 cup', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=800&auto=format&fit=crop' },
  { id: 'f4', name: 'Almonds', cals: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz (28g)', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop' },
  { id: 'f5', name: 'Sweet Potato', cals: 114, protein: 2, carbs: 27, fat: 0.1, servingSize: '1 medium', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop' },
  { id: 'f6', name: 'Avocado', cals: 234, protein: 2.9, carbs: 12, fat: 21, servingSize: '1 medium', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop' },
  { id: 'f7', name: 'Tofu (Firm)', cals: 144, protein: 15, carbs: 2.8, fat: 8.7, servingSize: '100g', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' },
  { id: 'f8', name: 'Chickpeas', cals: 269, protein: 14, carbs: 45, fat: 4, servingSize: '1 cup cooked', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop' },

  // ---------------- VEGETARIAN (DAIRY) ----------------
  { id: 'f9', name: 'Paneer', cals: 265, protein: 18, carbs: 3, fat: 20, servingSize: '100g', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=800&auto=format&fit=crop' },
  { id: 'f10', name: 'Greek Yogurt', cals: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: '1 cup', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop' },
  { id: 'f11', name: 'Whey Protein', cals: 120, protein: 24, carbs: 3, fat: 1.5, servingSize: '1 scoop', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop' },

  // ---------------- NON-VEG STAPLES ----------------
  { id: 'f12', name: 'Chicken Breast', cals: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g cooked', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' },
  { id: 'f13', name: 'Salmon', cals: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g cooked', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop' },
  { id: 'f14', name: 'Whole Eggs', cals: 143, protein: 13, carbs: 0.7, fat: 9.5, servingSize: '2 large', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop' },

  // ---------------- GLOBAL CUISINE: INDIAN ----------------
  { 
    id: 'ind1', name: 'Dal Makhani', cals: 330, protein: 12, carbs: 35, fat: 18, servingSize: '1 bowl (250g)', servingGrams: 250, diets: ['Veg'], 
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Black lentils (Urad dal)', 'Kidney beans (Rajma)', 'Butter & Cream', 'Tomato puree', 'Garlic & Spices'],
    instructions: ['Soak lentils and kidney beans overnight.', 'Pressure cook until tender.', 'Simmer with tomato-garlic masala and spices for 30 mins.', 'Finish with cream and butter.']
  },
  { 
    id: 'ind2', name: 'Chicken Biryani', cals: 480, protein: 26, carbs: 55, fat: 16, servingSize: '1 serving (350g)', servingGrams: 350, diets: ['Non-Veg'], 
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Basmati rice', 'Marinated chicken', 'Yogurt', 'Fried onions (Birista)', 'Biryani spices & Saffron'],
    instructions: ['Marinate chicken in yogurt and spices for 1 hour.', 'Parboil basmati rice with whole spices.', 'Layer chicken and rice, top with saffron water and fried onions.', 'Cook on dum (low seal heat) for 25 mins.']
  },
  { 
    id: 'ind3', name: 'Paneer Tikka', cals: 280, protein: 16, carbs: 10, fat: 20, servingSize: '1 skewer (180g)', servingGrams: 180, diets: ['Veg'], 
    image: 'https://images.unsplash.com/photo-1599487488020-f55979c3c0fa?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Paneer cubes', 'Bell peppers & Onions', 'Hung curd', 'Garam masala & Mustard oil'],
    instructions: ['Whisk hung curd with spices and mustard oil.', 'Coat paneer and vegetable cubes evenly.', 'Thread onto skewers and grill/bake at 200°C for 15 mins until charred.']
  },
  { 
    id: 'ind4', name: 'Chana Masala', cals: 260, protein: 10, carbs: 38, fat: 8, servingSize: '1 bowl (220g)', servingGrams: 220, diets: ['Veg', 'Vegan'], 
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Chickpeas', 'Onion-Tomato masala', 'Ginger & Garlic', 'Chana masala powder', 'Coriander'],
    instructions: ['Boil soaked chickpeas until soft.', 'Sauté ginger, garlic, and onions until golden.', 'Add tomato puree and chana masala, simmer with chickpeas for 15 mins.']
  },
  { 
    id: 'ind5', name: 'Masala Dosa', cals: 350, protein: 8, carbs: 55, fat: 10, servingSize: '1 dosa (200g)', servingGrams: 200, diets: ['Veg', 'Vegan'], 
    image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Fermented Rice-Urad dal batter', 'Potato masala filling', 'Mustard seeds & Curry leaves'],
    instructions: ['Spread thin circle of batter on hot tawa.', 'Drizzle oil and crisp until golden brown.', 'Place spiced potato filling in center and fold.']
  },
  { id: 'ind6', name: 'Idli with Sambar', cals: 240, protein: 8, carbs: 45, fat: 2, servingSize: '3 idlis + 1 cup sambar', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind7', name: 'Poha', cals: 250, protein: 5, carbs: 46, fat: 7, servingSize: '1 plate', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind8', name: 'Aloo Paratha', cals: 290, protein: 6, carbs: 42, fat: 10, servingSize: '1 paratha', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind9', name: 'Palak Paneer', cals: 340, protein: 18, carbs: 12, fat: 25, servingSize: '1 bowl', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind10', name: 'Rajma Chawal', cals: 380, protein: 12, carbs: 65, fat: 8, servingSize: '1 plate', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind11', name: 'Besan Chilla', cals: 210, protein: 10, carbs: 25, fat: 8, servingSize: '2 chillas', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind12', name: 'Bhindi Masala', cals: 180, protein: 4, carbs: 18, fat: 12, servingSize: '1 bowl', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind13', name: 'Samosa', cals: 260, protein: 4, carbs: 32, fat: 14, servingSize: '1 piece', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind14', name: 'Roti (Chapati)', cals: 105, protein: 3, carbs: 22, fat: 1, servingSize: '1 roti', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop' },


  // ---------------- GLOBAL CUISINE: ITALIAN ----------------
  { id: 'ita1', name: 'Pasta Marinara', cals: 350, protein: 12, carbs: 65, fat: 5, servingSize: '1 plate', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop' },
  { id: 'ita2', name: 'Margherita Pizza', cals: 270, protein: 11, carbs: 36, fat: 9, servingSize: '1 slice', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop' },
  { id: 'ita3', name: 'Chicken Alfredo', cals: 600, protein: 35, carbs: 48, fat: 28, servingSize: '1 plate', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop' },

  // ---------------- GLOBAL CUISINE: MEXICAN ----------------
  { id: 'mex1', name: 'Chicken Tacos', cals: 420, protein: 28, carbs: 45, fat: 16, servingSize: '2 tacos', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop' },
  { id: 'mex2', name: 'Beef Burrito Bowl', cals: 580, protein: 32, carbs: 60, fat: 24, servingSize: '1 bowl', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800&auto=format&fit=crop' },
  { id: 'mex3', name: 'Guacamole & Chips', cals: 320, protein: 4, carbs: 36, fat: 20, servingSize: '1 serving', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800&auto=format&fit=crop' }
];
