const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const {
  validateRegistration,
  validateLogin,
  validateEmail,
} = require("../validators/usersValidator");
const usersService = require("../services/usersService");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

function generateVerificationToken() {
  const token = uuidv4();
  return token;
}

const usersController = {
  signup: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { error } = validateRegistration(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        email,
        password: hashedPassword,
        subscription: "starter",
        avatarURL: gravatar.url(email, {
          protocol: "http",
          s: "250",
          r: "pg",
        }),
        verify: false,
        verificationToken: generateVerificationToken(),
      };

      const createdUser = await User.create(newUser);

      await usersService.sendVerificationLink(
        createdUser.email,
        createdUser.verificationToken
      );

      res.status(201).json({ user: createdUser });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { error } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      user.token = token;
      await user.save();

      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      req.user.token = null;
      await req.user.save();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = req.user;
      res.json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (error) {
      next(error);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { user } = req;
      const avatar = req.file;

      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const avatarFilename = `${user._id}${path.extname(avatar.originalname)}`;
      const avatarDirectory = "./public/avatars";

      if (!fs.existsSync(avatarDirectory)) {
        fs.mkdirSync(avatarDirectory, { recursive: true });
      }

      await usersService.processAvatar(avatar, avatarFilename);

      user.avatarURL = `/avatars/${avatarFilename}`;
      await user.save();

      res.json({ avatarURL: user.avatarURL });
    } catch (error) {
      next(error);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { verificationToken } = req.params;
      console.log(verificationToken);
      const user = await User.findOne({ verificationToken });
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.verify) {
        return res
          .status(400)
          .json({ message: "Verification has already been passed" });
      }

      user.verificationToken = "null";
      user.verify = true;
      await user.save();

      res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  },
  resendVerificationEmail: async (req, res, next) => {
    try {
      const { email } = req.body;

      const { error } = validateEmail(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.verify) {
        return res
          .status(400)
          .json({ message: "Verification has already been passed" });
      }

      const verificationToken = generateVerificationToken();
      user.verificationToken = verificationToken;
      await user.save();

      await usersService.sendVerificationLink(email, verificationToken);

      res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
