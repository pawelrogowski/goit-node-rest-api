const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const User = require("../models/userModel");

const usersService = {
  getUserByEmail: (email) => {
    return User.findOne({ email });
  },

  createUser: (userData) => {
    return User.create(userData);
  },

  updateUserToken: (userId, token) => {
    return User.findByIdAndUpdate(userId, { token }, { new: true });
  },

  processAvatar: async (avatarFile, avatarFilename) => {
    const tmpPath = path.join(__dirname, `../tmp/${avatarFilename}`);
    const avatarPath = path.join(
      __dirname,
      `../public/avatars/${avatarFilename}`
    );

    try {
      await Jimp.read(avatarFile.path);
      const avatar = await Jimp.read(avatarFile.path);
      avatar.resize(250, 250);
      await avatar.writeAsync(tmpPath);

      await fs.promises.rename(tmpPath, avatarPath);

      await fs.promises.unlink(avatarFile.path);

      return avatarPath;
    } catch (error) {
      await fs.promises.unlink(avatarFile.path);
      throw error;
    }
  },
};

module.exports = usersService;
