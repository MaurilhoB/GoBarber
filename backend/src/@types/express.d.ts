declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    notAllowedFile: boolean;
  }
}
