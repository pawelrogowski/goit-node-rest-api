const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const User = require("../models/userModel");
const transporter = require("../utils/email/nodemailerSettings");

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
  sendVerificationLink: async (userEmail, userToken) => {
    try {
      const serverUrl = process.env.BASE_URL || "http://localhost:3000";
      const verificationLink = `${serverUrl}/api/users/verify/${userToken}`;

      await User.findOneAndUpdate(
        { email: userEmail },
        { verificationToken: userToken },
        { new: true }
      );

      const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: userEmail,
        subject: "Email Verification",
        html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Verification email sent:", info.messageId, info.envelope);
      return info;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

module.exports = usersService;
