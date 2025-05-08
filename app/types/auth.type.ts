export interface AuthResponse {
   token: string;
   user: {
      _id: string;
      email: string;
      is_active: boolean;
      is_verified: boolean;
      phone: string;
      role?: string;
      blood_group: string;
      profile_image: string;
   };
}
