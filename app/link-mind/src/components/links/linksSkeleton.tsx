import { View, Animated, StyleSheet } from 'react-native'
import { useEffect, useRef } from 'react'
import { colors } from '@/styles/colors'

export default function LinkSkeleton() {
  const opacity = useRef(new Animated.Value(0.55)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.65, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 900, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.texts}>
        <View style={styles.title} />
        <View style={styles.url} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[950],
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 6
  },
  texts: {
    flex: 1,
    gap: 6,
  },
  title: {
    width: '70%',
    height: 14,
    borderRadius: 6,
    backgroundColor: colors.gray[900],
  },
  url: {
    width: '50%',
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.gray[900],
  }
})
