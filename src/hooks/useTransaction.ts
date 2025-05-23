import { useEffect } from 'react';
import { getAllOfflineTransactions, clearOfflineTransactions } from '../../utils/indexedDb';

export function useTransactionSync() {
  useEffect(() => {
    async function syncTransactions() {
      const offlineTxs = await getAllOfflineTransactions();
      if (offlineTxs.length > 0 && navigator.onLine) {
        // Sync ke backend
        for (const tx of offlineTxs) {
          await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tx),
          });
        }
        await clearOfflineTransactions();
      }
    }
    window.addEventListener('online', syncTransactions);
    // Cek saat mount juga
    if (navigator.onLine) syncTransactions();
    return () => window.removeEventListener('online', syncTransactions);
  }, []);
}