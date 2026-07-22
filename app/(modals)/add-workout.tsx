import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, Platform
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { parseVoiceWorkout } from '../../services/ai';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveWorkout } from '../../services/firestore';

export default function AddWorkoutScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { addWorkout } = useApp();
  const { user } = useAuth();
  
  const [isRecording, setIsRecording] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  
  const [type, setType] = useState('run');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: Spacing.m, borderBottomWidth: 1, borderBottomColor: colors.border,
      paddingTop: Platform.OS === 'android' ? 40 : Spacing.m,
    },
    headerTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
    content: { padding: Spacing.m },
    aiBox: {
      backgroundColor: colors.surfaceHighlight, padding: Spacing.m,
      borderRadius: Radius.m, marginBottom: Spacing.xl, alignItems: 'center',
      borderWidth: 1, borderColor: colors.primary,
    },
    micBtn: {
      width: 70, height: 70, borderRadius: 35,
      backgroundColor: isRecording ? colors.red : colors.primary,
      justifyContent: 'center', alignItems: 'center', marginVertical: Spacing.m,
      ...Shadow.glow(isRecording ? colors.red : colors.primary),
    },
    label: { color: colors.text, marginBottom: 4, fontWeight: 'bold' },
    input: {
      backgroundColor: colors.card, color: colors.text,
      padding: Spacing.m, borderRadius: Radius.m, marginBottom: Spacing.m,
    },
    saveBtn: {
      backgroundColor: colors.green, padding: Spacing.m,
      borderRadius: Radius.m, alignItems: 'center', marginTop: Spacing.m,
    },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
  });

  const startRecording = async () => {
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    
    // In a real app, we would send the actual audio file to Whisper or Google Speech-to-Text here.
    // For this implementation, we will mock the transcription result from the audio file
    // to pass into our Vertex AI parsing logic. 
    
    setProcessingVoice(true);
    // Mock Transcription:
    const mockTranscription = "I just ran 5 kilometers in 30 minutes and burned 300 calories.";
    
    const parsedData = await parseVoiceWorkout(mockTranscription);
    if (parsedData) {
      setType(parsedData.type || 'run');
      if (parsedData.durationSeconds) setDuration((parsedData.durationSeconds / 60).toString());
      if (parsedData.distanceKm) setDistance(parsedData.distanceKm.toString());
      if (parsedData.caloriesBurned) setCalories(parsedData.caloriesBurned.toString());
    }
    setProcessingVoice(false);
  };

  const handleSave = async () => {
    if (!user) return;
    const workout = {
      type,
      durationSeconds: parseInt(duration) * 60 || 0,
      distanceKm: parseFloat(distance) || 0,
      caloriesBurned: parseInt(calories) || 0,
      startedAt: new Date().toISOString(),
    };
    
    addWorkout(workout); // Update local context instantly
    await saveWorkout(user.uid, workout); // Save to Firestore
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Workout</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Voice Logger removed from UI */}

        <Text style={styles.label}>Workout Type</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} placeholderTextColor={colors.textMuted} />
        
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
        
        <Text style={styles.label}>Distance (km)</Text>
        <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
        
        <Text style={styles.label}>Calories Burned</Text>
        <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholderTextColor={colors.textMuted} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
