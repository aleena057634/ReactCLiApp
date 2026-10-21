
import AsyncStorage from '@react-native-async-storage/async-storage';
import databaseConnection  from '../database/DatabaseConnection';

// Add Customer
export async function AddCustomer(
  name: string,
  phone: string,
  address: string
) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      throw new Error('No logged-in user found');
    }

    await db.executeSql(
      `INSERT INTO CUSTOMER (NAME, PHONE, ADDRESS, USER_ID)
       VALUES (?, ?, ?, ?)`,
      [name, phone, address, Number(userId)]
    );

    console.log('Customer added successfully');
  } catch (error) {
    console.log('Failed to add customer:', error);
    throw error;
  }
}

// Get Customers of Logged-in User
export async function getCustomers() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      return [];
    }

    const [result] = await db.executeSql(
      `SELECT ID, NAME, PHONE, ADDRESS
       FROM CUSTOMER
       WHERE USER_ID = ?
       ORDER BY ID DESC`,
      [Number(userId)]
    );

    const customers: {
      ID: number;
      NAME: string;
      PHONE: string;
      ADDRESS: string;
    }[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      customers.push(result.rows.item(i));
    }

    return customers;
  } catch (error) {
    console.log('Failed to get customers:', error);
    return [];
  }
}

// Delete Customer
export async function DeleteCustomer(id: number) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      throw new Error('No logged-in user found');
    }

    const [result] = await db.executeSql(
      `DELETE FROM CUSTOMER
       WHERE ID = ? AND USER_ID = ?`,
      [id, Number(userId)]
    );

    if (result.rowsAffected === 0) {
      throw new Error('Customer not found');
    }

    console.log('Customer deleted successfully');

    return result;
  } catch (error) {
    console.log('Failed to delete customer:', error);
    throw error;
  }
}

// Update Customer
export async function updateCunstomer(
  id: number,
  name: string,
  phone: string,
  address: string
) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      throw new Error('No logged-in user found');
    }

    const [result] = await db.executeSql(
      `UPDATE CUSTOMER
       SET NAME = ?, PHONE = ?, ADDRESS = ?
       WHERE ID = ? AND USER_ID = ?`,
      [name, phone, address, id, Number(userId)]
    );

    if (result.rowsAffected === 0) {
      throw new Error('Customer not found or no changes made');
    }

    console.log('Customer updated successfully');
  } catch (error) {
    console.log('Failed to update customer:', error);
    throw error;
  }
}
