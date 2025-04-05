export type AgeGroup = '12-18' | '19-25' | '26-30' | '31-35' | '35+';

export interface User {
  id: string;
  email: string;
  username: string;
  gender: 'female' | 'male';
  country: string;
  phoneNumber?: string;
  ageGroup: AgeGroup;
  profileImage?: string;
  bio?: string;
}

export interface SignupData {
  email: string;
  password: string;
  username: string;
  gender: 'female' | 'male';
  country: string;
  phoneNumber?: string;
  ageGroup: AgeGroup;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: User;
}

export interface ForgotPasswordData {
  email: string;
}