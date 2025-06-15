"use server";

import { z } from 'zod';

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

  // Simulate sending email or saving to database
  console.log('Contact form submitted:', parsed.data);
  // In a real app, you would integrate with an email service or database here.

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate potential server error (uncomment to test)
  // if (Math.random() > 0.5) {
  //   return {
  //     message: "Failed to send message due to a server error. Please try again later.",
  //     success: false,
  //   };
  // }

  return {
    message: 'Thank you for your message! We will get back to you soon.',
    success: true,
  };
}
