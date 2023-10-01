import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import fetch from "node-fetch";
import GitHubStrategy from "passport-github2";
import { UserModel } from "../DAO/mongo/models/users.api.model.js";
import { CartsService } from "../services/carts.api.service.js";

const LocalStrategy = local.Strategy;
export function initPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            req.logger.error(
              "No se ha encontrado el usuario con el email: ",
              username
            );
            return done(
              null,
              false,
              req.flash("loginError", "Email o contraseña incorrecta")
            );
          }
          if (!isValidPassword(password, user.password)) {
            req.logger.error("Contraseña incorrecta");
            return done(
              null,
              false,
              req.flash("loginError", "Email o contraseña incorrecta")
            );
          }
          const newConnectionDate = new Date();
          UserModel.findOneAndUpdate(
            { email: username }, 
            { last_connection: newConnectionDate }, 
            { new: true } 
          )
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            req.logger.info("Ya existe este usuario con este email");
            return done(
              null,
              false,
              req.flash(
                "registerError",
                "Ya existe un usuario usando ese email"
              )
            );
          }
          const newCart = await CartsService.createCart();

          const newUser = {
            email,
            firstName,
            lastName,
            rol: "user",
            password: createHash(password),
            cartId: newCart._id,
            last_connection: new Date()
          };

          let userCreated = await UserModel.create(newUser);
          return done(null, userCreated);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.53d91a5181d2d210",
        clientSecret: "603c31565ad123f1acd718a01b9d22b37184e08b",
        callbackURL: "http://localhost:8080/githubcallback",
        passReqToCallback: true,
      },
      async (req, accesToken, _, profile, done) => {

        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("cannot get a valid email for this user"));
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || "noname",
              lastName: "nolast",
              rol: "user",
              password: createHash(profile.password),
              cartId: await CartsService.createCart(),
            };
            let userCreated = await UserModel.create(newUser);
            return done(null, userCreated);
          } else {
            req.logger.info("User already exists");
            return done(
              null,
              user,
              req.flash("githubError", "Ya existe un usuario usando ese email")
            );
          }
        } catch (e) {
          reqq.logger.error(e)
          return done(e);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
