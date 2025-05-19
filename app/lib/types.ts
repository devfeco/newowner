export interface IUser {
  _id?: string;
  fullName?: string;
  name?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  userType?: 'buyer' | 'seller' | 'admin';
  isPremium?: boolean;
  premiumUntil?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: IUser;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: IUser;
  token?: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: IUser; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: IUser; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER_TYPE'; payload: 'buyer' | 'seller' }
  | { type: 'PHONE_VERIFIED'; payload: { phoneNumber: string } }; 