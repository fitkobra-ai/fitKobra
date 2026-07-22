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

export default function AiCoachScreen() {
  const { colors } = useTheme();
  const { workouts, todayStats } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hi! I'm your KinexFit AI Coach. How can I help you crush your fitness goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const markdownStyles = {
    body: { color: colors.text, fontSize: 15, lineHeight: 22, flexShrink: 1 },
    paragraph: { marginTop: 4, marginBottom: 4 },
    heading1: { color: colors.text, fontSize: 20, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 8 },
    heading2: { color: colors.text, fontSize: 18, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 8 },
    strong: { color: colors.text, fontWeight: 'bold' as const },
    bullet_list: { marginBottom: 8 },
    ordered_list: { marginBottom: 8 },
    list_item: { marginBottom: 4 },
    code_block: { backgroundColor: colors.bg, padding: 8, borderRadius: Radius.m, color: colors.text, overflow: 'hidden' as const },
    fence: { backgroundColor: colors.bg, padding: 8, borderRadius: Radius.m, color: colors.text, overflow: 'hidden' as const },
  };

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      padding: Spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surfaceHighlight,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? 40 : Spacing.m,
    },
    headerIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.m,
      ...Shadow.light,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
    },
    headerSubtitle: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    chatContainer: {
      flexGrow: 1,
      padding: Spacing.m,
      paddingBottom: Spacing.xl,
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: Spacing.l,
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
      marginRight: Spacing.s,
      marginBottom: 4,
      backgroundColor: colors.surfaceHighlight,
      ...Shadow.light,
    },
    messageBubble: {
      maxWidth: '85%',
      flexShrink: 1,
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.m,
      ...Shadow.card,
    },
    userBubble: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 6,
    },
    modelBubble: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      borderBottomLeftRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden', // Prevents markdown text from breaking out of border radius
    },
    userMessageText: {
      color: 'white',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    inputWrapper: {
      backgroundColor: colors.bg,
      padding: Spacing.m,
      paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 28,
      paddingHorizontal: Spacing.m,
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
      paddingTop: Spacing.m,
      paddingBottom: Spacing.m,
      paddingHorizontal: Spacing.xs,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Spacing.s,
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
      backgroundColor: colors.card,
      padding: Spacing.m,
      borderRadius: 24,
      borderBottomLeftRadius: 6,
      alignSelf: 'flex-start',
      marginLeft: 40,
      ...Shadow.light,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typingText: {
      color: colors.textMuted,
      marginLeft: Spacing.s,
      fontSize: 14,
      fontWeight: '600',
    },
    suggestedContainer: {
      marginTop: Spacing.l,
      marginBottom: Spacing.xl,
      paddingHorizontal: Spacing.m,
    },
    suggestedTitle: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: Spacing.l,
      marginLeft: Spacing.xs,
    },
    suggestedList: {
      flexDirection: 'column',
      gap: Spacing.m,
    },
    suggestedItem: {
      backgroundColor: colors.card,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.l,
      borderRadius: Radius.l,
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadow.light,
    },
    suggestedItemText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '500',
    }
  });

  const animateLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    animateLayout();
    const userText = text.trim();
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    const context = `
      Today steps: ${todayStats?.steps || 0}. 
      Recent workouts: ${(workouts || []).slice(0, 5).map(w => `${w.type} for ${Math.round(w.durationSeconds/60)}min`).join(', ')}.
    `;

    let response: string;
    try {
      response = await generateWorkoutAdvice(context, userText);
    } catch (error) {
      console.error('AI coach error:', error);
      response = "I'm having trouble connecting right now. Please try again in a moment!";
    }

    animateLayout();
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Image 
              source={require('../../assets/images/ai-avatar.jpg')} 
              style={{ width: 44, height: 44, borderRadius: 22 }} 
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>KinexFit AI</Text>
            <Text style={styles.headerSubtitle}>● Online</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <Text style={styles.disclaimer}>
              KinexFit AI provides general fitness advice. It is not a substitute for professional medical instruction.
            </Text>
          }
          renderItem={({ item, index }) => (
            <View>
              <View style={[styles.messageRow, item.role === 'user' ? styles.userRow : styles.modelRow]}>
                {item.role === 'model' && (
                  <View style={styles.avatar}>
                    <Image 
                      source={require('../../assets/images/ai-avatar.jpg')} 
                      style={{ width: 32, height: 32, borderRadius: 16 }} 
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
                    <Markdown style={markdownStyles}>
                      {item.text}
                    </Markdown>
                  </View>
                )}
              </View>

              {/* Show Suggested Prompts only after the very first AI message */}
              {index === 0 && messages.length === 1 && !loading && (
                <View style={styles.suggestedContainer}>
                  <Text style={styles.suggestedTitle}>✨ Suggested for you</Text>
                  <View style={styles.suggestedList}>
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <TouchableOpacity key={i} onPress={() => handleSend(prompt)} style={styles.suggestedItem}>
                        <Text style={styles.suggestedItemText}>{prompt}</Text>
                        <Feather name="chevron-right" size={18} color={colors.primary} />
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
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>KinexFit AI is typing...</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor={colors.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity onPress={() => handleSend(input)} disabled={loading || !input.trim()}>
              <LinearGradient
                colors={input.trim() ? ['#8A2387', '#E94057'] : [colors.border, colors.border]}
                style={styles.sendBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
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
