export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Session {
  user: User;
  accessToken: string;
}
