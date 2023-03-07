import { useCallback, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function App() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const doubleTapRef = useRef();

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));

  const rStyleOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (!isFinished) return;
      scale.value = withDelay(200, withSpring(0));
    });
  }, []);

  const onSingleTap = useCallback(() => {
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (!isFinished) return;
      opacity.value = withDelay(200, withSpring(1));
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TapGestureHandler waitFor={doubleTapRef} onActivated={onSingleTap}>
          <TapGestureHandler
            maxDelayMs={250}
            numberOfTaps={2}
            ref={doubleTapRef}
            onActivated={onDoubleTap}
          >
            <Animated.View>
              <ImageBackground
                source={require("./assets/hedgedog.jpg")}
                style={styles.image}
              >
                <AnimatedImage
                  source={require("./assets/heart.png")}
                  style={[
                    styles.image,
                    {
                      shadowOffset: { width: 0, height: 20 },
                      shadowOpacity: 0.35,
                      shadowRadius: 35,
                    },
                    rStyle,
                  ]}
                  resizeMode="center"
                />
              </ImageBackground>
              <Animated.Text style={[styles.text, rStyleOpacity]}>
                🐢🐢🐢🐢🐢🐢
              </Animated.Text>
            </Animated.View>
          </TapGestureHandler>
        </TapGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const { width: SIZE } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: SIZE,
    width: SIZE,
  },
  text: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 30,
  },
});
