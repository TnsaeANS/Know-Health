
"use server";

import { pool } from '@/lib/db';
import type { ContactMessage } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

export async function getMessageCounts(): Promise<{ unread: number; total: number }> {
    if (!pool) {
        return { unread: 0, total: 0 };
    }
    try {
        const result = await pool.query(
            "SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_read = false) as unread FROM messages"
        );
        const { total = '0', unread = '0' } = result.rows[0] || {};
        return {
            total: parseInt(total, 10),
            unread: parseInt(unread, 10),
        };
    } catch (error) {
        console.error('Failed to get message counts:', error);
        return { unread: 0, total: 0 };
    }
}

export async function markMessageAsRead(id: number): Promise<{ success: boolean }> {
  if (!pool) {
    return { success: false };
  }
  try {
    await pool.query('UPDATE messages SET is_read = true WHERE id = $1', [id]);
    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(`Failed to mark message ${id} as read:`, error);
    return { success: false };
  }
}
