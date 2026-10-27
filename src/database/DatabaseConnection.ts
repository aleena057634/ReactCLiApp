
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const databaseConnection = SQLite.openDatabase({
  name: 'TailorDatabase',
  location: 'default',
});

export default databaseConnection;
