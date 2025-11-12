import passport from 'passport';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/google/callback'
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0].value });
      
      if (!user) {
        user = await User.create({
          email: profile.emails?.[0].value,
          name: profile.displayName,
          role: 'seeker',
          verified: true,
          passwordHash: '',
          companies: [],
          createdAt: new Date(),
          lastSeenAt: new Date()
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile']
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0].value });
      
      if (!user) {
        user = await User.create({
          email: profile.emails?.[0].value,
          name: profile.displayName,
          role: 'seeker',
          verified: true,
          passwordHash: '',
          companies: [],
          createdAt: new Date(),
          lastSeenAt: new Date()
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

export default passport;
