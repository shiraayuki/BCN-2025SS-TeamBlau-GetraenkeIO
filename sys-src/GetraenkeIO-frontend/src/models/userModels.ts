export type UserData = {
  username: string;
  isAdmin: boolean;
  credentials: {
    username: string;
    password: string;
  };
};

export type AuthUserData = {
  userData: UserData | null;
  isAuthenticated: boolean;
};

export type UserLoginData = {
  username: string;
  password: string;
};

export type UserRegisterData = {
  username: string;
  password: string;
};
