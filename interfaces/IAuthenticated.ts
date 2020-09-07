export interface IAutheticated extends Request {
  user: {
    id: string;
  };
}
