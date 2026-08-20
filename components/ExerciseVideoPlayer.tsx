import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Image, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Feather } from '@expo/vector-icons';

interface ExerciseVideoPlayerProps {
  videoSource: any;
  fallbackImage?: any;
  style?: any;
  showAudioToggle?: boolean;
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  videoSource,
  fallbackImage,
  style,
  showAudioToggle = true
}) => {
  const [isMuted, setIsMuted] = useState(true);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <video
          src={typeof videoSource === 'string' ? videoSource : undefined}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onVolumeChange={(e: any) => {
            if (e.target) {
              setIsMuted(e.target.muted || e.target.volume === 0);
            }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {showAudioToggle && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsMuted(!isMuted)}
            style={styles.audioBadge}
          >
            <Feather name={isMuted ? 'volume-x' : 'volume-2'} size={14} color={isMuted ? '#ff4d4d' : '#00FF75'} />
            <Text style={[styles.audioText, { color: isMuted ? '#ffffff' : '#00FF75' }]}>
              {isMuted ? 'Tap for Audio' : 'Audio ON'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Native Mobile Player using Expo Video engine
  try {
    const player = useVideoPlayer(videoSource, p => {
      p.loop = true;
      p.muted = isMuted;
      p.play();
    });

    useEffect(() => {
      if (player) {
        player.loop = true;
        player.muted = isMuted;
      }
    }, [isMuted, player]);

    const toggleAudio = () => {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      if (player) {
        player.muted = nextMuted;
        if (!nextMuted) {
          player.volume = 1.0;
          player.play();
        }
      }
    };

    return (
      <View style={[styles.container, style]}>
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={player}
          allowsFullscreen={false}
          showsVideoControls={false}
          contentFit="contain"
        />
        {showAudioToggle && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleAudio}
            style={styles.audioBadge}
          >
            <Feather name={isMuted ? 'volume-x' : 'volume-2'} size={14} color={isMuted ? '#ff4d4d' : '#00FF75'} />
            <Text style={[styles.audioText, { color: isMuted ? '#ffffff' : '#00FF75' }]}>
              {isMuted ? 'Tap for Audio' : 'Audio ON'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } catch (e) {
    console.warn('ExerciseVideoPlayer native load error, falling back to image:', e);
    return (
      <View style={[styles.container, style]}>
        {fallbackImage && (
          <Image source={fallbackImage} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  audioBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 30,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
