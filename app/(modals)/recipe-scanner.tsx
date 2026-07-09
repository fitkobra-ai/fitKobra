import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { generateRecipeFromImage, type RecipeResult } from '../../services/ai';

export default function RecipeScannerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
      padding: Spacing.m,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 40, // rough safe area
    },
    closeBtn: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: Spacing.s,
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
      padding: Spacing.l,
    },
    text: {
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.m,
    },
    btn: {
      backgroundColor: colors.primary,
      padding: Spacing.m,
      borderRadius: Radius.m,
    },
    btnText: {
      color: 'white',
      fontWeight: 'bold',
    },
    previewImage: {
      width: '100%',
      height: 250,
      borderRadius: Radius.l,
      marginBottom: Spacing.m,
    },
    resultCard: {
      backgroundColor: colors.card,
      padding: Spacing.m,
      borderRadius: Radius.l,
      ...Shadow.card,
    },
    recipeTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: Spacing.s,
    },
    macrosRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.bg,
      padding: Spacing.s,
      borderRadius: Radius.m,
      marginBottom: Spacing.m,
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
      marginTop: Spacing.m,
      marginBottom: Spacing.xs,
    },
    listItem: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: 4,
    }
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        setPhotoUri(photo.uri);
        
        // Analyze with AI
        const result = await generateRecipeFromImage(photo.base64, 'image/jpeg');
        if (result) {
          setRecipe(result);
        } else {
          setErrorMsg('Failed to analyze image. Ensure it is food.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Error processing image');
      } finally {
        setLoading(false);
      }
    }
  };

  const retake = () => {
    setPhotoUri(null);
    setRecipe(null);
    setErrorMsg('');
  };

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
              <Text style={{ color: 'white', marginTop: Spacing.s, fontWeight: 'bold' }}>
                Snap ingredients or a dish
              </Text>
            </View>
          </View>
        </CameraView>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.m, paddingTop: 60 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m }}>
            <TouchableOpacity onPress={retake} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="arrow-left" size={20} color={colors.text} />
              <Text style={{ color: colors.text, marginLeft: 8 }}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: Spacing.xl }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.text, marginTop: Spacing.m }}>AI is analyzing your food...</Text>
            </View>
          )}

          {errorMsg !== '' && (
            <Text style={{ color: colors.red, textAlign: 'center', marginVertical: Spacing.l }}>
              {errorMsg}
            </Text>
          )}

          {recipe && (
            <View style={styles.resultCard}>
              <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
              
              <View style={styles.macrosRow}>
                <Text style={styles.macroText}>🔥 {recipe.calories} kcal</Text>
                <Text style={styles.macroText}>🥩 {recipe.protein}g P</Text>
                <Text style={styles.macroText}>🍞 {recipe.carbs}g C</Text>
                <Text style={styles.macroText}>🥑 {recipe.fats}g F</Text>
              </View>

              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients.map((ing, i) => (
                <Text key={i} style={styles.listItem}>• {ing}</Text>
              ))}

              <Text style={styles.sectionTitle}>Instructions</Text>
              {recipe.instructions.map((inst, i) => (
                <Text key={i} style={styles.listItem}>{i + 1}. {inst}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
