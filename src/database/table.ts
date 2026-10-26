
import AsyncStorage from '@react-native-async-storage/async-storage';
import databaseConnection from '../database/DatabaseConnection';

// Create Users Table
export async function userTable() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS USERS (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT,
        EMAIL TEXT,
        PASSWORD TEXT,
        PHONE TEXT
      );
    `);
  } catch (error) {
    console.log('User table creation error:', error);
    throw error;
  }
}

// Create Customer Table

export async function Customer_Table() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS CUSTOMER (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME TEXT NOT NULL,
        PHONE TEXT,
        ADDRESS TEXT,
        USER_ID INTEGER,
        UNIQUE (PHONE, USER_ID)
      );
    `);

    console.log('CUSTOMER table created successfully');
  } catch (error) {
    console.log('Failed to create Customer table:', error);
  }
}


// Create Measurement Table
export async function Measurement_table() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS MEASUREMENTS (
        MEASUREMENT_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        CUSTOMER_ID INTEGER NOT NULL,
        TYPE TEXT NOT NULL,
        MEASUREMENT_NAME TEXT,
        CHEST REAL,
        WAIST REAL,
        QAMEEZ_LENGTH REAL,
        SHIRT_LENGTH REAL,
        SHALWAR_LENGTH REAL,
        TROUSER_LENGTH REAL,
        SLEEVE REAL,
        DAMAN REAL,
        HIP REAL,
        THIGH REAL,
        BOTTOM REAL,
        SHOULDER REAL,
        COLLAR REAL,
        LENGTH REAL,
        ARMHOLE REAL,
        NOTES TEXT,
        FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMER(ID)
      );
    `);

    console.log('MEASUREMENTS table created successfully');
  } catch (error) {
    console.log('Failed to create Measurement table:', error);
  }
}

// RelationShip table create 
export async function RelationShipTable() {
  try {
    const db = await databaseConnection;
    await db.executeSql(`
    CREATE TABLE IF NOT EXISTS Relation_Table (
    Relation_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    CUSTOMER_ID INTEGER NOT NULL,
    NAME TEXT NOT NULL,
    RELATION TEXT NOT NULL,
    FOREIGN KEY (CUSTOMER_ID) REFERENCES Customer_Table(ID)
);`)
   

  } catch (error) {

  }
}
export async function InsertRelation(
  customerId: number,
  name: string,
  relation: string,
) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `INSERT INTO Relation_Table
       (CUSTOMER_ID, NAME, RELATION)
       VALUES (?, ?, ?)`,
      [customerId, name, relation],
    );

    return true;
  } catch (error) {
    console.log('Insert Relation Error:', error);
    return false;
  }
}
// display data
export async function GetRelations(customerId: number) {
  const db = await databaseConnection;

  const [results] = await db.executeSql(
    'SELECT * FROM Relation_Table WHERE CUSTOMER_ID = ?',
    [customerId],
  );

  const data = [];

  for (let i = 0; i < results.rows.length; i++) {
    data.push(results.rows.item(i));
  }

  return data;
}

export async function UpdateRelation(
  relationId: number,
  name: string,
  relation: string,
) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `UPDATE Relation_Table
       SET NAME = ?, RELATION = ?
       WHERE Relation_ID = ?`,
      [name, relation, relationId],
    );

    return true;
  } catch (error) {
    console.log('Update Relation Error:', error);
    return false;
  }
}

export async function DeleteRelation(relationId: number) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      'DELETE FROM Relation_Table WHERE Relation_ID = ?',
      [relationId],
    );

    return true;
  } catch (error) {
    console.log('Delete Relation Error:', error);
    return false;
  }
}

// Get Current User Detail
export async function getCurrentUserDetail() {
  try {
    const db = await databaseConnection;
    const id = await AsyncStorage.getItem('userId');

    if (!id) {
      return null;
    }

    const [result] = await db.executeSql(
      'SELECT * FROM USERS WHERE ID = ?',
      [Number(id)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }

    return null;
  } catch (error) {
    console.log('Failed to get user detail:', error);
    return null;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      return null;
    }

    const [result] = await db.executeSql(
      'SELECT ID, NAME, EMAIL FROM USERS WHERE ID = ?',
      [Number(userId)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0) as {
        ID: number;
        NAME: string;
        EMAIL: string;
      };
    }

    return null;
  } catch (error) {
    console.log('Failed to get current user:', error);
    throw error;
  }
}

// Get Total Customers
export async function getTotalCustomers() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      return 0;
    }

    const [result] = await db.executeSql(
      `SELECT COUNT(*) AS total
       FROM CUSTOMER
       WHERE USER_ID = ?`,
      [Number(userId)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0).total ?? 0;
    }

    return 0;
  } catch (error) {
    console.log('Failed to get total customers:', error);
    return 0;
  }
}

// Get Current User Name
export async function getCustomerName() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      return null;
    }

    const [result] = await db.executeSql(
      'SELECT NAME FROM USERS WHERE ID = ?',
      [Number(userId)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0).NAME;
    }

    return null;
  } catch (error) {
    console.log('Failed to get customer name:', error);
    return null;
  }
}

// Change Password
export async function ChangePassword(password: string) {
  try {
    const db = await databaseConnection;
    const id = await AsyncStorage.getItem('userId');

    if (!id) {
      return;
    }

    await db.executeSql(
      'UPDATE USERS SET PASSWORD = ? WHERE ID = ?',
      [password, Number(id)]
    );

    console.log('PASSWORD UPDATED SUCCESSFULLY');
  } catch (error) {
    console.log('Failed to update password:', error);
    throw error;
  }
}
