
import React, { useContext } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import ThemeContext from "../../context/ThemeContext";
import Ionicons from '@react-native-vector-icons/ionicons';
export default function AddMeasurement() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const { theme } = useContext(ThemeContext);

  function selectMeasurement(type: string) {
    navigation.navigate('MeasurementForm', {
      id: String(id),
      type: type,
    });
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: theme.text }]}
          >
            Add Measurement
          </Text>

          <Text style={{ color: theme.secondaryText }}>
            Customer Id: {id}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
            ]}
          >
            Select the type of measurement
          </Text>
        </View>

        <View style={styles.list}>
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectMeasurement('Male Shalwar Kameez')}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Male Shalwar Kameez
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Add male shalwar kameez measurement
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectMeasurement('Female Shalwar Kameez')}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Female Shalwar Kameez
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Add female shalwar kameez measurement
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectMeasurement('Pant')}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Pant
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Add pant measurement
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectMeasurement('Shirt')}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Shirt
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Add shirt measurement
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectMeasurement('Coat')}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Coat
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { color: theme.secondaryText },
              ]}
            >
              Add coat measurement
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },

  list: {
    gap: 14,
  },

  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  cardSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },
});
