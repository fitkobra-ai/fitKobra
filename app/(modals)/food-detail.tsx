import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { FOOD_DATABASE } from '../../constants/FoodDatabase';

export default function FoodDetailModal() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    name: string; 
    cals: string; 
    protein: string; 
    carbs: string; 
    fat: string;
    image: string; 
    servingSize: string;
    servingGrams?: string;
    ingredients?: string;
    instructions?: string;
  }>();

  // Find prebuilt item if available for extra prep details
  const matchingPrebuilt = FOOD_DATABASE.find(f => f.name.toLowerCase() === params.name?.toLowerCase());

  const baseGrams = parseFloat(params.servingGrams || String(matchingPrebuilt?.servingGrams || 200));
  const [gramInput, setGramInput] = useState(String(baseGrams));

  const baseCals = parseFloat(params.cals || String(matchingPrebuilt?.cals || 250));
  const baseProtein = parseFloat(params.protein || String(matchingPrebuilt?.protein || 15));
  const baseCarbs = parseFloat(params.carbs || String(matchingPrebuilt?.carbs || 30));
  const baseFat = parseFloat(params.fat || String(matchingPrebuilt?.fat || 8));

  const currentGrams = parseFloat(gramInput) || baseGrams;
  const ratio = currentGrams / baseGrams;

  const ingredientsList: string[] = params.ingredients 
    ? JSON.parse(params.ingredients)
    : matchingPrebuilt?.ingredients || ['Fresh ingredients', 'Seasoning & Spices', 'Cooking oil / Ghee'];

  const instructionsList: string[] = params.instructions 
    ? JSON.parse(params.instructions)
    : matchingPrebuilt?.instructions || [
        'Prepare all raw ingredients and portion properly.',
        'Cook on medium flame until tender and golden brown.',
        'Garnish with fresh herbs and serve warm.'
      ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    headerImage: {
      width: '100%',
      height: 260,
    },
    closeBtn: {
      position: 'absolute',
      top: 48,
      right: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      backgroundColor: colors.bg,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      marginTop: -24,
      padding: Spacing.lg,
      ...Shadow.card,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: Spacing.md,
    },
    portionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.md,
    },
    macrosGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.lg,
    },
    macroBox: {
      alignItems: 'center',
    },
    macroVal: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginTop: 4,
    },
    macroSub: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '600',
    },
    listItem: {
      fontSize: 14,
      color: colors.textMuted,
      lineHeight: 22,
      marginBottom: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: params.image || matchingPrebuilt?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop' }} 
        style={styles.headerImage} 
      />
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{params.name || 'Food Item'}</Text>
        <Text style={styles.subtitle}>Standard Portion: {params.servingSize || `${baseGrams}g`}</Text>

        {/* Portion Weight Scaler */}
        <View style={styles.portionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="sliders" size={20} color={colors.blue} />
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}>
              Custom Portion Weight:
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <TextInput
              style={{
                backgroundColor: colors.bg, color: colors.blue, fontWeight: '900', fontSize: 16,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm, minWidth: 70, textAlign: 'center',
                borderWidth: 1, borderColor: colors.border
              }}
              keyboardType="numeric"
              value={gramInput}
              onChangeText={setGramInput}
            />
            <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>g</Text>
          </View>
        </View>

        {/* Dynamic Macro Breakdown */}
        <View style={styles.macrosGrid}>
          <View style={styles.macroBox}>
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={styles.macroVal}>{Math.round(baseCals * ratio)}</Text>
            <Text style={styles.macroSub}>kcal</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={{ fontSize: 18 }}>💪</Text>
            <Text style={styles.macroVal}>{Math.round(baseProtein * ratio)}g</Text>
            <Text style={styles.macroSub}>Protein</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={{ fontSize: 18 }}>🍞</Text>
            <Text style={styles.macroVal}>{Math.round(baseCarbs * ratio)}g</Text>
            <Text style={styles.macroSub}>Carbs</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={{ fontSize: 18 }}>🥑</Text>
            <Text style={styles.macroVal}>{Math.round(baseFat * ratio)}g</Text>
            <Text style={styles.macroSub}>Fats</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 8 }}>🛒 Ingredients</Text>
        {ingredientsList.map((ing, idx) => (
          <Text key={idx} style={styles.listItem}>• {ing}</Text>
        ))}

        {/* Preparation Instructions */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, marginTop: Spacing.lg, marginBottom: 8 }}>👩‍🍳 Meal Prep & Recipe</Text>
        {instructionsList.map((inst, idx) => (
          <Text key={idx} style={styles.listItem}>{idx + 1}. {inst}</Text>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}
