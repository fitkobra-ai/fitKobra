export type DietType = 'Veg' | 'Non-Veg' | 'Vegan' | 'Mix';

export interface FoodItem {
  id: string;
  name: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  diets: DietType[];
  image: string;
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
  { id: 'ind1', name: 'Dal Makhani', cals: 330, protein: 12, carbs: 35, fat: 18, servingSize: '1 bowl', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind2', name: 'Chicken Biryani', cals: 480, protein: 26, carbs: 55, fat: 16, servingSize: '1 serving', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind3', name: 'Paneer Tikka', cals: 280, protein: 16, carbs: 10, fat: 20, servingSize: '1 skewer', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1599487488020-f55979c3c0fa?q=80&w=800&auto=format&fit=crop' },
  { id: 'ind4', name: 'Chana Masala', cals: 260, protein: 10, carbs: 38, fat: 8, servingSize: '1 bowl', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop' },

  // ---------------- GLOBAL CUISINE: ITALIAN ----------------
  { id: 'ita1', name: 'Pasta Marinara', cals: 350, protein: 12, carbs: 65, fat: 5, servingSize: '1 plate', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop' },
  { id: 'ita2', name: 'Margherita Pizza', cals: 270, protein: 11, carbs: 36, fat: 9, servingSize: '1 slice', diets: ['Veg'], image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop' },
  { id: 'ita3', name: 'Chicken Alfredo', cals: 600, protein: 35, carbs: 48, fat: 28, servingSize: '1 plate', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop' },

  // ---------------- GLOBAL CUISINE: MEXICAN ----------------
  { id: 'mex1', name: 'Chicken Tacos', cals: 420, protein: 28, carbs: 45, fat: 16, servingSize: '2 tacos', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop' },
  { id: 'mex2', name: 'Beef Burrito Bowl', cals: 580, protein: 32, carbs: 60, fat: 24, servingSize: '1 bowl', diets: ['Non-Veg'], image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800&auto=format&fit=crop' },
  { id: 'mex3', name: 'Guacamole & Chips', cals: 320, protein: 4, carbs: 36, fat: 20, servingSize: '1 serving', diets: ['Veg', 'Vegan'], image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800&auto=format&fit=crop' }
];
