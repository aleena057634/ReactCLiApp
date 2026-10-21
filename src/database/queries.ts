
import databaseConnection from "./DatabaseConnection";

// ==========================================
// DELETE CUSTOMER
// ==========================================
export async function deleteCustomers(id: number) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `DELETE FROM CUSTOMER WHERE ID = ?`,
      [id]
    );

    console.log("Customer deleted successfully");
  } catch (error) {
    console.log("Failed to delete customer:", error);
    throw error;
  }
}

// ==========================================
// SHOW CUSTOMERS
// ==========================================
export async function showCustomer() {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT * FROM CUSTOMER`
    );

    const customers = [];

    for (let i = 0; i < result.rows.length; i++) {
      customers.push(result.rows.item(i));
    }

    console.log("Customers:", customers);

    return customers;
  } catch (error) {
    console.log("Failed to show customers:", error);
    throw error;
  }
}

// ==========================================
// ADD USER
// ==========================================
export async function adduser(
  NAME: string,
  EMAIL: string,
  PASSWORD: string,
  PHONE: string
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `INSERT INTO USERS (
        NAME,
        EMAIL,
        PASSWORD,
        PHONE
      )
      VALUES (?, ?, ?, ?)`,
      [NAME, EMAIL, PASSWORD, PHONE]
    );

    const newUserId = result.insertId;

    console.log(
      "User added successfully. ID:",
      newUserId
    );

    return newUserId;
  } catch (error) {
    console.log("User insertion failed:", error);
    throw error;
  }
}

// ==========================================
// SHOW USERS
// ==========================================
export async function showUsers() {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT * FROM USERS`
    );

    const users = [];

    for (let i = 0; i < result.rows.length; i++) {
      users.push(result.rows.item(i));
    }

    console.log("Current users:", users);

    return users;
  } catch (error) {
    console.log("Failed to show users:", error);
    throw error;
  }
}

// ==========================================
// CHECK EMAIL
// ==========================================
export async function checkEmail(userEmail: string) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT ID FROM USERS WHERE EMAIL = ?`,
      [userEmail]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }

    return null;
  } catch (error) {
    console.log("Failed to check email:", error);
    throw error;
  }
}

// ==========================================
// SIGN IN VALIDATION
// ==========================================
export async function SignInValidation(
  email: string,
  pass: string
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT ID, NAME, EMAIL, PASSWORD, PHONE
       FROM USERS
       WHERE EMAIL = ? AND PASSWORD = ?`,
      [email, pass]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0) as {
        ID: number;
        NAME: string;
        EMAIL: string;
        PASSWORD: string;
        PHONE: string;
      };
    }

    return null;
  } catch (error) {
    console.log("Failed to validate sign in:", error);
    throw error;
  }
}
