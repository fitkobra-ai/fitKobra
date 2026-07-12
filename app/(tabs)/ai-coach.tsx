import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Spacing, Radius, Shadow } from '../../constants/Theme';
import { generateWorkoutAdvice } from '../../services/ai';
import { useApp } from '../../contexts/AppContext';

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
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: Spacing.s,
    },
    chatContainer: {
      flex: 1,
      padding: Spacing.m,
    },
    messageBubble: {
      maxWidth: '85%',
      padding: Spacing.m,
      borderRadius: Radius.l,
      marginBottom: Spacing.m,
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    modelBubble: {
      alignSelf: 'flex-start',
      backgroundColor: colors.card,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: Spacing.m,
      backgroundColor: colors.surfaceHighlight,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: colors.bg,
      color: colors.text,
      padding: Spacing.m,
      borderRadius: Radius.full,
      maxHeight: 100,
    },
    sendBtn: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Spacing.s,
    },
    disclaimer: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 11,
      marginVertical: Spacing.s,
    }
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    // Build context
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Feather name="cpu" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>AI Coach</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <Text style={styles.disclaimer}>
              FitPulse AI provides general fitness advice, not medical instruction.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.modelBubble]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} style={{ margin: Spacing.m }} /> : null}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask for a workout..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading || !input.trim()}>
            <Feather name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
