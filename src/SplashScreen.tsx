
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import SignIn from "./screens/auth/SignIn";
import Dashboard from "./Dashbord";
import ThemeContext from "./context/ThemeContext";

export default function SplashScreen() {
  const { theme } = useContext(ThemeContext);
 const navigation=useNavigation<any>();
  useEffect(() => {
    const checkUser = async () => {
     await new Promise<void>((resolve) => setTimeout(resolve, 2500));

      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        navigation.replace("Dashboard");
      } else {
       navigation.replace("SignIn");
      }
    };

    checkUser();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 25,
    },

    imageContainer: {
      width: "100%",
      height: 310,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },

    image: {
      width: 310,
      height: 310,
      resizeMode: "contain",
    },

    appName: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.accent,
      letterSpacing: 1,
      marginBottom: 6,
    },

    tagline: {
      fontSize: 14,
      color: theme.secondaryText,
      letterSpacing: 0.5,
      marginBottom: 18,
    },

    title: {
      fontSize: 27,
      fontWeight: "800",
      color: theme.primary,
      textAlign: "center",
      marginBottom: 10,
    },

    subtitle: {
      fontSize: 15,
      color: theme.secondaryText,
      textAlign: "center",
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../src/assets/Images/tailor1.png")}
          style={styles.image}
        />
      </View>

      <Text style={styles.appName}>
        StitchMate
      </Text>

      <Text style={styles.tagline}>
        Your Smart Tailoring Companion
      </Text>

      <Text style={styles.title}>
        Your Style, Our Craft
      </Text>

      <Text style={styles.subtitle}>
        Perfect measurements.{"\n"}
        Perfect fitting.
      </Text>
    </View>
  );
}
