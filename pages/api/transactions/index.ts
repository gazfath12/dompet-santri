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
    const result = await db.select().from(transactions).where(eq(transactions.userId, userId));
    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid data' });

    const { title, amount } = parsed.data;
    await db.insert(transactions).values({ title, amount, userId });
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
