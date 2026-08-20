import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Image,
  LayoutAnimation, UIManager, ScrollView
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Spacing, Radius, Shadow } from '../../constants/Theme';
import { generateWorkoutAdvice } from '../../services/ai';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { queryOfflineKnowledge } from '../../constants/OfflineAIKnowledgeBase';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SUGGESTED_PROMPTS = [
  "🔥 Plan a 20-min HIIT workout",
  "🥗 What should I eat post-workout?",
  "🧘‍♀️ Guide me through a stretching routine",
  "😴 How can I improve my sleep?"
];

const FOLLOWUP_CHIPS = [
  "🔥 20-min HIIT",
  "🏋️ Chest & Bench",
  "🥗 High Protein Meals",
  "📉 Caloric Deficit Plan",
  "🧪 Creatine Dosage",
  "🧘‍♀️ Recovery Stretch"
];

export default function AiCoachScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { workouts, todayStats, profile, setProfile } = useApp();
  const { user } = useAuth();
  const [dietPref, setDietPref] = useState<'Veg' | 'Non-Veg' | 'Vegan' | 'Ask me'>('Ask me');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const aiCredits = profile?.aiCredits ?? 10;

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('https://clients3.google.com/generate_204', { 
          method: 'HEAD', 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        if (!res.ok) setIsOfflineMode(true);
      } catch (err) {
        // Network request failed or timed out -> phone has no wifi/data -> auto offline mode
        setIsOfflineMode(true);
      }
    };
    checkNetwork();
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hi! I'm your FitKobra AI Coach. How can I help you crush your fitness goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const animateLayout = () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (e) {
      // Ignore LayoutAnimation errors (e.g. on web)
    }
  };

  const markdownStyles = {
    body: { color: colors.text, fontSize: 15, lineHeight: 22, flexShrink: 1, padding: 0, margin: 0 },
    paragraph: { marginTop: 4, marginBottom: 4 },
    heading1: { color: colors.text, fontSize: 20, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 8 },
    heading2: { color: colors.text, fontSize: 18, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 8 },
    strong: { color: colors.text, fontWeight: 'bold' as const },
    bullet_list: { marginBottom: 8 },
    ordered_list: { marginBottom: 8 },
    list_item: { marginBottom: 4 },
    code_block: { backgroundColor: colors.bg, padding: 8, borderRadius: Radius.md, color: colors.text, overflow: 'hidden' as const },
    fence: { backgroundColor: colors.bg, padding: 8, borderRadius: Radius.md, color: colors.text, overflow: 'hidden' as const },
  };

  const handleSend = async (text: string) => {
    if (!text || !text.trim() || loading) return;

    const userText = text.trim();
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    
    animateLayout();
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    // If Online Mode and Out of Credits:
    if (!isOfflineMode && aiCredits <= 0) {
      animateLayout();
      const outOfCreditsMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `🔒 **You are out of AI Credits!**\n\nYou have used your **10 free AI credits**.\n\nDon't worry, you can:\n• **Switch to Offline Mode** (100% free & unlimited instant advice!)\n• **Redeem a Referral Code** in your Profile for **+10 Bonus AI Credits**!\n\n*(Tip: Tap **"Offline"** in the top right header to continue chatting for free right now!)*`
      };
      setMessages(prev => [...prev, outOfCreditsMsg]);
      setLoading(false);
      return;
    }

    // Deduct 1 credit if in Online Mode and credits > 0
    if (!isOfflineMode && aiCredits > 0) {
      const updatedCredits = Math.max(0, aiCredits - 1);
      if (profile) {
        const newProfile = { ...profile, aiCredits: updatedCredits };
        setProfile(newProfile);
        if (user?.uid) {
          const { saveUserProfile } = require('../../services/firestore');
          saveUserProfile(user.uid, newProfile).catch(console.error);
        }
      }
    }

    const context = `
      Diet Preference: ${dietPref !== 'Ask me' ? dietPref : 'Not explicitly set yet (Ask user if food/nutrition related)'}.
      User Goal: ${profile?.goal || 'General Health'}.
      Today steps: ${todayStats?.steps || 0}. 
      Recent workouts: ${(workouts || []).slice(0, 5).map(w => `${w.type} for ${Math.round(w.durationSeconds/60)}min`).join(', ')}.
    `;

    try {
      const response = await generateWorkoutAdvice(context, userText, isOfflineMode);
      animateLayout();
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('AI coach error:', error);
      animateLayout();
      const fallback = queryOfflineKnowledge(userText);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: fallback };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={styles.headerIconContainer}>
              <Image 
                source={require('../../assets/images/fitkobra-model.jpg')} 
                style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#00e699' }} 
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>FitKobra AI</Text>
              <Text style={[styles.headerSubtitle, isOfflineMode && { color: '#FF9500' }]}>
                {isOfflineMode ? 'Offline Mode' : `● Live • ${aiCredits} Credit${aiCredits === 1 ? '' : 's'}`}
              </Text>
            </View>
          </View>

          {/* Interactive Offline / Online Mode Toggle Button */}
          <TouchableOpacity 
            style={[
              styles.modeToggleBtn, 
              isOfflineMode ? styles.modeToggleOffline : styles.modeToggleOnline
            ]}
            onPress={() => setIsOfflineMode(prev => !prev)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather 
              name={isOfflineMode ? "wifi-off" : "wifi"} 
              size={13} 
              color={isOfflineMode ? "#FF9500" : "#00e699"} 
            />
            <Text style={[styles.modeToggleText, { color: isOfflineMode ? "#FF9500" : "#00e699" }]}>
              {isOfflineMode ? 'Offline' : 'Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Out-of-Credits Switch Banner */}
        {!isOfflineMode && aiCredits <= 0 && (
          <TouchableOpacity 
            onPress={() => setIsOfflineMode(true)}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#8b5cf620',
              paddingHorizontal: Spacing.md,
              paddingVertical: 9,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#8b5cf640'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Feather name="zap-off" size={14} color="#8b5cf6" />
              <Text style={{ color: colors.text, fontSize: 12, fontWeight: 'bold' }}>
                Out of AI Credits • Switch to Free Offline Mode
              </Text>
            </View>
            <View style={{ backgroundColor: colors.purple, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Enable Free</Text>
            </View>
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <Text style={styles.disclaimer}>
              FitKobra AI provides general fitness advice. It is not a substitute for professional medical instruction.
            </Text>
          }
          renderItem={({ item, index }) => (
            <View>
              <View style={[styles.messageRow, item.role === 'user' ? styles.userRow : styles.modelRow]}>
                {item.role === 'model' && (
                  <View style={styles.avatar}>
                    <Image 
                      source={require('../../assets/images/fitkobra-model.jpg')} 
                      style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#00e699' }} 
                    />
                  </View>
                )}
                
                {item.role === 'user' ? (
                  <LinearGradient
                    colors={['#8A2387', '#E94057', '#F27121']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={[styles.messageBubble, styles.userBubble]}
                  >
                    <Text style={styles.userMessageText}>{item.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.messageBubble, styles.modelBubble]}>
                    <View style={styles.markdownWrapper}>
                      {item.text ? (
                        <Markdown style={markdownStyles}>
                          {item.text}
                        </Markdown>
                      ) : (
                        <Text style={{ color: colors.text, fontSize: 15 }}>Processing request...</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>

              {/* Show Suggested Prompts after initial message */}
              {index === 0 && messages.length === 1 && !loading && (
                <View style={styles.suggestedContainer}>
                  <Text style={styles.suggestedTitle}>✨ Suggested for you</Text>
                  <View style={styles.suggestedList}>
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <TouchableOpacity 
                        key={i} 
                        onPress={() => handleSend(prompt)} 
                        style={styles.suggestedItem}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.suggestedItemText}>{prompt}</Text>
                        <Feather name="chevron-right" size={18} color={colors.blue} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.blue} />
                <Text style={styles.typingText}>FitKobra AI is typing...</Text>
              </View>
            ) : null
          }
        />

        {/* Persistent Scrollable Followup Chips */}
        <View style={{ backgroundColor: colors.surfaceHighlight, borderTopWidth: 1, borderTopColor: colors.border }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8, paddingVertical: 8 }}
          >
            {FOLLOWUP_CHIPS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSend(prompt)}
                disabled={loading}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quick Diet Preference Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: 6 }}>
            <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: 'bold' }}>Diet:</Text>
            {(['Veg', 'Non-Veg', 'Vegan', 'Ask me'] as const).map(d => (
              <TouchableOpacity 
                key={d} 
                onPress={() => setDietPref(d)}
                style={{
                  paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
                  backgroundColor: dietPref === d ? colors.blue : colors.surface,
                  borderWidth: 1, borderColor: colors.border
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: dietPref === d ? '#fff' : colors.textMuted }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor={colors.textMuted}
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={() => handleSend(input)}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              maxLength={500}
            />
            <TouchableOpacity 
              onPress={() => handleSend(input)} 
              disabled={loading || !input.trim()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={input.trim() ? ['#8A2387', '#E94057'] : [colors.border, colors.border]}
                style={styles.sendBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                pointerEvents="none"
              >
                <Feather name="arrow-up" size={18} color={input.trim() ? "white" : colors.textMuted} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceHighlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : Spacing.md,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadow.card,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeToggleOnline: {
    backgroundColor: 'rgba(0, 230, 153, 0.15)',
    borderColor: '#00e699',
  },
  modeToggleOffline: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    borderColor: '#FF9500',
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  chatContainer: {
    flexGrow: 1,
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-end',
    width: '100%',
  },
  modelRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginBottom: 4,
    backgroundColor: colors.surfaceHighlight,
    ...Shadow.card,
  },
  messageBubble: {
    maxWidth: '85%',
    flexShrink: 1,
    ...Shadow.card,
  },
  userBubble: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 6,
  },
  modelBubble: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  markdownWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    overflow: 'hidden',
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: colors.bg,
    padding: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadow.card,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    maxHeight: 120,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  disclaimer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: Spacing.xl,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: 24,
    borderBottomLeftRadius: 6,
    alignSelf: 'flex-start',
    marginLeft: 40,
    ...Shadow.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingText: {
    color: colors.textMuted,
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  suggestedContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  suggestedTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  suggestedList: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  suggestedItem: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadow.card,
  },
  suggestedItemText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  }
});
