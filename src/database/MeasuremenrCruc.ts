

import databaseConnection from './DatabaseConnection';

// Add Measurement
export async function addMeasurement(
  customerId: number,
  type: string,
  measurement: any
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `INSERT INTO MEASUREMENTS (
        CUSTOMER_ID, TYPE, CHEST, WAIST, QAMEEZ_LENGTH,
        SHIRT_LENGTH, SHALWAR_LENGTH, TROUSER_LENGTH,
        SLEEVE, DAMAN, HIP, THIGH, BOTTOM, SHOULDER,
        COLLAR, LENGTH, ARMHOLE, NOTES
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        type,
        measurement.Chest ? Number(measurement.Chest) : null,
        measurement.Waist ? Number(measurement.Waist) : null,
        measurement.Qameez_Length ? Number(measurement.Qameez_Length) : null,
        measurement.Shirt_Length ? Number(measurement.Shirt_Length) : null,
        measurement.Shalwar_Length ? Number(measurement.Shalwar_Length) : null,
        measurement.Trouser_Length ? Number(measurement.Trouser_Length) : null,
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

    console.log('Measurement added. ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.log('Failed to add measurement:', error);
    throw error;
  }
}

// Get Measurements by Customer ID
export async function getMeasurements(customerId: number) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      `SELECT *
       FROM MEASUREMENTS
       WHERE CUSTOMER_ID = ?
       ORDER BY MEASUREMENT_ID DESC`,
      [customerId]
    );

    const data = [];

    for (let i = 0; i < result.rows.length; i++) {
      data.push(result.rows.item(i));
    }

    console.log('Measurements data:', data);
    return data;
  } catch (error) {
    console.log('Failed to get measurements:', error);
    throw error;
  }
}


// Get Measurements by Customer ID


// Update Measurement
export async function updateMeasurement(
  measurementId: number,
  measurement: any
) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
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
        measurement.Qameez_Length ? Number(measurement.Qameez_Length) : null,
        measurement.Shirt_Length ? Number(measurement.Shirt_Length) : null,
        measurement.Shalwar_Length ? Number(measurement.Shalwar_Length) : null,
        measurement.Trouser_Length ? Number(measurement.Trouser_Length) : null,
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

    console.log('Measurement updated successfully');
    return result.rowsAffected > 0;
  } catch (error) {
    console.log('Failed to update measurement:', error);
    throw error;
  }
}

// Delete Measurement
export async function deleteMeasurement(measurementId: number) {
  try {
    const db = await databaseConnection;

    const [result] = await db.executeSql(
      'DELETE FROM MEASUREMENTS WHERE MEASUREMENT_ID = ?',
      [measurementId]
    );

    console.log('Measurement deleted successfully');
    return result.rowsAffected > 0;
  } catch (error) {
    console.log('Failed to delete measurement:', error);
    throw error;
  }
}
