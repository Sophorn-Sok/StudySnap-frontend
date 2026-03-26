export class CustomError extends Error {
  constructor(public message: string, public code?: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof CustomError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const handleAsyncError = async <T,>(
  promise: Promise<T>
): Promise<[null, T] | [Error]> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as Error];
  }
};
