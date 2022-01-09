import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet, FlatList } from "react-native";
import Slide from "./Slide";
import Pagination from "./Pagination";
const { width } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)



const Carousel = ({ banners } : any) => {
  // Auto transition
  const scrollX = useRef(new Animated.Value(0)).current;
  const trigger = React.createRef<any>();
  const currentIndex = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      currentIndex.current = currentIndex.current === banners.length - 1
        ? 0
        : currentIndex.current + 1;
      trigger.current && trigger.current.scrollToIndex({ index: currentIndex.current, animated: true })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        snapToInterval={width}
        decelerationRate='fast'
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        automaticallyAdjustContentInsets={true}
        scrollEventThrottle={1}
        ref={trigger}
        horizontal
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        data={banners}
        keyExtractor={(item : any)  => item.id as any}
        renderItem={({ item } : any) => <Slide imageUrl={item.imageUrl} />}
      />
      <Pagination slides={banners} scrollX={scrollX} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  }
});

export default Carousel;
