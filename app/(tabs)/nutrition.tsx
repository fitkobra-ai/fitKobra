import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { FOOD_DATABASE, FoodItem, DietType } from '../../constants/FoodDatabase';

const DIET_TYPES: DietType[] = ['Mix', 'Veg', 'Non-Veg', 'Vegan'];
type MealTime = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
const MEAL_TIMES: MealTime[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function NutritionScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();
  const [selectedDiet, setSelectedDiet] = useState<DietType>('Veg');
  
  // State for the meal builder
  const [selectedMeals, setSelectedMeals] = useState<Record<MealTime, FoodItem[]>>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeMealTime, setActiveMealTime] = useState<MealTime | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate daily totals based on selected foods
  const allFoods = Object.values(selectedMeals).flat();
  const totalCals = allFoods.reduce((acc, m) => acc + m.cals, 0);
  const totalProtein = allFoods.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = allFoods.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = allFoods.reduce((acc, m) => acc + m.fat, 0);

  // Filter food database for the modal
  const availableFoods = useMemo(() => {
    return FOOD_DATABASE.filter(f => {
      const matchesDiet = selectedDiet === 'Mix' || f.diets.includes(selectedDiet);
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiet && matchesSearch;
    });
  }, [selectedDiet, searchQuery]);

  const openFoodSelector = (mealTime: MealTime) => {
    setActiveMealTime(mealTime);
    setSearchQuery('');
    setModalVisible(true);
  };

  const handleAddFood = (food: FoodItem) => {
    if (!activeMealTime) return;
    setSelectedMeals(prev => ({
      ...prev,
      [activeMealTime]: [...prev[activeMealTime], food]
    }));
    setModalVisible(false);
  };

  const incrementFood = (mealTime: MealTime, food: FoodItem) => {
    setSelectedMeals(prev => ({
      ...prev,
      [mealTime]: [...prev[mealTime], food]
    }));
  };

  const decrementFood = (mealTime: MealTime, foodId: string) => {
    setSelectedMeals(prev => {
      const newMeals = [...prev[mealTime]];
      const index = newMeals.findIndex(f => f.id === foodId);
      if (index > -1) newMeals.splice(index, 1);
      return { ...prev, [mealTime]: newMeals };
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Builder 🥗</Text>
          <Text style={styles.subtitle}>Customize your daily macros</Text>
        </View>

        {/* Diet Selector */}
        <View style={styles.segmentContainer}>
          {DIET_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              activeOpacity={0.8}
              style={[
                styles.segmentBtn,
                selectedDiet === type && styles.segmentBtnActive,
              ]}
              onPress={() => setSelectedDiet(type)}
            >
              <Text style={[
                styles.segmentText,
                selectedDiet === type && styles.segmentTextActive
              ]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Macros Live Calculator */}
        <View style={[styles.macroSummary, Shadow.glow(colors.green)]}>
          <Text style={styles.sectionTitle}>Daily Totals</Text>
          <View style={styles.macroRow}>
            <MacroStat label="Calories" value={Math.round(totalCals)} unit="kcal" color={colors.orange} />
            <MacroStat label="Protein" value={Math.round(totalProtein)} unit="g" color={colors.blue} />
            <MacroStat label="Carbs" value={Math.round(totalCarbs)} unit="g" color={colors.purple} />
            <MacroStat label="Fat" value={Math.round(totalFat)} unit="g" color={colors.red} />
          </View>
        </View>

        {/* Meal Sections */}
        {MEAL_TIMES.map((mealTime) => (
          <View key={mealTime} style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>{mealTime}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity 
                  style={[styles.addFoodBtn, { backgroundColor: 'rgba(249,115,22,0.15)' }]} 
                  onPress={() => router.push('/(modals)/recipe-scanner')}
                  activeOpacity={0.7}
                >
                  <Feather name="camera" size={16} color={colors.orange} />
                  <Text style={[styles.addFoodText, { color: colors.orange }]}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addFoodBtn} 
                  onPress={() => openFoodSelector(mealTime)}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={16} color={colors.green} />
                  <Text style={styles.addFoodText}>Add Food</Text>
                </TouchableOpacity>
              </View>
            </View>

            {selectedMeals[mealTime].length === 0 ? (
              <View style={styles.emptyMealBox}>
                <Text style={styles.emptyMealText}>No food added yet.</Text>
              </View>
            ) : (
              <View style={styles.mealsList}>
                {Object.values(
                  selectedMeals[mealTime].reduce((acc, food) => {
                    if (acc[food.id]) {
                      acc[food.id].count += 1;
                    } else {
                      acc[food.id] = { food, count: 1 };
                    }
                    return acc;
                  }, {} as Record<string, { food: FoodItem, count: number }>)
                ).map(({ food, count }) => (
                  <View key={food.id} style={[styles.mealCard, Shadow.card]}>
                    <Image source={{ uri: food.image }} style={styles.mealImage} />
                    <View style={styles.mealInfo}>
                      <View style={styles.mealNameRow}>
                        <Text style={styles.mealName} numberOfLines={1}>{food.name}</Text>
                        
                        <View style={styles.quantityControl}>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => decrementFood(mealTime, food.id)}>
                            <Feather name={count === 1 ? "trash-2" : "minus"} size={14} color={count === 1 ? colors.red : colors.textPrimary} />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{count}</Text>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => incrementFood(mealTime, food)}>
                            <Feather name="plus" size={14} color={colors.textPrimary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.servingSize}>Serving: {food.servingSize} {count > 1 ? `(x${count})` : ''}</Text>
                      
                      <View style={styles.mealMacros}>
                        <Text style={styles.mealMacroText}>🔥 {Math.round(food.cals * count)} kcal</Text>
                        <Text style={styles.mealMacroText}>💪 {Math.round(food.protein * count)}g</Text>
                        <Text style={styles.mealMacroText}>🌾 {Math.round(food.carbs * count)}g</Text>
                        <Text style={styles.mealMacroText}>🥑 {Math.round(food.fat * count)}g</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

      </ScrollView>

      {/* Food Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add to {activeMealTime}</Text>
            
            <View style={styles.searchBox}>
              <Feather name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${selectedDiet} foods...`}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
              {availableFoods.length === 0 ? (
                <Text style={styles.emptySearchText}>No foods found. Try another search.</Text>
              ) : (
                availableFoods.map(food => (
                  <TouchableOpacity 
                    key={food.id} 
                    style={styles.foodListItem} 
                    activeOpacity={0.7}
                    onPress={() => handleAddFood(food)}
                  >
                    <Image source={{ uri: food.image }} style={styles.foodListImg} />
                    <View style={styles.foodListInfo}>
                      <Text style={styles.foodListName}>{food.name}</Text>
                      <Text style={styles.foodListDesc}>{food.servingSize} · {food.cals} kcal</Text>
                    </View>
                    <Feather name="plus-circle" size={24} color={colors.green} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function MacroStat({ label, value, unit, color }: { label: string, value: number, unit: string, color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.macroStat}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroUnit}>{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.lg,
    gap: Spacing.lg,
  },
  header: { gap: 4 },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  segmentBtnActive: { backgroundColor: colors.green },
  segmentText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  segmentTextActive: { color: '#000' },

  macroSummary: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    gap: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  macroStat: { alignItems: 'center' },
  macroValue: { fontSize: 22, fontWeight: '800' },
  macroUnit: { fontSize: 12, color: colors.textSecondary, marginTop: -2, marginBottom: 2 },
  macroLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },

  mealSection: { gap: Spacing.sm },
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealSectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  addFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  addFoodText: { color: colors.green, fontWeight: '600', fontSize: 13 },
  
  emptyMealBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyMealText: { color: colors.textSecondary, fontStyle: 'italic', fontSize: 14 },

  mealsList: { gap: Spacing.md },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mealImage: { width: 90, height: '100%' },
  mealInfo: { flex: 1, padding: Spacing.md, gap: 4 },
  mealNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginLeft: Spacing.sm,
  },
  qtyBtn: {
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.surfaceHighlight,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },

  servingSize: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  mealMacros: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  mealMacroText: {
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: colors.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    height: '80%',
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.md,
  },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.surfaceHighlight, alignSelf: 'center', marginBottom: Spacing.xs },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  
  foodList: { flex: 1 },
  emptySearchText: { textAlign: 'center', color: colors.textSecondary, marginTop: Spacing.xl },
  foodListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: Spacing.md,
  },
  foodListImg: { width: 50, height: 50, borderRadius: Radius.sm },
  foodListInfo: { flex: 1 },
  foodListName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  foodListDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
