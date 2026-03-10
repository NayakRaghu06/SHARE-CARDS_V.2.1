import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dbc.db'); 
// SDK 54 supports sync API

export default db;