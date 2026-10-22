import { Ionicons } from "@react-native-vector-icons/ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import ThemeContext from "../context/ThemeContext";

export default function DateModel({
  date,
  setDate,
  minimumDate,
  disabled = false,
}: any) {
  const { theme } = useContext(ThemeContext);
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          if (!disabled) {
            setOpenCalendar(!openCalendar);
          }
        }}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 12,
          paddingHorizontal: 13,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: disabled
            ? theme.border
            : theme.inputBackground,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 14.5,
            color: theme.text,
          }}
        >
          {date.toLocaleDateString()}
        </Text>

        <Ionicons
          name={openCalendar ? "chevron-up" : "chevron-down"}
          size={20}
          color={disabled ? theme.text : theme.primary}
        />
      </TouchableOpacity>

      {openCalendar && !disabled && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          minimumDate={minimumDate}
          onChange={(event, selectedDate) => {
            setOpenCalendar(false);

            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}