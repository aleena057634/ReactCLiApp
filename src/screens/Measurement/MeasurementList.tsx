import { Ionicons } from "@react-native-vector-icons/ionicons";

import { useRoute,useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FloatingButton from "../../components/FloatingButton";
import CustomAlert from "../../components/CustomAlert"; 
import ThemeContext from "../../context/ThemeContext";

import {
  deleteMeasurement,
  getMeasurements,
} from "../../database/MeasuremenrCruc";

export default function MeasurementList() {
  const route=useRoute<any>(); 
  const navigation=useNavigation<any>()
  const { theme } = useContext(ThemeContext);
  const { id } = route.params;

  const [showEditAlert, setShowEditAlert] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [measurements, setMeasurements] = useState<any[]>([]);

  const [ShowAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function loadMeasurements() {
    try {
      const data = await getMeasurements(Number(id));
      setMeasurements(data);
    } catch (error) {
      console.log("Failed to load measurements:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadMeasurements();
    }, [id])
  );

  // ================= UPDATE =================

  const handleUpdate = (item: any) => {
    setEditItem(item);
    setShowEditAlert(true);
  };

  const confirmUpdate = () => {
  if (editItem) {
    navigation.navigate("MeasurementForm", {
      id: String(id),
      type: String(editItem.TYPE),
      measurementId: String(editItem.MEASUREMENT_ID),

      Chest: editItem.CHEST != null ? String(editItem.CHEST) : "",
      Waist: editItem.WAIST != null ? String(editItem.WAIST) : "",

      Qameez_Length:
        editItem.QAMEEZ_LENGTH != null
          ? String(editItem.QAMEEZ_LENGTH)
          : "",

      Shirt_Length:
        editItem.SHIRT_LENGTH != null
          ? String(editItem.SHIRT_LENGTH)
          : "",

      Shalwar_Length:
        editItem.SHALWAR_LENGTH != null
          ? String(editItem.SHALWAR_LENGTH)
          : "",

      Trouser_Length:
        editItem.TROUSER_LENGTH != null
          ? String(editItem.TROUSER_LENGTH)
          : "",

      Sleeve: editItem.SLEEVE != null ? String(editItem.SLEEVE) : "",
      Daman: editItem.DAMAN != null ? String(editItem.DAMAN) : "",
      Hip: editItem.HIP != null ? String(editItem.HIP) : "",
      Thigh: editItem.THIGH != null ? String(editItem.THIGH) : "",
      Bottom: editItem.BOTTOM != null ? String(editItem.BOTTOM) : "",
      Shoulder:
        editItem.SHOULDER != null ? String(editItem.SHOULDER) : "",
      Armhole: editItem.ARMHOLE != null ? String(editItem.ARMHOLE) : "",
      Collar: editItem.COLLAR != null ? String(editItem.COLLAR) : "",
      Length: editItem.LENGTH != null ? String(editItem.LENGTH) : "",
      Notes: editItem.NOTES != null ? String(editItem.NOTES) : "",
    });

    setShowEditAlert(false);
    setEditItem(null);
  }
};

  // ================= DELETE =================

  const handleDelete = (item: any) => {
    setDeleteId(Number(item.MEASUREMENT_ID));
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      const deleted = await deleteMeasurement(deleteId);

      if (deleted) {
        setMeasurements((prev) =>
          prev.filter(
            (item) =>
              Number(item.MEASUREMENT_ID) !== Number(deleteId)
          )
        );

        setShowAlert(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Measurements
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Customer Measurements
          </Text>
        </View>

        <View
          style={[
            styles.countBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="resize-outline"
            size={18}
            color={theme.primary}
          />

          <Text
            style={[
              styles.countText,
              { color: theme.primary },
            ]}
          >
            {measurements.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={measurements}
        keyExtractor={(item) =>
          String(item.MEASUREMENT_ID)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          measurements.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    theme.inputBackground,
                },
              ]}
            >
              <Ionicons
                name="resize-outline"
                size={52}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text },
              ]}
            >
              No Measurements Found
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.secondaryText },
              ]}
            >
              Add a measurement to get started.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.typeContainer}>
                <View
                  style={[
                    styles.typeIcon,
                    {
                      backgroundColor:
                        theme.inputBackground,
                    },
                  ]}
                >
                  <Ionicons
                    name="shirt-outline"
                    size={21}
                    color={theme.primary}
                  />
                </View>

                <View style={styles.typeInfo}>
                  <Text
                    style={[
                      styles.type,
                      { color: theme.text },
                    ]}
                  >
                    {item.TYPE}
                  </Text>

                  <Text
                    style={[
                      styles.measurementId,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Measurement #{item.MEASUREMENT_ID}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleUpdate(item)}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={theme.primary}
                  />
                </Pressable>

                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleDelete(item)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.primary}
                  />
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            <View style={styles.measurements}>

              {/* ================= CHEST ================= */}
              {item.CHEST != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Chest
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.CHEST}
                  </Text>
                </View>
              )}

              {/* ================= WAIST ================= */}
              {item.WAIST != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Waist
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.WAIST}
                  </Text>
                </View>
              )}

              {/* ================= QAMEEZ ================= */}
              {item.QAMEEZ_LENGTH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Qameez
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.QAMEEZ_LENGTH}
                  </Text>
                </View>
              )}

              {/* ================= SHIRT ================= */}
              {item.SHIRT_LENGTH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Shirt
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.SHIRT_LENGTH}
                  </Text>
                </View>
              )}

              {/* ================= SHALWAR ================= */}
              {item.SHALWAR_LENGTH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Shalwar
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.SHALWAR_LENGTH}
                  </Text>
                </View>
              )}

              {/* ================= TROUSER ================= */}
              {item.TROUSER_LENGTH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Trouser
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.TROUSER_LENGTH}
                  </Text>
                </View>
              )}

              {/* ================= SLEEVE ================= */}
              {item.SLEEVE != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Sleeve
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.SLEEVE}
                  </Text>
                </View>
              )}

              {/* ================= DAMAN ================= */}
              {item.DAMAN != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Daman
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.DAMAN}
                  </Text>
                </View>
              )}

              {/* ================= LENGTH ================= */}
              {item.LENGTH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Length
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.LENGTH}
                  </Text>
                </View>
              )}

              {/* ================= HIP ================= */}
              {item.HIP != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Hip
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.HIP}
                  </Text>
                </View>
              )}

              {/* ================= THIGH ================= */}
              {item.THIGH != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Thigh
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.THIGH}
                  </Text>
                </View>
              )}

              {/* ================= BOTTOM ================= */}
              {item.BOTTOM != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Bottom
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.BOTTOM}
                  </Text>
                </View>
              )}

              {/* ================= SHOULDER ================= */}
              {item.SHOULDER != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Shoulder
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.SHOULDER}
                  </Text>
                </View>
              )}

              {/* ================= ARMHOLE ================= */}
              {item.ARMHOLE != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Armhole
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.ARMHOLE}
                  </Text>
                </View>
              )}

              {/* ================= COLLAR ================= */}
              {item.COLLAR != null && (
                <View
                  style={[
                    styles.measureBox,
                    {
                      backgroundColor:
                        theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.measureLabel,
                      { color: theme.secondaryText },
                    ]}
                  >
                    Collar
                  </Text>

                  <Text
                    style={[
                      styles.measureValue,
                      { color: theme.text },
                    ]}
                  >
                    {item.COLLAR}
                  </Text>
                </View>
              )}
            </View>

            {/* ================= NOTES ================= */}
            {item.NOTES && (
              <View
                style={[
                  styles.notesBox,
                  {
                    backgroundColor:
                      theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.notesIcon,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={17}
                    color={theme.primary}
                  />
                </View>

                <Text
                  style={[
                    styles.notesText,
                    { color: theme.text },
                  ]}
                >
                  {item.NOTES}
                </Text>
              </View>
            )}
          </View>
        )}
      />

      {/* ================= DELETE ALERT ================= */}
      <CustomAlert
        visible={ShowAlert}
        title="Delete Measurement"
        Message="Are you sure you want to delete this measurement?"
        onCancel={() => {
          setShowAlert(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* ================= ADD BUTTON ================= */}
      <FloatingButton
  onPress={() => {
    navigation.navigate("AddMeasurement", {
      id: String(id),
    });
  }}
/>

      {/* ================= EDIT ALERT ================= */}
      <CustomAlert
        visible={showEditAlert}
        title="Edit Measurement"
        Message="Are you sure you want to edit this measurement?"
        onCancel={() => {
          setShowEditAlert(false);
          setEditItem(null);
        }}
        onConfirm={confirmUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  countBox: {
    minWidth: 48,
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },

  countText: {
    fontSize: 17,
    fontWeight: "bold",
  },

  listContainer: {
    paddingBottom: 90,
  },

  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
  },

  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 14,
    marginTop: 6,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  typeIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  typeInfo: {
    flex: 1,
  },

  type: {
    fontSize: 17,
    fontWeight: "bold",
  },

  measurementId: {
    fontSize: 12,
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  actionButton: {
    width: 39,
    height: 39,
    borderRadius: 11,
    borderWidth: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  measurements: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  measureBox: {
    width: "31%",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },

  measureLabel: {
    fontSize: 11,
    marginBottom: 2,
  },

  measureValue: {
    fontSize: 15,
    fontWeight: "bold",
  },

  notesBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 13,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },

  notesIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  notesText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
  },
});