/**
 * Utility functions for handling errors in a type-safe way
 */

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Extracts error message from various error types in a type-safe way
 */
export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && 'response' in error) {
    const apiError = error as ApiError;
    if (
      typeof apiError.response === 'object' && 
      apiError.response !== null &&
      'data' in apiError.response && 
      typeof apiError.response.data === 'object' &&
      apiError.response.data !== null && 
      'message' in apiError.response.data &&
      typeof apiError.response.data.message === 'string'
    ) {
      return apiError.response.data.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallbackMessage;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(error: unknown, fallbackMessage: string) {
  return {
    success: false,
    message: getErrorMessage(error, fallbackMessage),
  };
}