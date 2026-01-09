import { connection } from './Database';

connection.onupgradeneeded = () => {
    const companies = connection.result?.createObjectStore('companies', { keyPath: 'id', autoIncrement: true });
    companies.createIndex('by_id', 'id');
    companies.createIndex('by_ticker', 'stock.ticker');
};
