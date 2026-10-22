import React, { ReactNode, useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeContext from "../context/ThemeContext";

import { lightTheme, darkTheme } from "../constents/theme";


const ThemeContextProvider = ({ children }: { children: ReactNode }) => {

  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
useEffect(() => {
  const getTheme = async () => {
    const savedTheme = await AsyncStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDark(true);
    }
  };

  getTheme();
}, []);

  const toggleTheme = async () => {
  setIsDark((prev) => {
    const newValue = !prev;

    AsyncStorage.setItem(
      "theme",
      newValue ? "dark" : "light"
    );

    return newValue;
  });
};

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, setIsDark, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;