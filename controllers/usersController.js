const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const {
  validateRegistration,
  validateLogin,
} = require("../validators/usersValidator");
const usersService = require("../services/usersService");
const User = require("../models/userModel");
const path = require("path");

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
      };

      const createdUser = await User.create(newUser);

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

      await usersService.processAvatar(avatar, avatarFilename);

      user.avatarURL = `/avatars/${avatarFilename}`;
      await user.save();

      res.json({ avatarURL: user.avatarURL });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = usersController;
