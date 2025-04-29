import { 
  SocialAuthServiceConfig, 
  GoogleLoginProvider, 
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

/**
 * Social authentication configuration
 * You need to replace these with your actual client IDs and secrets
 */
export const socialAuthServiceConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '760923168206-cah6m56rf4ik411bsc6ib7jj70hd9e7g.apps.googleusercontent.com',
        {
          // This is crucial for Google Sign-In to work properly
          oneTapEnabled: false, // Disable One Tap for more reliable login
          scopes: 'email profile', // Request only these scopes
          prompt: 'select_account' // Always show account selection
          // Note: You need to configure redirect URIs in Google Cloud Console
          // Add http://localhost:4200 to your authorized redirect URIs
        }
      )
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(
        '3182446321911891',
        {
          scope: 'email,public_profile',
          locale: 'en_US',
          fields: 'name,email,picture,first_name,last_name',
          version: 'v18.0',
          // This helps with development environment (still requires proper setup)
          auth_type: 'rerequest'
        }
      )
    }
  ]
};
