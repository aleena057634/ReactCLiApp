import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from '@react-native-vector-icons/ionicons';
import { useRoute } from "@react-navigation/native"; 
import { useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ThemeContext from "../../context/ThemeContext";
import CustomAlert, { ConfirmAlert } from "../../components/CustomAlert";
import { useNavigation } from "@react-navigation/native";
export default function Setting() {
  const navigation=useNavigation<any>()
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
const [showAlert, setShowAlert]=useState(false);
const [PofileAlert,setProfileAlert]=useState(false);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.heading,
              { color: theme.text },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.secondaryText },
            ]}
          >
            Customize your app appearance
          </Text>
        </View>

        <View
          style={[
            styles.headerIcon,
            { backgroundColor: theme.card },
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={23}
            color={theme.primary}
          />
        </View>
      </View>

      {/* APPEARANCE */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        Appearance
      </Text>

      <View
        style={[
          styles.themeCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.themeHeader}>
          <View
            style={[
              styles.themeIcon,
              { backgroundColor: theme.background },
            ]}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={22}
              color={theme.primary}
            />
          </View>

          <View>
            <Text
              style={[
                styles.themeTitle,
                { color: theme.text },
              ]}
            >
              App Theme
            </Text>

            <Text
              style={[
                styles.themeSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Choose your preferred theme
            </Text>
          </View>
        </View>

        {/* LIGHT / DARK BUTTONS */}
        <View style={styles.themeButtons}>
          {/* LIGHT */}
          <Pressable
            style={[
              styles.themeButton,
              {
                backgroundColor: !isDark
                  ? theme.primary
                  : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              if (isDark) {
                toggleTheme();
              }
            }}
          >
            <Ionicons
              name="sunny-outline"
              size={21}
              color={!isDark ? theme.white : theme.text}
            />

            <Text
              style={[
                styles.buttonText,
                {
                  color: !isDark
                    ? theme.white
                    : theme.text,
                },
              ]}
            >
              Light
            </Text>
          </Pressable>

          {/* DARK */}
          <Pressable
            style={[
              styles.themeButton,
              {
                backgroundColor: isDark
                  ? theme.primary
                  : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              if (!isDark) {
                toggleTheme();
              }
            }}
          >
            <Ionicons
              name="moon-outline"
              size={21}
              color={isDark ? theme.white : theme.text}
            />

            <Text
              style={[
                styles.buttonText,
                {
                  color: isDark
                    ? theme.white
                    : theme.text,
                },
              ]}
            >
              Dark
            </Text>
          </Pressable>

        </View>
      </View>

      {/* ACCOUNT */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        Account
      </Text>

      {/* LOGOUT */}
      <Pressable
        style={[
          styles.logoutCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={()=>{
          setShowAlert(true);
        } }
      >
        <View
          style={[
            styles.logoutIcon,
            { backgroundColor: theme.background },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={theme.danger}
          />
        </View>

        <View style={styles.logoutTextContainer}>
          <Text
            style={[
              styles.logoutTitle,
              { color: theme.text },
            ]}
          >
            Logout
          </Text>

          <Text
            style={[
              styles.logoutSubtitle,
              { color: theme.secondaryText },
            ]}
          >
            Sign out from your account
          </Text>
        </View>

        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={theme.secondaryText}
        />
      </Pressable>

<Pressable
  style={[
    styles.profileSettingButton,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
  ]}
  onPress={() => {
    setProfileAlert(true);
  }}
>
  <View
    style={[
      styles.profileSettingIcon,
      {
        backgroundColor: theme.background,
      },
    ]}
  >
    <Ionicons
      name="settings"
      size={20}
      color={theme.primary}
    />
  </View>

  <Text
    style={[
      styles.profileSettingText,
      {
        color: theme.text,
      },
    ]}
  >
    Change Profile
  </Text>

  <Ionicons
    name="chevron-forward"
    size={18}
    color={theme.secondaryText}
  />
</Pressable>
 


      <CustomAlert
  visible={showAlert}
  title="Logout"
  Message="Are You sure you want to Logout"
  onCancel={() => {
    setShowAlert(false);
  }}
  
  onConfirm={async () => {
    await AsyncStorage.removeItem("userId");
    setShowAlert(false);
   navigation.popToTop();
    navigation.replace("SignIn");
  }}
/>
<CustomAlert
visible={PofileAlert}
title="Profile Setting"
Message="Are You sure you want to change profile settings?"
onCancel={()=>{setProfileAlert(false)

}}
onConfirm={()=>{
  navigation.navigate("Profile")
  setProfileAlert(false)
}}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  heading: {
    fontSize: 27,
    fontWeight: "800",
  },

  description: {
    fontSize: 13,
    marginTop: 5,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },

  themeCard: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 16,
  },

  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  themeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  themeTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  themeSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  themeButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  themeButton: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  logoutCard: {
    minHeight: 75,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  logoutTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  logoutSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },
profileSettingButton: {
  flexDirection: "row",
  alignItems: "center",
  padding: 14,
  marginTop: 15,
  borderRadius: 14,
  borderWidth: 1,
 

},

profileSettingIcon: {
  width: 40,
  height: 40,
  borderRadius: 11,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 11,

},

profileSettingText: {
  flex: 1,
  fontSize: 13,
  fontWeight: "600",
 
},
});