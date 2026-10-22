
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import ThemeContext from '../../context/ThemeContext';
import { getCustomers } from '../../database/CustomerCru';
import Colors from '../../constents/colors';

export default function CustomerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const id = route.params?.id;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const context = useContext(ThemeContext);
  const theme = context?.theme ?? {
    background: Colors.background,
    text: Colors.text,
    secondaryText: '#777777',
    primary: Colors.primary,
    inputBackground: '#F3F3F3',
    card: '#FFFFFF',
    border: '#DDDDDD',
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  async function loadCustomer() {
    try {
      setLoading(true);

      const customers = await getCustomers();
      const foundCustomer = customers.find(
        (item: any) => String(item.ID) === String(id),
      );

      setCustomer(foundCustomer ?? null);
    } catch (error) {
      console.log('Failed to load customer:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }

function openOrders() {
  navigation.navigate('Main', {
    screen: 'Orders',
  });
}

  function openMeasurements() {
    if (!customer) return;

    navigation.navigate('MeasurementList', {
      id: String(customer.ID),
    });
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.pageHeader}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.text }]}>
            Customer Details
          </Text>

          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Customer information & services
          </Text>
        </View>

        <View
          style={[
            styles.headerIcon,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="person-outline" size={23} color={theme.primary} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : customer ? (
        <View
          style={[
            styles.customerCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.profileSection}>
            <View
              style={[
                styles.customerIcon,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <Ionicons name="person" size={28} color={theme.primary} />
            </View>

            <View style={styles.customerInfo}>
              <Text style={[styles.name, { color: theme.text }]}>
                {customer.NAME}
              </Text>

              <View
                style={[
                  styles.customerIdBox,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Text style={[styles.customerId, { color: theme.secondaryText }]}>
                  Customer #{customer.ID}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.detailsContainer,
              { borderTopColor: theme.border },
            ]}
          >
            <View style={styles.detailRow}>
              <View
                style={[
                  styles.detailIcon,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Ionicons name="call-outline" size={17} color={theme.primary} />
              </View>

              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
                  Phone
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {customer.PHONE || 'No phone number'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View
                style={[
                  styles.detailIcon,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={17}
                  color={theme.primary}
                />
              </View>

              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
                  Address
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {customer.ADDRESS || 'No address'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={35} color={theme.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            Customer not found
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Customer Services
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>
          Manage orders and measurements
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.serviceCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onPress={openOrders}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.serviceIcon,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="receipt-outline" size={27} color={theme.primary} />
        </View>

        <View style={styles.serviceContent}>
          <Text style={[styles.serviceTitle, { color: theme.text }]}>
            Orders
          </Text>
          <Text style={[styles.serviceSubtitle, { color: theme.secondaryText }]}>
            Manage customer orders
          </Text>
        </View>

        <View
          style={[
            styles.arrowCircle,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="chevron-forward" size={19} color={theme.primary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.serviceCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onPress={openMeasurements}
        activeOpacity={0.8}
        disabled={!customer}
      >
        <View
          style={[
            styles.serviceIcon,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="body-outline" size={27} color={theme.primary} />
        </View>

        <View style={styles.serviceContent}>
          <Text style={[styles.serviceTitle, { color: theme.text }]}>
            Measurements
          </Text>
          <Text style={[styles.serviceSubtitle, { color: theme.secondaryText }]}>
            View or add customer measurements
          </Text>
        </View>

        <View
          style={[
            styles.arrowCircle,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Ionicons name="chevron-forward" size={19} color={theme.primary} />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 18,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  customerCard: {
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    elevation: 3,
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  customerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 6,
  },
  customerIdBox: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  customerId: {
    fontSize: 10,
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },
  serviceCard: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  serviceIcon: {
    width: 53,
    height: 53,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  arrowCircle: {
    width: 35,
    height: 35,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 25,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 10,
  },
});
