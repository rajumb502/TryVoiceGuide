import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AUTH_CONFIG } from '../config/auth';
import { StorageService } from './StorageService';

export class GoogleAuthService {
  private static instance: GoogleAuthService;

  private constructor() {
    this.configure();
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  private configure() {
    GoogleSignin.configure({
      webClientId: AUTH_CONFIG.WEB_CLIENT_ID,
      iosClientId: AUTH_CONFIG.IOS_CLIENT_ID,
      scopes: AUTH_CONFIG.SCOPES,
      offlineAccess: true,
    });
  }

  async signIn(): Promise<boolean> {
    try {
      await GoogleSignin.hasPlayServices();
      const { type, data } = await GoogleSignin.signIn();
      console.log(`[Google signin] type, data: `, type, data);

      if (type === 'success') {
        // Get access token
        const tokens = await GoogleSignin.getTokens();
        
        // Store tokens
        const storage = StorageService.getInstance();
        storage.setItem('gmail_access_token', tokens.accessToken);
        if (tokens.idToken) {
          storage.setItem('gmail_id_token', tokens.idToken);
        }
        
        return true;
      } else {
        // sign in was cancelled by user
        setTimeout(() => {
          console.log('Signin cancelled');
        }, 500);
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      }
    }

    return false;

  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      const storage = StorageService.getInstance();
      storage.removeItem('gmail_access_token');
      storage.removeItem('gmail_id_token');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  async isSignedIn(): Promise<boolean> {
    const user = GoogleSignin.getCurrentUser();
    if (user)
      return true;
    else {
      try {
        await GoogleSignin.signInSilently();
        return this.isSignedIn();
      } catch (e) {
        console.log('Silent sign-in failed:', e);
        throw e;
      }
    }
  }
}

export const googleAuthService = GoogleAuthService.getInstance();