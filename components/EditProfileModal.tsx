import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, Spacing } from '../constants/Theme';
import { UserProfile } from '../services/firestore';
import { deleteAccount } from '../services/auth';
import Input from './ui/Input';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (updates: Partial<UserProfile>) => void;
}

export function EditProfileModal({ visible, onClose, profile, onSave }: EditProfileModalProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (visible && profile) {
      setName(profile.name || '');
      setDob(profile.dateOfBirth || '');
      setWeight(profile.weightKg ? profile.weightKg.toString() : '');
      setHeight(profile.heightCm ? profile.heightCm.toString() : '');
      setPhotoURL(profile.photoURL || '');
    }
  }, [visible, profile]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhotoURL(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = () => {
    const updates: Partial<UserProfile> = {
      name,
      dateOfBirth: dob,
      weightKg: parseFloat(weight) || 75,
      heightCm: parseFloat(height) || 175,
      photoURL,
    };
    onSave(updates);
    onClose();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account and all associated health data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              onClose();
              // auth state listener will automatically push to login
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Feather name="x" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarWrap}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>
                      {name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.editIconBadge}>
                  <Feather name="camera" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
            />
            
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={setDob}
              keyboardType="number-pad"
              placeholder="1990-01-01"
            />
            
            <View style={styles.row}>
              <View style={styles.flex}>
                <Input
                  label="Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.flex}>
                <Input
                  label="Height (cm)"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={handleDeleteAccount}>
            <Text style={styles.deleteBtnText}>Delete Account & Data</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.sm },
  avatarWrap: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 2,
    borderColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  avatarFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarFallbackText: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  editIconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.blue,
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.bg,
  },

  scroll: { flexGrow: 0 },
  content: { gap: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', gap: Spacing.md },
  flex: { flex: 1 },
  saveBtn: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    shadowColor: Colors.purple,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: Spacing.xl,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  deleteBtn: {
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  deleteBtnText: { color: Colors.red, fontSize: 14, fontWeight: '700' },
});
