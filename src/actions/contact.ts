
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export type ContactFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  data: FormData
): Promise<ContactFormState> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!pool) {
    return { message: 'Database is not configured. Could not send message.', success: false };
  }

  const formData = Object.fromEntries(data);
  const parsed = contactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid form data',
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const insertQuery = `
      INSERT INTO messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertQuery, [name, email, subject, message]);

    revalidatePath('/admin/messages');
    
    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (error) {
    console.error('Database error on contact form submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  }
}
