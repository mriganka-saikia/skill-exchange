const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const { userModel } = require("../model/user.model");
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
        },
        async function verify(issuer, profile, done) {
            try {
                const email = profile.emails?.[0]?.value;
                let user = await userModel.findOne({ googleId: profile.id });

                if (!user && email) {
                    user = await userModel.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                }

                if (!user) {
                    user = await userModel.create({
                        fullName: profile.displayName,
                        googleId: profile.id,
                        email,
                        role: ["seeker"],
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = { passport };