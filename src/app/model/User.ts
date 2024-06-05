export interface User {
  username: string;
  email?: string;
  id?: string;
  authenticated: boolean;
  game?: string;
  bio?: string;
  image?: string;
  color?: string;
}
