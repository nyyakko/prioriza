const indexedDB = window.indexedDB;
const connection = indexedDB.open('prioriza_db', 1);

let database: IDBDatabase | null = null;

connection.onsuccess = () => {
    database = connection.result;
    console.log('Successfully connected to the database!');
};

connection.onerror = () => {
    console.error('Could not connect to the database');
};

export { connection, database };
