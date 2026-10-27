import { useRoute,useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native";
import ThemeContext from "../../context/ThemeContext";

import {
  addMeasurement,
  updateMeasurement,
} from "../../database/MeasuremenrCruc";

import { ConfirmAlert } from "../../components/CustomAlert";

export default function MeasurementForm() {
  const { theme } = useContext(ThemeContext);
const route = useRoute<any>();
const navigation = useNavigation<any>();

const {
  id,
    relationId,
  type,
  measurementId,
  Chest,
  Waist,
  Qameez_Length,
  Shirt_Length,
  Shalwar_Length,
  Trouser_Length,
  Sleeve,
  Daman,
  Hip,
  Thigh,
  Bottom,
  Shoulder,
  Collar,
  Length,
  Armhole,
  Notes,
} = route.params ?? {};

  const [measurement, setMeasurement] = useState({
    Chest: "",
    Waist: "",
    Qameez_Length: "",
    Shalwar_Length: "",
    Shirt_Length: "",
    Trouser_Length: "",
    Sleeve: "",
    Daman: "",
    Hip: "",
    Thigh: "",
    Bottom: "",
    Shoulder: "",
    Collar: "",
    Length: "",
    Armhole: "",
    Notes: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
function takeFirstLetter(type: string) {
  return type.charAt(0);
}
  useEffect(() => {
    if (measurementId) {
      setMeasurement({
        Chest: Chest?.toString() || "",
        Waist: Waist?.toString() || "",
        Qameez_Length: Qameez_Length?.toString() || "",
        Shalwar_Length: Shalwar_Length?.toString() || "",
        Shirt_Length: Shirt_Length?.toString() || "",
        Trouser_Length: Trouser_Length?.toString() || "",
        Sleeve: Sleeve?.toString() || "",
        Daman: Daman?.toString() || "",
        Hip: Hip?.toString() || "",
        Thigh: Thigh?.toString() || "",
        Bottom: Bottom?.toString() || "",
        Shoulder: Shoulder?.toString() || "",
        Collar: Collar?.toString() || "",
        Length: Length?.toString() || "",
        Armhole: Armhole?.toString() || "",
        Notes: Notes?.toString() || "",
      });
    }
  }, [measurementId]);

  function Input(
    placeholder: string,
    field: keyof typeof measurement
  ) {
    return (
      <View style={styles.field}>
        <Text
          style={[
            styles.label,
            {
              color: theme.text,
            },
          ]}
        >
          {placeholder}
        </Text>

        <TextInput
          placeholder={placeholder}
          inputMode={field === "Notes" ? "text" : "numeric"}
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            field === "Notes" && styles.notes,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={measurement[field]}
          onChangeText={(value) =>
            setMeasurement({
              ...measurement,
              [field]: value,
            })
          }
          multiline={field === "Notes"}
        />
      </View>
    );
  }

  function SectionTitle({ title }: { title: string }) {
    return (
      <View
        style={[
          styles.sectionHeader,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.sectionDot,
            {
              backgroundColor: theme.primary,
            },
          ]}
        />

        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    );
  }

  function validateMeasurement() {
    if (type === "Male Shalwar Kameez") {
      if (
        !measurement.Chest ||
        !measurement.Waist ||
        !measurement.Shoulder ||
        !measurement.Sleeve ||
        !measurement.Qameez_Length ||
        !measurement.Daman ||
        !measurement.Collar ||
        !measurement.Armhole ||
        !measurement.Shalwar_Length ||
        !measurement.Thigh ||
        !measurement.Bottom
      ) {
        setShowAlert(true);
        return false;
      }
    }

    if (type === "Female Shalwar Kameez") {
      if (
        !measurement.Chest ||
        !measurement.Shoulder ||
        !measurement.Waist ||
        !measurement.Hip ||
        !measurement.Qameez_Length ||
        !measurement.Sleeve ||
        !measurement.Armhole ||
        !measurement.Daman ||
        !measurement.Collar ||
        !measurement.Shalwar_Length ||
        !measurement.Thigh ||
        !measurement.Bottom
      ) {
        setShowAlert(true);
        return false;
      }
    }

    if (type === "Pant") {
      if (
        !measurement.Waist ||
        !measurement.Hip ||
        !measurement.Thigh ||
        !measurement.Bottom ||
        !measurement.Length
      ) {
        setShowAlert(true);
        return false;
      }
    }

    if (type === "Shirt") {
      if (
        !measurement.Chest ||
        !measurement.Shoulder ||
        !measurement.Sleeve ||
        !measurement.Collar ||
        !measurement.Length
      ) {
        setShowAlert(true);
        return false;
      }
    }

    if (type === "Coat") {
      if (
        !measurement.Chest ||
        !measurement.Waist ||
        !measurement.Shoulder ||
        !measurement.Sleeve ||
        !measurement.Length ||
        !measurement.Armhole ||
        !measurement.Hip ||
        !measurement.Collar
      ) {
        setShowAlert(true);
        return false;
      }
    }

    return true;
  }

async function saveMeasurement() {
  const isValid = validateMeasurement();

  if (!isValid) {
    return;
  }

  setShowLoader(true);

  if (measurementId) {
    const result = await updateMeasurement(
      Number(measurementId),
      measurement
    );

    console.log("Update result:", result);
  } else {
   const result = await addMeasurement(
  Number(id),
  type?.toString() || "",
  measurement,
  relationId != null ? Number(relationId) : null
);

    console.log("Add result:", result);
  }

  setShowLoader(false);
navigation.popToTop();
}
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[
          styles.scrollView,
          {
            backgroundColor: theme.background,
          },
        ]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.headerIconText,
                  {
                    color: theme.white,
                  },
                ]}
              >
            {takeFirstLetter(type ?.toString() || "")}
              </Text>
             
            </View>

            <View style={styles.headerInfo}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {type}
              </Text>

              <Text
                style={[
                  styles.customer,
                  {
                    color: theme.secondaryText,
                  },
                ]}
              >
                Customer ID: {id}
              </Text>
            </View>
          </View>
        </View>

        {/* Male Shalwar Kameez */}

        {type === "Male Shalwar Kameez" && (
          <View>
            <SectionTitle title="Qameez Measurements" />

            <View style={styles.row}>
              {Input("Chest", "Chest")}
              {Input("Waist", "Waist")}
            </View>

            <View style={styles.row}>
              {Input("Shoulder", "Shoulder")}
              {Input("Sleeve", "Sleeve")}
            </View>

            <View style={styles.row}>
              {Input("Qameez Length", "Qameez_Length")}
              {Input("Daman", "Daman")}
            </View>

            <View style={styles.row}>
              {Input("Collar", "Collar")}
              {Input("Armhole", "Armhole")}
            </View>

            <SectionTitle title="Shalwar Measurements" />

            <View style={styles.row}>
              {Input("Shalwar Length", "Shalwar_Length")}
              {Input("Thigh", "Thigh")}
            </View>

            <View style={styles.row}>
              {Input("Bottom", "Bottom")}
              <View style={styles.emptyField} />
            </View>
          </View>
        )}

        {/* Female Shalwar Kameez */}

        {type === "Female Shalwar Kameez" && (
          <View>
            <SectionTitle title="Qameez Measurements" />

            <View style={styles.row}>
              {Input("Chest", "Chest")}
              {Input("Shoulder", "Shoulder")}
            </View>

            <View style={styles.row}>
              {Input("Waist", "Waist")}
              {Input("Hip", "Hip")}
            </View>

            <View style={styles.row}>
              {Input("Qameez Length", "Qameez_Length")}
              {Input("Sleeve", "Sleeve")}
            </View>

            <View style={styles.row}>
              {Input("Armhole", "Armhole")}
              {Input("Daman", "Daman")}
            </View>

            <View style={styles.row}>
              {Input("Collar / Neck", "Collar")}
              <View style={styles.emptyField} />
            </View>

            <SectionTitle title="Shalwar Measurements" />

            <View style={styles.row}>
              {Input("Shalwar Length", "Shalwar_Length")}
              {Input("Thigh", "Thigh")}
            </View>

            <View style={styles.row}>
              {Input("Bottom", "Bottom")}
              <View style={styles.emptyField} />
            </View>
          </View>
        )}

        {/* Pant */}

        {type === "Pant" && (
          <View>
            <SectionTitle title="Pant Measurements" />

            <View style={styles.row}>
              {Input("Waist", "Waist")}
              {Input("Hip", "Hip")}
            </View>

            <View style={styles.row}>
              {Input("Thigh", "Thigh")}
              {Input("Bottom", "Bottom")}
            </View>

            <View style={styles.row}>
              {Input("Length", "Length")}
              {Input("Trouser Length", "Trouser_Length")}
            </View>
          </View>
        )}

        {/* Shirt */}

        {type === "Shirt" && (
          <View>
            <SectionTitle title="Shirt Measurements" />

            <View style={styles.row}>
              {Input("Chest", "Chest")}
              {Input("Shoulder", "Shoulder")}
            </View>

            <View style={styles.row}>
              {Input("Sleeve", "Sleeve")}
              {Input("Collar", "Collar")}
            </View>

            <View style={styles.row}>
              {Input("Length", "Length")}
              {Input("Shirt Length", "Shirt_Length")}
            </View>
          </View>
        )}

        {/* Coat */}

        {type === "Coat" && (
          <View>
            <SectionTitle title="Coat Measurements" />

            <View style={styles.row}>
              {Input("Chest", "Chest")}
              {Input("Waist", "Waist")}
            </View>

            <View style={styles.row}>
              {Input("Shoulder", "Shoulder")}
              {Input("Sleeve", "Sleeve")}
            </View>

            <View style={styles.row}>
              {Input("Length", "Length")}
              {Input("Armhole", "Armhole")}
            </View>

            <View style={styles.row}>
              {Input("Hip", "Hip")}
              {Input("Collar", "Collar")}
            </View>
          </View>
        )}

        {/* Notes */}

        <SectionTitle title="Additional Notes" />

        {Input("Notes", "Notes")}

        {/* Save Button */}
{showLoader ? (
  <ActivityIndicator
    size="large"
    color={theme.primary}
  />
) : (
  <Pressable
    style={[
      styles.saveButton,
      {
        backgroundColor: theme.primary,
      },
    ]}
    onPress={saveMeasurement}
  >
    <Text
      style={[
        styles.saveButtonText,
        {
          color: theme.white,
        },
      ]}
    >
      Save Measurement
    </Text>
  </Pressable>
)}
        <ConfirmAlert
          visible={showAlert}
          title="Error"
          Message="Please fill all required measurements."
          onConfirm={() => {
            setShowAlert(false);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding:5,
  },

  container: {
    padding: 16,
    paddingBottom: 50,
    flexGrow: 1,
  },

  /* Header */

  headerCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  headerIconText: {
    fontSize: 17,
    fontWeight: "900",
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 3,
  },

  customer: {
    fontSize: 12.5,
    fontWeight: "500",
  },

  /* Section */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 14,
    marginBottom: 12,
  },

  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 9,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  /* Fields */

  row: {
    flexDirection: "row",
    gap: 10,
  },

  field: {
    flex: 1,
    marginBottom: 4,
  },

  label: {
    fontSize: 14.5,
    fontWeight: "900",
    marginBottom: 5,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  notes: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  emptyField: {
    flex: 1,
  },

  /* Save Button */

  saveButton: {
    borderRadius: 30,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginStart:20,
     marginEnd:20,
  },

  saveButtonText: {
    fontSize: 17,
    fontWeight: "800",
  },
});