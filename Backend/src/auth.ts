import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./Models/UsersModel";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.GOOGLE_REDIRECT_URI}/auth/google/callback`,
      scope: ['profile', 'email']  
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with same email (from regular signup)
        existingUser = await User.findOne({
          email: profile.emails?.[0]?.value,
        });
        
        if (existingUser) {
          // Link Google account to existing user
          existingUser.googleId = profile.id;
          existingUser.provider = "google";
          existingUser.avatar = profile.photos?.[0]?.value;
          await existingUser.save();
          return done(null, existingUser);
        }
        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          provider: "google"
        });
        return done(null, newUser);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, undefined);
      }
    }
  )
);

