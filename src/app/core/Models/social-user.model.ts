/**
 * Model representing a user from social login providers
 */
export interface SocialUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  provider: string;  // 'GOOGLE' or 'FACEBOOK'
  id: string;        // Provider-specific ID
  name?: string;     // Full name
  authToken?: string;
  idToken?: string;  // Used primarily with Google
}
