
import AsyncStorage from "@react-native-async-storage/async-storage";
import databaseConnection from "./DatabaseConnection";

// ==========================================
// CREATE PAYMENT TABLE
// ==========================================
export async function payment_table() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS PAYMENT (
        PAYMENT_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        ORDER_ID INTEGER NOT NULL,
        PAYMENT_AMOUNT REAL NOT NULL,
        PAYMENT_DATE TEXT,
        FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID)
      );
    `);

    console.log("Payment table created successfully");
  } catch (error) {
    console.log("Failed to create Payment table:", error);
    throw error;
  }
}

// ==========================================
// ADD PAYMENT AND UPDATE ORDER
// ==========================================
export async function Payment_Value(
  orderId: number,
  paymentAmount: number,
  paymentDate: string
) {
  try {
    const db = await databaseConnection;

    const [orderResult] = await db.executeSql(
      `SELECT
         ORDER_PAYMENT,
         ORDER_ADVANCEPAYMENT,
         ORDER_REMAINING
       FROM ORDERS
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows.item(0);

    const newPayment =
      Number(order.ORDER_ADVANCEPAYMENT || 0) +
      Number(paymentAmount);

    const remainingAmount =
      Number(order.ORDER_PAYMENT || 0) - newPayment;

    if (paymentAmount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    if (paymentAmount > Number(order.ORDER_REMAINING)) {
      throw new Error("Payment amount cannot exceed remaining amount");
    }

    // Save payment history
    await db.executeSql(
      `INSERT INTO PAYMENT (
         ORDER_ID,
         PAYMENT_AMOUNT,
         PAYMENT_DATE
       )
       VALUES (?, ?, ?)`,
      [orderId, paymentAmount, paymentDate]
    );

    // Update order payment details
    await db.executeSql(
      `UPDATE ORDERS
       SET ORDER_ADVANCEPAYMENT = ?,
           ORDER_REMAINING = ?
       WHERE ORDER_ID = ?`,
      [newPayment, remainingAmount, orderId]
    );

    console.log("Payment added and order updated successfully");
  } catch (error) {
    console.log("Failed to add payment:", error);
    throw error;
  }
}

// ==========================================
// SHOW PAYMENT HISTORY
// ORDER_NAME REMOVED
// ==========================================
export async function Payment_Show() {
  try {
    const id = await AsyncStorage.getItem("userId");

    if (!id) {
      return [];
    }

    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT
         PAYMENT.PAYMENT_ID,
         PAYMENT.ORDER_ID,
         PAYMENT.PAYMENT_AMOUNT,
         PAYMENT.PAYMENT_DATE
       FROM PAYMENT
       INNER JOIN ORDERS
         ON PAYMENT.ORDER_ID = ORDERS.ORDER_ID
       WHERE ORDERS.USER_ID = ?
       ORDER BY PAYMENT.PAYMENT_ID DESC`,
      [Number(id)]
    );

    const payments = [];

    for (let i = 0; i < result.rows.length; i++) {
      payments.push(result.rows.item(i));
    }

    return payments;
  } catch (error) {
    console.log("Failed to get payments:", error);
    return [];
  }
}

// ==========================================
// CLEAR CURRENT USER'S PAYMENT HISTORY
// ==========================================
export async function ClearPaymentHistory() {
  try {
    const db = await databaseConnection;
    const id = await AsyncStorage.getItem("userId");

    if (!id) {
      return;
    }

    await db.executeSql(
      `DELETE FROM PAYMENT
       WHERE ORDER_ID IN (
         SELECT ORDER_ID
         FROM ORDERS
         WHERE USER_ID = ?
       )`,
      [Number(id)]
    );

    console.log("Current user's payment history cleared");
  } catch (error) {
    console.log("Failed to clear payment history:", error);
  }
}

// ==========================================
// GET CUSTOMER NAME BY ID
// ==========================================
export async function getCustomerNameById(
  customerId: number
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT NAME
       FROM CUSTOMER
       WHERE ID = ?`,
      [customerId]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0).NAME;
    }

    return null;
  } catch (error) {
    console.log("Failed to get customer name:", error);
    return null;
  }
}
