import React, { useEffect } from 'react';
import { AppState, AppStateStatus, SafeAreaView, StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAppStore } from './src/store/useAppStore';

export default function App() {
  const lockLayerB = useAppStore((state) => state.lockLayerB);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // Kill Switch Logic: if it goes to background or inactive, reset states instantly
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        lockLayerB();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lockLayerB]);

  return (
    <SafeAreaView style={styles.container}>
      <RootNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
});
