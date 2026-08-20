import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface ExerciseVideoPlayerProps {
  videoSource: any;
  fallbackImage?: any;
  style?: any;
}

export const ExerciseVideoPlayer: React.FC<ExerciseVideoPlayerProps> = ({
  videoSource,
  fallbackImage,
  style
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <video
          src={typeof videoSource === 'string' ? videoSource : undefined}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </View>
    );
  }

  // Native Mobile Player using Expo Video engine
  try {
    const player = useVideoPlayer(videoSource, player => {
      player.loop = true;
      player.muted = true;
      player.play();
    });

    useEffect(() => {
      if (player) {
        player.loop = true;
        player.muted = true;
        player.play();
      }
    }, [videoSource, player]);

    return (
      <View style={[styles.container, style]}>
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={player}
          allowsFullscreen={false}
          showsVideoControls={false}
          contentFit="contain"
        />
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
  },
});
