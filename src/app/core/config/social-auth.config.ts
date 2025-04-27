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
        // Replace with your actual Google Client ID
        // '627119056518-ia5aubqpqbcll5ap33s1u06c71l2b1c5.apps.googleusercontent.com'
        '760923168206-cah6m56rf4ik411bsc6ib7jj70hd9e7g.apps.googleusercontent.com'

      )
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(
        // Replace with your actual Facebook App ID
        '3182446321911891'
      )
    }
    // Instagram doesn't have a direct provider in this library
    // We'll implement a custom solution for Instagram later
  ]
};
