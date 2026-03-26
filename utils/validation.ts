import { ZodSchema, z } from 'zod';

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

export const validateUsername = (username: string, minLength: number = 3): boolean => {
  return username.length >= minLength && /^[a-zA-Z0-9_-]+$/.test(username);
};

export const createValidator = <T,>(schema: ZodSchema) => {
  return {
    validate: (data: unknown): { success: boolean; errors?: Record<string, string> } => {
      const result = schema.safeParse(data);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          errors[err.path.join('.')] = err.message;
        });
        return { success: false, errors };
      }
      return { success: true };
    },
  };
};
