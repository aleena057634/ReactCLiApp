
import React, { useContext, useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';

import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';

import ThemeContext from '../../context/ThemeContext';

import {
  addMeasurement,
  updateMeasurement,
} from "../../database/MeasuremenrCruc";

import { ConfirmAlert } from '../../components/CustomAlert';

type MeasurementParams = {
  MeasurementForm: {
    id: string | number;
    type: string;
    measurementId?: string | number;
    Chest?: string;
    Waist?: string;
    Qameez_Length?: string;
    Shirt_Length?: string;
    Shalwar_Length?: string;
    Trouser_Length?: string;
    Sleeve?: string;
    Daman?: string;
    Hip?: string;
    Thigh?: string;
    Bottom?: string;
    Shoulder?: string;
    Collar?: string;
    Length?: string;
    Armhole?: string;
    Notes?: string;
  };
};

export default function MeasurementForm() {
  const navigation = useNavigation<any>();

  const route =
    useRoute<RouteProp<MeasurementParams, 'MeasurementForm'>>();

  const params = route.params;

  const {
    id,
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
  } = params;

  const { theme } = useContext(ThemeContext);

  const [measurement, setMeasurement] = useState({
    Chest: '',
    Waist: '',
    Qameez_Length: '',
    Shalwar_Length: '',
    Shirt_Length: '',
    Trouser_Length: '',
    Sleeve: '',
    Daman: '',
    Hip: '',
    Thigh: '',
    Bottom: '',
    Shoulder: '',
    Collar: '',
    Length: '',
    Armhole: '',
    Notes: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  function takeFirstLetter(value: string) {
    return value.charAt(0);
  }

  useEffect(() => {
    if (measurementId) {
      setMeasurement({
        Chest: Chest?.toString() || '',
        Waist: Waist?.toString() || '',
        Qameez_Length: Qameez_Length?.toString() || '',
        Shalwar_Length: Shalwar_Length?.toString() || '',
        Shirt_Length: Shirt_Length?.toString() || '',
        Trouser_Length: Trouser_Length?.toString() || '',
        Sleeve: Sleeve?.toString() || '',
        Daman: Daman?.toString() || '',
        Hip: Hip?.toString() || '',
        Thigh: Thigh?.toString() || '',
        Bottom: Bottom?.toString() || '',
        Shoulder: Shoulder?.toString() || '',
        Collar: Collar?.toString() || '',
        Length: Length?.toString() || '',
        Armhole: Armhole?.toString() || '',
        Notes: Notes?.toString() || '',
      });
    }
  }, [measurementId]);

  function Input(
    placeholder: string,
    field: keyof typeof measurement,
  ) {
    return (
      <View style={styles.field}>
        <Text
          style={[styles.label, { color: theme.text }]}
        >
          {placeholder}
        </Text>

        <TextInput
          placeholder={placeholder}
          keyboardType={
            field === 'Notes' ? 'default' : 'numeric'
          }
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            field === 'Notes' && styles.notes,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          value={measurement[field]}
          onChangeText={value =>
            setMeasurement(previous => ({
              ...previous,
              [field]: value,
            }))
          }
          multiline={field === 'Notes'}
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
            { backgroundColor: theme.primary },
          ]}
        />

        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          {title}
        </Text>
      </View>
    );
  }

  function validateMeasurement() {
    let requiredFields: (keyof typeof measurement)[] = [];

    if (type === 'Male Shalwar Kameez') {
      requiredFields = [
        'Chest', 'Waist', 'Shoulder', 'Sleeve',
        'Qameez_Length', 'Daman', 'Collar', 'Armhole',
        'Shalwar_Length', 'Thigh', 'Bottom',
      ];
    } else if (type === 'Female Shalwar Kameez') {
      requiredFields = [
        'Chest', 'Shoulder', 'Waist', 'Hip',
        'Qameez_Length', 'Sleeve', 'Armhole', 'Daman',
        'Collar', 'Shalwar_Length', 'Thigh', 'Bottom',
      ];
    } else if (type === 'Pant') {
      requiredFields = [
        'Waist', 'Hip', 'Thigh', 'Bottom', 'Length',
      ];
    } else if (type === 'Shirt') {
      requiredFields = [
        'Chest', 'Shoulder', 'Sleeve', 'Collar', 'Length',
      ];
    } else if (type === 'Coat') {
      requiredFields = [
        'Chest', 'Waist', 'Shoulder', 'Sleeve',
        'Length', 'Armhole', 'Hip', 'Collar',
      ];
    }

    const isValid = requiredFields.every(
      field => measurement[field].trim() !== '',
    );

    if (!isValid) {
      setShowAlert(true);
      return false;
    }

    return true;
  }

  async function saveMeasurement() {
    if (showLoader) return;

    if (!validateMeasurement()) return;

    setShowLoader(true);

    try {
      if (measurementId) {
        const result = await updateMeasurement(
          Number(measurementId),
          measurement,
        );

        console.log('Update result:', result);
      } else {
        const result = await addMeasurement(
          Number(id),
          String(type),
          measurement,
        );

        console.log('Add result:', result);
      }

     navigation.popToTop();;
    } catch (error) {
      console.error('Save measurement error:', error);
      setShowAlert(true);
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.background },
        ]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
                { backgroundColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.headerIconText,
                  { color: theme.white },
                ]}
              >
                {takeFirstLetter(String(type || ''))}
              </Text>
            </View>

            <View style={styles.headerInfo}>
              <Text
                style={[
                  styles.title,
                  { color: theme.text },
                ]}
              >
                {type}
              </Text>

              <Text
                style={[
                  styles.customer,
                  { color: theme.secondaryText },
                ]}
              >
                Customer ID: {id}
              </Text>
            </View>
          </View>
        </View>

        {type === 'Male Shalwar Kameez' && (
          <View>
            <SectionTitle title="Qameez Measurements" />
            <View style={styles.row}>
              {Input('Chest', 'Chest')}
              {Input('Waist', 'Waist')}
            </View>
            <View style={styles.row}>
              {Input('Shoulder', 'Shoulder')}
              {Input('Sleeve', 'Sleeve')}
            </View>
            <View style={styles.row}>
              {Input('Qameez Length', 'Qameez_Length')}
              {Input('Daman', 'Daman')}
            </View>
            <View style={styles.row}>
              {Input('Collar', 'Collar')}
              {Input('Armhole', 'Armhole')}
            </View>

            <SectionTitle title="Shalwar Measurements" />
            <View style={styles.row}>
              {Input('Shalwar Length', 'Shalwar_Length')}
              {Input('Thigh', 'Thigh')}
            </View>
            <View style={styles.row}>
              {Input('Bottom', 'Bottom')}
              <View style={styles.emptyField} />
            </View>
          </View>
        )}

        {type === 'Female Shalwar Kameez' && (
          <View>
            <SectionTitle title="Qameez Measurements" />
            <View style={styles.row}>
              {Input('Chest', 'Chest')}
              {Input('Shoulder', 'Shoulder')}
            </View>
            <View style={styles.row}>
              {Input('Waist', 'Waist')}
              {Input('Hip', 'Hip')}
            </View>
            <View style={styles.row}>
              {Input('Qameez Length', 'Qameez_Length')}
              {Input('Sleeve', 'Sleeve')}
            </View>
            <View style={styles.row}>
              {Input('Armhole', 'Armhole')}
              {Input('Daman', 'Daman')}
            </View>
            <View style={styles.row}>
              {Input('Collar / Neck', 'Collar')}
              <View style={styles.emptyField} />
            </View>

            <SectionTitle title="Shalwar Measurements" />
            <View style={styles.row}>
              {Input('Shalwar Length', 'Shalwar_Length')}
              {Input('Thigh', 'Thigh')}
            </View>
            <View style={styles.row}>
              {Input('Bottom', 'Bottom')}
              <View style={styles.emptyField} />
            </View>
          </View>
        )}

        {type === 'Pant' && (
          <View>
            <SectionTitle title="Pant Measurements" />
            <View style={styles.row}>
              {Input('Waist', 'Waist')}
              {Input('Hip', 'Hip')}
            </View>
            <View style={styles.row}>
              {Input('Thigh', 'Thigh')}
              {Input('Bottom', 'Bottom')}
            </View>
            <View style={styles.row}>
              {Input('Length', 'Length')}
              {Input('Trouser Length', 'Trouser_Length')}
            </View>
          </View>
        )}

        {type === 'Shirt' && (
          <View>
            <SectionTitle title="Shirt Measurements" />
            <View style={styles.row}>
              {Input('Chest', 'Chest')}
              {Input('Shoulder', 'Shoulder')}
            </View>
            <View style={styles.row}>
              {Input('Sleeve', 'Sleeve')}
              {Input('Collar', 'Collar')}
            </View>
            <View style={styles.row}>
              {Input('Length', 'Length')}
              {Input('Shirt Length', 'Shirt_Length')}
            </View>
          </View>
        )}

        {type === 'Coat' && (
          <View>
            <SectionTitle title="Coat Measurements" />
            <View style={styles.row}>
              {Input('Chest', 'Chest')}
              {Input('Waist', 'Waist')}
            </View>
            <View style={styles.row}>
              {Input('Shoulder', 'Shoulder')}
              {Input('Sleeve', 'Sleeve')}
            </View>
            <View style={styles.row}>
              {Input('Length', 'Length')}
              {Input('Armhole', 'Armhole')}
            </View>
            <View style={styles.row}>
              {Input('Hip', 'Hip')}
              {Input('Collar', 'Collar')}
            </View>
          </View>
        )}

        <SectionTitle title="Additional Notes" />
        {Input('Notes', 'Notes')}

        {showLoader ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
          />
        ) : (
          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: theme.primary },
            ]}
            onPress={saveMeasurement}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: theme.white },
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
          onConfirm={() => setShowAlert(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 5,
  },
  container: {
    padding: 16,
    paddingBottom: 50,
    flexGrow: 1,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  headerIconText: {
    fontSize: 17,
    fontWeight: '900',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 3,
  },
  customer: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    flex: 1,
    marginBottom: 4,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '900',
    marginBottom: 5,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  notes: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  emptyField: {
    flex: 1,
  },
  saveButton: {
    borderRadius: 30,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginStart: 20,
    marginEnd: 20,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '800',
  },
});
