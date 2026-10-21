
import AsyncStorage from "@react-native-async-storage/async-storage";
import databaseConnection from "./DatabaseConnection";

// ==========================================
// CREATE ORDERS TABLE
// ==========================================
export async function order_Table() {
  try {
    const db = await databaseConnection;

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS ORDERS (
        ORDER_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        QUANTITY INTEGER NOT NULL,
        ORDER_STAUS TEXT NOT NULL,
        ORDER_PIRIORITY TEXT NOT NULL,
        ORDER_ARRIVAL_DATE TEXT NOT NULL,
        ORDER_DEPARTURE_DATE TEXT NOT NULL,
        ORDER_PAYMENT REAL NOT NULL,
        ORDER_ADVANCEPAYMENT REAL DEFAULT 0,
        ORDER_REMAINING REAL DEFAULT 0,
        CUSTOMER_ID INTEGER NOT NULL,
        MEASUREMENT_ID INTEGER NOT NULL,
        USER_ID INTEGER NOT NULL,
        NOTES TEXT,
        FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMER(ID),
        FOREIGN KEY (MEASUREMENT_ID)
          REFERENCES MEASUREMENTS(MEASUREMENT_ID)
      );
    `);

    console.log("ORDERS table created successfully");
  } catch (error) {
    console.log("Failed to create ORDERS table:", error);
  }
}

// ==========================================
// ADD ORDER
// ORDER_NAME REMOVED
// ==========================================
export async function addOrder(
  quantity: number,
  status: string,
  priority: string,
  arrivalDate: string,
  departureDate: string,
  payment: number,
  advancePayment: number,
  remainingPayment: number,
  customerId: number,
  measurementId: number,
  notes: string
) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID not found");
    }

    const [result] = await db.executeSql(
      `INSERT INTO ORDERS (
        QUANTITY,
        ORDER_STAUS,
        ORDER_PIRIORITY,
        ORDER_ARRIVAL_DATE,
        ORDER_DEPARTURE_DATE,
        ORDER_PAYMENT,
        ORDER_ADVANCEPAYMENT,
        ORDER_REMAINING,
        CUSTOMER_ID,
        MEASUREMENT_ID,
        USER_ID,
        NOTES
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quantity,
        status,
        priority,
        arrivalDate,
        departureDate,
        payment,
        advancePayment,
        remainingPayment,
        customerId,
        measurementId,
        Number(userId),
        notes || null
      ]
    );

    console.log("Order added successfully");

    return result;
  } catch (error) {
    console.log("Failed to add order:", error);
    throw error;
  }
}

// ==========================================
// GET ALL ORDERS
// ==========================================
export async function getAllOrders() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return [];
    }

    const [result] = await db.executeSql(
      `SELECT *
       FROM ORDERS
       WHERE USER_ID = ?
       ORDER BY ORDER_ID DESC`,
      [Number(userId)]
    );

    const orders = [];

    for (let i = 0; i < result.rows.length; i++) {
      orders.push(result.rows.item(i));
    }

    return orders;
  } catch (error) {
    console.log("Failed to load orders:", error);
    return [];
  }
}

// ==========================================
// DELETE ORDER
// ==========================================
export async function deleteOrder(orderId: number) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return;
    }

    await db.executeSql(
      `DELETE FROM ORDERS
       WHERE ORDER_ID = ?
       AND USER_ID = ?`,
      [orderId, Number(userId)]
    );

    console.log("Order deleted successfully");
  } catch (error) {
    console.log("Failed to delete order:", error);
    throw error;
  }
}

// ==========================================
// GET ORDER DETAIL
// ==========================================
export async function Order_detail(orderId: number) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return null;
    }

    const [result] = await db.executeSql(
      `SELECT *
       FROM ORDERS
       WHERE ORDER_ID = ?
       AND USER_ID = ?`,
      [orderId, Number(userId)]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }

    return null;
  } catch (error) {
    console.log("Failed to get order details:", error);
    return null;
  }
}

// ==========================================
// RECENT ORDERS
// Latest 3 orders
// ==========================================
export async function getRecentOrders() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return [];
    }

    const [result] = await db.executeSql(
      `SELECT *
       FROM ORDERS
       WHERE USER_ID = ?
       ORDER BY ORDER_ID DESC
       LIMIT 3`,
      [Number(userId)]
    );

    const orders = [];

    for (let i = 0; i < result.rows.length; i++) {
      orders.push(result.rows.item(i));
    }

    return orders;
  } catch (error) {
    console.log("Failed to get recent orders:", error);
    return [];
  }
}

// ==========================================
// TODAY'S ORDERS
// ==========================================
export async function getTodayOrders() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return [];
    }

    const [result] = await db.executeSql(
      `SELECT *
       FROM ORDERS
       WHERE ORDER_DEPARTURE_DATE = date('now', 'localtime')
       AND USER_ID = ?
       ORDER BY ORDER_ID DESC`,
      [Number(userId)]
    );

    const orders = [];

    for (let i = 0; i < result.rows.length; i++) {
      orders.push(result.rows.item(i));
    }

    return orders;
  } catch (error) {
    console.log("Failed to get today's orders:", error);
    return [];
  }
}

