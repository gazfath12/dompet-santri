import { db } from '@/src/db';
import { transactions } from '@/src/db/schema';
import { transactionSchema } from '@/utils/zodSchemas';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user: any = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userId = user.userId;

  if (req.method === 'GET') {
    // Ambil seluruh transaksi
    const result = await db.select().from(transactions).where(eq(transactions.userId, userId));

    // Buat summary bulanan
    // summary: [{ month: 'YYYY-MM', type: 'income'|'expense', total: number }]
    const summaryMap: Record<string, { [type: string]: number }> = {};
    for (const tx of result) {
      // Pastikan transactionDate ada
      const date = tx.transactionDate
        ? new Date(tx.transactionDate)
        : new Date();
      const ym = date.toISOString().slice(0, 7); // "YYYY-MM"
      if (!summaryMap[ym]) summaryMap[ym] = { income: 0, expense: 0 };
      if (tx.type && (tx.type === 'income' || tx.type === 'expense')) {
        summaryMap[ym][tx.type] += tx.amount;
      }
    }
    const summary = [];
    for (const [month, val] of Object.entries(summaryMap)) {
      summary.push({ month, type: 'income', total: val.income });
      summary.push({ month, type: 'expense', total: val.expense });
    }

    return res.status(200).json({ transactions: result, summary });
  }

  if (req.method === 'POST') {
    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

    // Di handler API
if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

const { title, amount, type, transactionDate } = parsed.data;
await db.insert(transactions).values({ title, amount, type, transactionDate, userId });
return res.status(200).json({ message: 'Transaction added' });
  }

  if (req.method === 'DELETE') {
    const id = parseInt(Array.isArray(req.query.id) ? req.query.id[0] : req.query.id || '');
    const existing = await db.select().from(transactions).where(eq(transactions.id, id));
    if (!existing.length || existing[0].userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized delete' });
    }
    await db.delete(transactions).where(eq(transactions.id, id));
    return res.status(200).json({ message: 'Deleted' });
  }

  res.status(405).end();
}