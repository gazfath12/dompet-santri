import { openDB } from 'idb';

const DB_NAME = 'dompet-santri-db';
const STORE_NAME = 'transactions';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
}

export async function saveOfflineTransaction(transaction:any) {
  const db = await getDb();
  await db.add(STORE_NAME, transaction);
}

export async function getAllOfflineTransactions() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function clearOfflineTransactions() {
  const db = await getDb();
  await db.clear(STORE_NAME);
}