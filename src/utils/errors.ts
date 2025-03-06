export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const handleError = (error: Error | AppError): { 
    statusCode: number; 
    message: string; 
    stack?: string;
  } => {
    // Aqui pal manejo de errores
  
    return {
      statusCode: 500,
      message: 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  };