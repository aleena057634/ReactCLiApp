
import databaseConnection from "./DatabaseConnection";

// ADD MEASUREMENT
export async function addMeasurement(
  customerId: number,
  type: string,
  measurement: any
) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `INSERT INTO MEASUREMENTS (
        CUSTOMER_ID,
        TYPE,
        CHEST,
        WAIST,
        QAMEEZ_LENGTH,
        SHIRT_LENGTH,
        SHALWAR_LENGTH,
        TROUSER_LENGTH,
        SLEEVE,
        DAMAN,
        HIP,
        THIGH,
        BOTTOM,
        SHOULDER,
        COLLAR,
        LENGTH,
        ARMHOLE,
        NOTES
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        type,
        measurement.Chest ? Number(measurement.Chest) : null,
        measurement.Waist ? Number(measurement.Waist) : null,
        measurement.Qameez_Length
          ? Number(measurement.Qameez_Length)
          : null,
        measurement.Shirt_Length
          ? Number(measurement.Shirt_Length)
          : null,
        measurement.Shalwar_Length
          ? Number(measurement.Shalwar_Length)
          : null,
        measurement.Trouser_Length
          ? Number(measurement.Trouser_Length)
          : null,
        measurement.Sleeve ? Number(measurement.Sleeve) : null,
        measurement.Daman ? Number(measurement.Daman) : null,
        measurement.Hip ? Number(measurement.Hip) : null,
        measurement.Thigh ? Number(measurement.Thigh) : null,
        measurement.Bottom ? Number(measurement.Bottom) : null,
        measurement.Shoulder ? Number(measurement.Shoulder) : null,
        measurement.Collar ? Number(measurement.Collar) : null,
        measurement.Length ? Number(measurement.Length) : null,
        measurement.Armhole ? Number(measurement.Armhole) : null,
        measurement.Notes || null,
      ]
    );

    console.log("Measurement added successfully");
    return true;
  } catch (error) {
    console.log("FAILED TO ADD MEASUREMENT:", error);
    throw error;
  }
}

// GET MEASUREMENTS BY CUSTOMER ID
export async function getMeasurements(customerId: number) {
  try {
    const db = await databaseConnection;

    const [results] = await db.executeSql(
      `SELECT *
       FROM MEASUREMENTS
       WHERE CUSTOMER_ID = ?`,
      [customerId]
    );

    const data = [];

    for (let i = 0; i < results.rows.length; i++) {
      data.push(results.rows.item(i));
    }

    console.log("MEASUREMENTS DATA:", data);

    return data;
  } catch (error) {
    console.log("FAILED TO GET MEASUREMENTS:", error);
    throw error;
  }
}

// UPDATE MEASUREMENT
export async function updateMeasurement(
  measurementId: number,
  measurement: any
) {
  try {
    const db = await databaseConnection;

    await db.executeSql(
      `UPDATE MEASUREMENTS SET
        CHEST = ?,
        WAIST = ?,
        QAMEEZ_LENGTH = ?,
        SHIRT_LENGTH = ?,
        SHALWAR_LENGTH = ?,
        TROUSER_LENGTH = ?,
        SLEEVE = ?,
        DAMAN = ?,
        HIP = ?,
        THIGH = ?,
        BOTTOM = ?,
        SHOULDER = ?,
        COLLAR = ?,
        LENGTH = ?,
        ARMHOLE = ?,
        NOTES = ?
      WHERE MEASUREMENT_ID = ?`,
      [
        measurement.Chest ? Number(measurement.Chest) : null,
        measurement.Waist ? Number(measurement.Waist) : null,
        measurement.Qameez_Length
          ? Number(measurement.Qameez_Length)
          : null,
        measurement.Shirt_Length
          ? Number(measurement.Shirt_Length)
          : null,
        measurement.Shalwar_Length
          ? Number(measurement.Shalwar_Length)
          : null,
        measurement.Trouser_Length
          ? Number(measurement.Trouser_Length)
          : null,
        measurement.Sleeve ? Number(measurement.Sleeve) : null,
        measurement.Daman ? Number(measurement.Daman) : null,
        measurement.Hip ? Number(measurement.Hip) : null,
        measurement.Thigh ? Number(measurement.Thigh) : null,
        measurement.Bottom ? Number(measurement.Bottom) : null,
        measurement.Shoulder ? Number(measurement.Shoulder) : null,
        measurement.Collar ? Number(measurement.Collar) : null,
        measurement.Length ? Number(measurement.Length) : null,
        measurement.Armhole ? Number(measurement.Armhole) : null,
        measurement.Notes || null,
        measurementId,
      ]
    );

    console.log("Measurement updated successfully");
    return true;
  } catch (error) {
    console.log("FAILED TO UPDATE MEASUREMENT:", error);
    return false;
  }
}

// DELETE MEASUREMENT
export async function deleteMeasurement(measurementId: number) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `DELETE FROM MEASUREMENTS WHERE MEASUREMENT_ID = ?`,
      [measurementId]
    );

    console.log("DELETE RESULT:", result.rowsAffected);

    return result.rowsAffected > 0;
  } catch (error) {
    console.log("DELETE ERROR:", error);
    return false;
  }
}
