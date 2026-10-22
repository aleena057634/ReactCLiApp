
import React, { useCallback, useState } from 'react';

import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import {
  deleteCustomers,
  showCustomer,
} from '../../database/queries';

type Customer = {
  ID: number;
  NAME: string;
  PHONE: string;
  ADDRESS: string;
};

const Colors = {
  background: '#FFFFFF',
  primary: '#292929',
  gold: '#C9A227',
  text: '#292929',
  secondaryText: '#666666',
  border: '#DDDDDD',
  card: '#FFFFFF',
  placeholder: '#999999',
  error: '#D32F2F',
};

export default function ListCustomerScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [customersData, setCustomersData] = useState<Customer[]>([]);

  // Load customers whenever this screen becomes active
  const loadCustomers = useCallback(async () => {
    try {
      const data = await showCustomer();
      setCustomersData(data);
    } catch (error) {
      console.log('Failed to load customers:', error);
      Alert.alert('Error', 'Could not load customers.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
      setSearch('');
    }, [loadCustomers]),
  );

  // Search customers by name
  const filteredCustomers = customersData.filter(customer =>
    customer.NAME.toLowerCase().includes(search.trim().toLowerCase()),
  );

  // Delete customer
  const handleDeleteCustomer = (id: number) => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer permanently?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomers(id);
              await loadCustomers();
            } catch (error) {
              console.log('Error deleting customer:', error);
              Alert.alert('Error', 'Could not delete customer.');
            }
          },
        },
      ],
    );
  };

  // Open edit screen
  const handleEditCustomer = (customer: Customer) => {
    Alert.alert(
      'Edit Customer',
      'Do you want to edit this customer’s information?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Edit',
          onPress: () => {
            navigation.navigate('AddCustomer', {
              ID: customer.ID,
              NAME: customer.NAME,
              PHONE: customer.PHONE,
              ADDRESS: customer.ADDRESS,
            });
          },
        },
      ],
    );
  };

  // Customer card
  const renderCustomer = ({ item }: { item: Customer }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate('CustomerDetail', {
          id: item.ID,
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.NAME?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {item.NAME}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="call-outline"
            size={15}
            color={Colors.primary}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.PHONE}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color={Colors.primary}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.ADDRESS}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          hitSlop={5}
          onPress={() => handleDeleteCustomer(item.ID)}
        >
          <Ionicons
            name="trash-outline"
            size={19}
            color={Colors.primary}
          />
        </Pressable>

        <Pressable
          style={styles.actionButton}
          hitSlop={5}
          onPress={() => handleEditCustomer(item)}
        >
          <Ionicons
            name="create-outline"
            size={19}
            color={Colors.primary}
          />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Customers</Text>

      <Text style={styles.subtitle}>
        Manage your customer information
      </Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.secondaryText}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          placeholderTextColor={Colors.placeholder}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.secondaryText}
            />
          </Pressable>
        )}
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={item => item.ID.toString()}
        renderItem={renderCustomer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContainer,
          filteredCustomers.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={45}
                color={Colors.gold}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {search ? 'No Customers Found' : 'No Customers Yet'}
            </Text>

            <Text style={styles.emptyText}>
              {search
                ? 'Try searching with another name.'
                : 'Add a customer to get started.'}
            </Text>
          </View>
        }
      />

      {/* Add Customer Button */}
      <Pressable
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCustomer')}
        accessibilityRole="button"
        accessibilityLabel="Add customer"
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginHorizontal: 18,
    marginTop: 12,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 18,
  },

  searchContainer: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    marginHorizontal: 16,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 8,
  },

  listContainer: {
    paddingHorizontal: 14,
    paddingTop: 3,
    paddingBottom: 100,
  },

  emptyContainer: {
    flexGrow: 1,
  },

  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: '#FAF6E9',
    borderWidth: 1,
    borderColor: '#E8D9A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 7,
  },

  emptyText: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
  },

  card: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 11,
    marginBottom: 11,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  avatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  avatarText: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.gold,
  },

  customerInfo: {
    flex: 1,
    paddingRight: 5,
  },

  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 5,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  actionButton: {
    width: 32,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  floatingButton: {
    position: 'absolute',
    right: 22,
    bottom: 25,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
