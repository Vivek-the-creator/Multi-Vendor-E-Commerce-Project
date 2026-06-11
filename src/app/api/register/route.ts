import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser } from '@/lib/mock-store';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['STUDENT', 'FACULTY', 'ADMIN']).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const user = await createUser({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      role: parsed.role ?? 'STUDENT',
    });

    if (!user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Registered successfully', user });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }
}
