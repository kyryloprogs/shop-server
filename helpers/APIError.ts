class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
  
    
    constructor(name: string, httpCode: number) {
      super(name);
      Object.setPrototypeOf(this, new.target.prototype);
    
      this.name = name;
      this.httpCode = httpCode;
    
      Error.captureStackTrace(this);
    }
   }
   
   //free to extend the BaseError
   class APIError extends BaseError {
    constructor(httpCode = 404, name = "Unhandled Error") {
      super(name, httpCode);
    }
   }
  
   export default APIError;