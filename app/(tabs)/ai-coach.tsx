import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Image
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Spacing, Radius, Shadow } from '../../constants/Theme';
import { generateWorkoutAdvice } from '../../services/ai';
import { useApp } from '../../contexts/AppContext';
import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AiCoachScreen() {
  const { colors } = useTheme();
  const { workouts, todayStats } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: "Hi! I'm your FitPulse AI Coach. Tell me how you're feeling today or ask me to generate a workout plan for you!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const markdownStyles = {
    body: { color: colors.text, fontSize: 15, lineHeight: 22 },
    heading1: { color: colors.text, fontSize: 20, fontWeight: 'bold' as const, marginTop: 10, marginBottom: 5 },
    heading2: { color: colors.text, fontSize: 18, fontWeight: 'bold' as const, marginTop: 10, marginBottom: 5 },
    strong: { color: colors.text, fontWeight: 'bold' as const },
    bullet_list: { marginBottom: 10 },
    list_item: { marginBottom: 5 },
    code_block: { backgroundColor: colors.surfaceHighlight, padding: 10, borderRadius: 5, color: colors.text },
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
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.s,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      color: colors.textMuted,
      fontSize: 12,
    },
    chatContainer: {
      flexGrow: 1,
      padding: Spacing.m,
    },
    messageRow: {
      flexDirection: 'row',
      marginBottom: Spacing.l,
      alignItems: 'flex-end',
    },
    modelRow: {
      justifyContent: 'flex-start',
    },
    userRow: {
      justifyContent: 'flex-end',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.s,
      marginBottom: 4,
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.m,
      ...Shadow.card,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 4,
    },
    modelBubble: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      color: 'white',
      fontSize: 15,
      lineHeight: 22,
    },
    inputWrapper: {
      backgroundColor: colors.surfaceHighlight,
      padding: Spacing.m,
      paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: colors.bg,
      borderRadius: 25,
      paddingHorizontal: Spacing.m,
      paddingVertical: Spacing.s,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      maxHeight: 120,
      paddingTop: Spacing.s,
      paddingBottom: Spacing.s,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
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
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      alignSelf: 'flex-start',
      marginLeft: 38,
    },
    typingText: {
      color: colors.textMuted,
      marginLeft: Spacing.s,
      fontSize: 14,
    }
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    const context = `
      Today steps: ${todayStats.steps}. 
      Recent workouts: ${workouts.slice(0, 5).map(w => `${w.type} for ${Math.round(w.durationSeconds/60)}min`).join(', ')}.
    `;

    let response: string;
    try {
      response = await generateWorkoutAdvice(context, userText);
    } catch (error) {
      console.error('AI coach error:', error);
      response = "I'm having trouble connecting right now. Please try again in a moment!";
    }

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
              style={{ width: 40, height: 40, borderRadius: 20 }} 
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>FitPulse AI</Text>
            <Text style={styles.headerSubtitle}>Always here to help</Text>
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
              FitPulse AI provides general fitness advice. It is not a substitute for professional medical instruction.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.role === 'user' ? styles.userRow : styles.modelRow]}>
              {item.role === 'model' && (
                <View style={styles.avatar}>
                  <Image 
                    source={require('../../assets/images/ai-avatar.jpg')} 
                    style={{ width: 30, height: 30, borderRadius: 15 }} 
                  />
                </View>
              )}
              
              <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.modelBubble]}>
                {item.role === 'user' ? (
                  <Text style={styles.messageText}>{item.text}</Text>
                ) : (
                  <Markdown style={markdownStyles}>
                    {item.text}
                  </Markdown>
                )}
              </View>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message FitPulse AI..."
              placeholderTextColor={colors.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity onPress={sendMessage} disabled={loading || !input.trim()}>
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