// ==========================================
// URGENT ORDERS
// ==========================================
export async function getUrgentOrders() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return [];
    }

    const [result] = await db.executeSql(
      `SELECT *
       FROM ORDERS
       WHERE ORDER_PIRIORITY = ?
       AND USER_ID = ?
       ORDER BY ORDER_ID DESC`,
      ["Urgent", Number(userId)]
    );

    const orders = [];

    for (let i = 0; i < result.rows.length; i++) {
      orders.push(result.rows.item(i));
    }

    return orders;
  } catch (error) {
    console.log("Failed to get urgent orders:", error);
    return [];
  }
}

// ==========================================
// UPDATE ORDER STATUS
// ==========================================
export async function updateOrderStatus(
  orderId: number,
  status: string
) {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return false;
    }

    await db.executeSql(
      `UPDATE ORDERS
       SET ORDER_STAUS = ?
       WHERE ORDER_ID = ?
       AND USER_ID = ?`,
      [status, orderId, Number(userId)]
    );

    console.log("Order status updated successfully");
    return true;
  } catch (error) {
    console.log("Failed to update order status:", error);
    return false;
  }
}

// ==========================================
// TOTAL ORDERS
// ==========================================
export async function TotalOrders() {
  try {
    const db = await databaseConnection;
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      return 0;
    }

    const [result] = await db.executeSql(
      `SELECT COUNT(*) AS count
       FROM ORDERS
       WHERE USER_ID = ?`,
      [Number(userId)]
    );

    return result.rows.item(0).count || 0;
  } catch (error) {
    console.log("Failed to count orders:", error);
    return 0;
  }
}

// ==========================================
// GET TOTAL ORDER AMOUNT
// ==========================================
export async function getTotalAmount(orderId: number) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT ORDER_PAYMENT
       FROM ORDERS
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0).ORDER_PAYMENT;
    }

    return 0;
  } catch (error) {
    console.log("Failed to get total amount:", error);
    return 0;
  }
}

// ==========================================
// MARK ORDER AS FULLY PAID
// ==========================================
export async function PaidAmount(orderId: number) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `UPDATE ORDERS
       SET ORDER_REMAINING = 0
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    console.log("Order marked as paid");
  } catch (error) {
    console.log("Failed to mark order as paid:", error);
  }
}

// ==========================================
// MARK REMAINING AMOUNT AS PAID
// ==========================================
export async function Mark(orderId: number) {
  try {
    const db = await databaseConnection;

    const [selectResult] = await db.executeSql(
      `SELECT ORDER_ADVANCEPAYMENT, ORDER_REMAINING
       FROM ORDERS
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    if (selectResult.rows.length === 0) {
      return;
    }

    const order = selectResult.rows.item(0);

    if (order.ORDER_REMAINING <= 0) {
      return;
    }

    const newPayment = order.ORDER_REMAINING;
    const newPaidAmount =
      order.ORDER_ADVANCEPAYMENT + newPayment;

    await db.executeSql(
      `INSERT INTO PAYMENT
       (ORDER_ID, PAYMENT_AMOUNT, PAYMENT_DATE)
       VALUES (?, ?, ?)`,
      [
        orderId,
        newPayment,
        new Date().toLocaleDateString()
      ]
    );

    await db.executeSql(
      `UPDATE ORDERS
       SET ORDER_ADVANCEPAYMENT = ?,
           ORDER_REMAINING = 0
       WHERE ORDER_ID = ?`,
      [newPaidAmount, orderId]
    );

    console.log("Order marked as paid");
  } catch (error) {
    console.log("Failed to mark order as paid:", error);
  }
}

// ==========================================
// PARTIAL PAYMENT
// ==========================================
export async function Partial_Payment(
  orderId: number,
  amount: number
) {
  try {
    const db = await databaseConnection;

    const [selectResult] = await db.executeSql(
      `SELECT ORDER_ADVANCEPAYMENT, ORDER_REMAINING
       FROM ORDERS
       WHERE ORDER_ID = ?`,
      [orderId]
    );

    if (selectResult.rows.length === 0) {
      return;
    }

    const order = selectResult.rows.item(0);

    if (amount <= 0 || amount > order.ORDER_REMAINING) {
      throw new Error("Invalid payment amount");
    }

    const newPaidAmount =
      order.ORDER_ADVANCEPAYMENT + amount;

    const newRemaining =
      order.ORDER_REMAINING - amount;

    await db.executeSql(
      `INSERT INTO PAYMENT
       (ORDER_ID, PAYMENT_AMOUNT, PAYMENT_DATE)
       VALUES (?, ?, ?)`,
      [
        orderId,
        amount,
        new Date().toLocaleDateString()
      ]
    );

    await db.executeSql(
      `UPDATE ORDERS
       SET ORDER_ADVANCEPAYMENT = ?,
           ORDER_REMAINING = ?
       WHERE ORDER_ID = ?`,
      [newPaidAmount, newRemaining, orderId]
    );
  } catch (error) {
    console.log("Failed to add partial payment:", error);
    throw error;
  }
}

// ==========================================
// GET CUSTOMER NAME
// ==========================================
export async function getCustomerName(customerId: number) {
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

    return "Unknown Customer";
  } catch (error) {
    console.log("Failed to get customer name:", error);
    return "Unknown Customer";
  }
}