import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, Linking, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { generateRecipeFromImages, recalculateMacrosForFood, type RecipeResult } from '../../services/ai';
import { useApp, type MealTime } from '../../contexts/AppContext';
import type { FoodItem } from '../../constants/FoodDatabase';

export default function RecipeScannerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { mealTime } = useLocalSearchParams<{ mealTime: string }>();
  const { addFoodToMeal } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);


  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  
  // Gram Weight Portion State
  const [customGrams, setCustomGrams] = useState('200');

  // ─── Ad Placement & Scan Limit ─────────────────────────────────
  const [scansRemaining, setScansRemaining] = useState(2); // 2 Free Scans per session
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [adWatching, setAdWatching] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'space-between',
      padding: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 40, // rough safe area
    },
    closeBtn: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: Spacing.sm,
      borderRadius: 20,
    },
    bottomControls: {
      alignItems: 'center',
      marginBottom: 40,
    },
    captureBtn: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255,255,255,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureBtnInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: 'white',
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    text: {
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    btn: {
      backgroundColor: colors.blue,
      padding: Spacing.md,
      borderRadius: Radius.md,
    },
    btnText: {
      color: 'white',
      fontWeight: 'bold',
    },
    previewImage: {
      width: '100%',
      height: 250,
      borderRadius: Radius.lg,
      marginBottom: Spacing.md,
    },
    resultCard: {
      backgroundColor: colors.surface,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      ...Shadow.card,
    },
    recipeTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: Spacing.sm,
    },
    macrosRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.bg,
      padding: Spacing.sm,
      borderRadius: Radius.md,
      marginBottom: Spacing.md,
    },
    macroText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: 'bold',
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    listItem: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 4,
    }
  });

  if (!permission) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContent}>
        <Feather name="camera-off" size={64} color={colors.textMuted} style={{ marginBottom: Spacing.md }} />
        <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold' }]}>Camera Access Needed</Text>
        <Text style={[styles.text, { marginBottom: Spacing.xl }]}>
          We need your permission to scan food items for recipe and calorie estimation.
        </Text>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => {
            if (!permission.canAskAgain) {
              Linking.openSettings();
            } else {
              requestPermission();
            }
          }}
        >
          <Text style={styles.btnText}>{!permission.canAskAgain ? "Open Settings" : "Grant Permission"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginTop: Spacing.lg }} onPress={() => router.back()}>
          <Text style={{ color: colors.textMuted }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        setPhotoUris(prev => [...prev, photo.uri]);
        setBase64Images(prev => [...prev, photo.base64!]);
      } catch (err) {
        console.error(err);
        setErrorMsg('Error capturing image');
      }
    }
  };

  const analyzePhotos = async () => {
    if (base64Images.length === 0) return;
    
    // Check if user has available scans
    if (scansRemaining <= 0) {
      setShowAdModal(true);
      return;
    }

    try {
      setLoading(true);
      setScansRemaining(prev => Math.max(0, prev - 1));
      const result = await generateRecipeFromImages(base64Images, 'image/jpeg');
      if (result) {
        if (result.isFood === false) {
          setErrorMsg("No food detected. Please scan a valid food item or meal.");
          setRecipe(null);
        } else {
          setRecipe(result);
          setEditedName(result.recipeName);
          setCustomGrams(String(result.servingGrams || 200));
        }
      } else {
        setErrorMsg('Failed to analyze image. Ensure it is food.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error processing images');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = () => {
    setAdWatching(true);
    setAdTimer(5);
    const interval = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdWatching(false);
          setShowAdModal(false);
          setScansRemaining(prevRemaining => prevRemaining + 3); // Reward +3 extra scans!
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const retake = () => {
    setPhotoUris([]);
    setBase64Images([]);
    setRecipe(null);
    setErrorMsg('');
    setIsEditing(false);
    setEditedName('');
  };

  const handleRecalculate = async () => {
    if (!editedName.trim() || editedName === recipe?.recipeName) {
      setIsEditing(false);
      return;
    }
    try {
      setRecalculating(true);
      const newMacros = await recalculateMacrosForFood(editedName);
      if (newMacros) {
        setRecipe(newMacros);
      } else {
        setErrorMsg('Failed to recalculate macros.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error recalculating');
    } finally {
      setRecalculating(false);
      setIsEditing(false);
    }
  };

  const handleAddToMeal = (selectedMeal: string) => {
    if (!recipe) return;
    const currentGrams = parseFloat(customGrams) || recipe.servingGrams || 200;
    const ratio = currentGrams / (recipe.servingGrams || 200);

    const food: FoodItem = {
      id: 'scanned_' + Date.now(),
      name: recipe.recipeName,
      cals: Math.round(recipe.calories * ratio),
      protein: Math.round(recipe.protein * ratio),
      carbs: Math.round(recipe.carbs * ratio),
      fat: Math.round(recipe.fats * ratio),
      servingSize: `${currentGrams}g`,
      servingGrams: currentGrams,
      diets: ['Mix'],
      image: photoUris[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    };
    addFoodToMeal(selectedMeal as MealTime, food);
    router.back();
  };

  return (
    <View style={styles.container}>
      {!recipe && !loading && errorMsg === '' ? (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomControls}>
              {photoUris.length > 0 && (
                <View style={{ flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm }}>
                  {photoUris.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={{ width: 40, height: 40, borderRadius: 8, borderWidth: 2, borderColor: colors.blue }} />
                  ))}
                </View>
              )}
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xl }}>
                {photoUris.length > 0 ? (
                  <TouchableOpacity onPress={retake} style={{ padding: Spacing.sm }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 45 }} />
                )}
                
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                  <View style={styles.captureBtnInner} />
                </TouchableOpacity>

                {photoUris.length > 0 ? (
                  <TouchableOpacity onPress={analyzePhotos} style={{ padding: Spacing.sm, backgroundColor: colors.blue, borderRadius: Radius.md }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Analyze {photoUris.length}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 75 }} />
                )}
              </View>
              <Text style={{ color: 'white', marginTop: Spacing.sm, fontWeight: 'bold' }}>
                Snap ingredients or a dish
              </Text>
            </View>
          </View>
        </CameraView>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.md, paddingTop: 60 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
            <TouchableOpacity onPress={retake} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="arrow-left" size={20} color={colors.text} />
              <Text style={{ color: colors.text, marginLeft: 8 }}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {photoUris.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              {photoUris.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={[styles.previewImage, { width: 300, marginRight: Spacing.sm }]} />
              ))}
            </ScrollView>
          )}

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: Spacing.xl }}>
              <ActivityIndicator size="large" color={colors.blue} />
              <Text style={{ color: colors.text, marginTop: Spacing.md }}>AI is analyzing your food...</Text>
            </View>
          )}

          {errorMsg !== '' && (
            <Text style={{ color: colors.red, textAlign: 'center', marginVertical: Spacing.lg }}>
              {errorMsg}
            </Text>
          )}

          {recipe && (
            <View style={styles.resultCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm }}>
                {isEditing ? (
                  <View style={{ flex: 1, marginRight: Spacing.md }}>
                    <TextInput
                      style={[styles.recipeTitle, { borderBottomWidth: 1, borderBottomColor: colors.border, padding: 0 }]}
                      value={editedName}
                      onChangeText={setEditedName}
                      autoFocus
                    />
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4, fontStyle: 'italic' }}>
                      You can manually enter the name of the item as AI might have picked something similar looking.
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.recipeTitle, { flex: 1 }]}>{recipe.recipeName}</Text>
                )}
                
                <TouchableOpacity onPress={() => {
                  if (isEditing) {
                    handleRecalculate();
                  } else {
                    setIsEditing(true);
                  }
                }}>
                  <Feather name={isEditing ? "check-circle" : "edit-2"} size={24} color={colors.blue} />
                </TouchableOpacity>
              </View>

              {recalculating ? (
                <View style={{ alignItems: 'center', marginVertical: Spacing.xl }}>
                  <ActivityIndicator size="small" color={colors.blue} />
                  <Text style={{ color: colors.text, marginTop: Spacing.sm }}>Recalculating macros for {editedName}...</Text>
                </View>
              ) : (
                <>
                  {/* Gram Weight Adjustment */}
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: colors.bg, padding: Spacing.sm, borderRadius: Radius.md, marginBottom: Spacing.md
                  }}>
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 13 }}>
                      ⚖️ Portion Size (Grams):
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <TextInput
                        style={{
                          backgroundColor: colors.surface, color: colors.blue, fontWeight: '900', fontSize: 15,
                          paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, minWidth: 60, textAlign: 'center',
                          borderWidth: 1, borderColor: colors.border
                        }}
                        keyboardType="numeric"
                        value={customGrams}
                        onChangeText={setCustomGrams}
                      />
                      <Text style={{ color: colors.textMuted, fontWeight: 'bold', fontSize: 13 }}>g</Text>
                    </View>
                  </View>

                  {/* Calculated Macros Row */}
                  {(() => {
                    const currentGrams = parseFloat(customGrams) || recipe.servingGrams || 200;
                    const ratio = currentGrams / (recipe.servingGrams || 200);
                    return (
                      <View style={styles.macrosRow}>
                        <Text style={styles.macroText}>🔥 {Math.round(recipe.calories * ratio)} kcal</Text>
                        <Text style={styles.macroText}>💪 {Math.round(recipe.protein * ratio)}g P</Text>
                        <Text style={styles.macroText}>🍞 {Math.round(recipe.carbs * ratio)}g C</Text>
                        <Text style={styles.macroText}>🥑 {Math.round(recipe.fats * ratio)}g F</Text>
                      </View>
                    );
                  })()}

                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {recipe.ingredients.map((ing, i) => (
                    <Text key={i} style={styles.listItem}>• {ing}</Text>
                  ))}

                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipe.instructions.map((inst, i) => (
                    <Text key={i} style={styles.listItem}>{i + 1}. {inst}</Text>
                  ))}
                </>
              )}

              <View style={{ marginTop: Spacing.xl }}>
                {mealTime ? (
                  <TouchableOpacity style={styles.btn} onPress={() => handleAddToMeal(mealTime as string)}>
                    <Text style={[styles.btnText, { textAlign: 'center' }]}>Add to {mealTime}</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: Spacing.sm }]}>Add to Meal List:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((m) => (
                        <TouchableOpacity 
                          key={m} 
                          style={[styles.btn, { flex: 1, minWidth: '45%' }]} 
                          onPress={() => handleAddToMeal(m)}
                        >
                          <Text style={[styles.btnText, { textAlign: 'center' }]}>{m}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <View style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl
        }}>
          <View style={{
            backgroundColor: colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, width: '100%', alignItems: 'center'
          }}>
            <Feather name="tv" size={48} color={colors.blue} style={{ marginBottom: Spacing.md }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: Spacing.xs }}>
              Scan Limit Reached
            </Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg }}>
              Watch a quick 5-second sponsor ad to unlock +3 extra food scans!
            </Text>

            {/* Ad Container Box */}
            <View style={{
              width: '100%', height: 160, backgroundColor: colors.bg, borderRadius: Radius.md,
              justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: Spacing.lg
            }}>
              {adWatching ? (
                <View style={{ alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.blue} style={{ marginBottom: Spacing.sm }} />
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>
                    Sponsor Video Playing... {adTimer}s
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                    Google AdMob Network
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 16 }}>📢 FitKobra Sponsor Ad</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Tap below to watch video ad</Text>
                </View>
              )}
            </View>

            {adWatching ? (
              <View style={[styles.btn, { backgroundColor: colors.border, width: '100%', alignItems: 'center' }]}>
                <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>Please wait ({adTimer}s)...</Text>
              </View>
            ) : (
              <View style={{ width: '100%', gap: Spacing.sm }}>
                <TouchableOpacity style={[styles.btn, { width: '100%', alignItems: 'center' }]} onPress={handleWatchAd}>
                  <Text style={styles.btnText}>Watch Ad & Unlock +3 Scans</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignItems: 'center', padding: Spacing.sm }} onPress={() => setShowAdModal(false)}>
                  <Text style={{ color: colors.textMuted }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
