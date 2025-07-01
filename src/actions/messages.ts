
"use server";

import { pool } from '@/lib/db';
import type { ContactMessage } from '@/lib/types';

const mapDbRowToMessage = (row: any): ContactMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  subject: row.subject,
  message: row.message,
  created_at: new Date(row.created_at).toISOString(),
  is_read: row.is_read,
});

export async function getMessages(): Promise<ContactMessage[]> {
  if (!pool) {
    console.warn('Database not configured. Cannot fetch messages.');
    return [];
  }

  try {
    const query = 'SELECT * FROM messages ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(mapDbRowToMessage);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    // In a real app, you might want to throw the error
    // to be handled by an error boundary.
    return [];
  }
}
