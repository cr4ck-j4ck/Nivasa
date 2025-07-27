import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel, { type IUser } from "./Models/UsersModel";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/google/callback",
      scope: ['profile', 'email']  
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await UserModel.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with same email (from regular signup)
        existingUser = await UserModel.findOne({
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
        console.log(profile);
        // Create new user
        const newUser = await UserModel.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          provider: "google"
        });
        console.log(newUser);
        return done(null, profile);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, undefined);
      }
    }
  )
);

// Save user to session
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

// Load user from session
passport.deserializeUser((obj: any, done) => {
  console.log(obj);
  done(null, obj);
});

export default passport;
