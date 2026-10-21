
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ListCustomerScreen() {
  const navigation = useNavigation<any>();

  const customers = [
    { id: 1, name: 'Ali Ahmed', phone: '03001234567' },
    { id: 2, name: 'Sara Khan', phone: '03111234567' },
    { id: 3, name: 'Ayesha Malik', phone: '03221234567' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 10 }}>

        {customers.map((customer) => (
          <View
            key={customer.id}
            style={{
              margin: 10,
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#EEEEEE',
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {customer.name}
              </Text>

              <Text style={{ color: '#666666', marginTop: 5 }}>
                {customer.phone}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddCustomer', {
                    customer: customer,
                  })
                }
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color="#C9A227"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => console.log('Delete customer:', customer.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
