
import AsyncStorage from '@react-native-async-storage/async-storage';
import databaseConnection  from './DatabaseConnection';

// Create Profile Image Table
export async function ProfileImage() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS PROFILE_IMAGE (
        IMAGE_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INTEGER NOT NULL,
        IMAGE_URI TEXT NOT NULL,
        FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
      );
    `);

    console.log('Profile image table created successfully');
  } catch (error) {
    console.log('Failed to create profile image table:', error);
    throw error;
  }
}

// Save Profile Image
export async function saveProfileImage(imageUri: string) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      throw new Error('User ID not found');
    }

    await db.executeSql(
      'DELETE FROM PROFILE_IMAGE WHERE USER_ID = ?',
      [Number(userId)]
    );

    await db.executeSql(
      `INSERT INTO PROFILE_IMAGE (USER_ID, IMAGE_URI)
       VALUES (?, ?)`,
      [Number(userId), imageUri]
    );

    console.log('Profile image saved successfully');
  } catch (error) {
    console.log('Failed to save profile image:', error);
    throw error;
  }
}

// Get Profile Image
export async function getProfileImage() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      return null;
    }

    const [result] = await db.executeSql(
      `SELECT IMAGE_URI
       FROM PROFILE_IMAGE
       WHERE USER_ID = ?
       LIMIT 1`,
      [Number(userId)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0).IMAGE_URI as string;
    }

    return null;
  } catch (error) {
    console.log('Failed to get profile image:', error);
    return null;
  }
}

// Create Order Image Table
export async function Order_Image() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS ORDER_IMAGE (
        ORDER_IMAGE_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        ORDER_ID INTEGER NOT NULL,
        ORDER_IMAGE_URI TEXT NOT NULL,
        FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID)
      );
    `);

    console.log('Order image table created successfully');
  } catch (error) {
    console.log('Failed to create order image table:', error);
    throw error;
  }
}

// Add Order Image (Maximum 2 images per order)
export async function addOrderImage(
  imageUri: string,
  orderId: number
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT COUNT(*) AS count
       FROM ORDER_IMAGE
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    const count = result.rows.item(0).count;

    if (count >= 2) {
      console.log('Image limit reached');
      return false;
    }

    await db.executeSql(
      `INSERT INTO ORDER_IMAGE
       (ORDER_ID, ORDER_IMAGE_URI)
       VALUES (?, ?)`,
      [orderId, imageUri]
    );

    console.log('Order image inserted successfully');
    return true;
  } catch (error) {
    console.log('Failed to insert order image:', error);
    throw error;
  }
}

// Get Order Images
export async function getOrderImage(orderId: number) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT ORDER_IMAGE_ID, ORDER_ID, ORDER_IMAGE_URI
       FROM ORDER_IMAGE
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    const images: {
      ORDER_IMAGE_ID: number;
      ORDER_ID: number;
      ORDER_IMAGE_URI: string;
    }[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      images.push(result.rows.item(i));
    }

    return images;
  } catch (error) {
    console.log('Failed to get order images:', error);
    throw error;
  }
}

// Delete Order Image
export async function deleteOrderImage(imageId: number) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `DELETE FROM ORDER_IMAGE
       WHERE ORDER_IMAGE_ID = ?`,
      [imageId]
    );

    console.log('Order image deleted successfully');
  } catch (error) {
    console.log('Failed to delete order image:', error);
    throw error;
  }
}

// Update Order Image
export async function Update_OrderImage(
  imageuri: string,
  imageId: number
) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `UPDATE ORDER_IMAGE
       SET ORDER_IMAGE_URI = ?
       WHERE ORDER_IMAGE_ID = ?`,
      [imageuri, imageId]
    );

    console.log('Order image updated successfully');
  } catch (error) {
    console.log('Failed to update order image:', error);
    throw error;
  }
}
