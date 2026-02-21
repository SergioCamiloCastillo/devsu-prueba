import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SkeletonItemProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

function SkeletonItem({ width = '100%', height = 16, borderRadius = 4, style }: SkeletonItemProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { width: width as number, height, borderRadius, opacity }, style]}
    />
  );
}

export function ProductListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <SkeletonItem width="60%" height={16} />
            <SkeletonItem width="40%" height={12} style={{ marginTop: 6 }} />
          </View>
          <SkeletonItem width={20} height={20} borderRadius={10} />
        </View>
      ))}
    </View>
  );
}

export function ProductDetailSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonItem width="50%" height={24} style={{ marginBottom: 8 }} />
      <SkeletonItem width="70%" height={14} style={{ marginBottom: 24 }} />
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={styles.detailRow}>
          <SkeletonItem width="35%" height={14} />
          <SkeletonItem width="45%" height={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  skeleton: { backgroundColor: '#D0D0D0' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemContent: { flex: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});
