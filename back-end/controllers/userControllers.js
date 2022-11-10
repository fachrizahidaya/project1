const db = require("../models");
const bcrypt = require("bcrypt");
const user = db.User;
const item = db.Item;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const transporter = require("../helpers/transporter");
const handlebars = require("handlebars");

module.exports = {
  register: async (req, res) => {
    try {
      console.log(req.body);
      const { username, email, phoneNumber, password, confirmPassword } =
        req.body;
      if (password !== confirmPassword) throw "Wrong password";
      if (password.length < 8) throw "Minimum 8 characters";
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
      const data = await user.create({
        username,
        email,
        phoneNumber,
        password: hashPass,
      });
      const token = jwt.sign({ id: data.id }, "riza", { expiresIn: 30 });
      const tempEmail = fs.readFileSync("./template/email.html", "utf-8");
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        username,
        link: `http://localhost:3000/verification/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verify Account",
        html: tempResult,
      });
      res.status(200).send("Register Success");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  login: async (req, res) => {
    try {
      const { data, password } = req.body;
      const isAccountExist = await user.findOne({
        where: {
          [Op.or]: {
            email: data ? data : "",
            username: data ? data : "",
          },
        },
        raw: true,
      });
      console.log(isAccountExist);
      if (isAccountExist.loginAttempt >= 3) {
        await user.update(
          {
            isSuspend: true,
          },
          {
            where: {
              id: isAccountExist.id,
            },
          }
        );
        throw `Account suspended beacuse too many attempt`;
      } else {
        await user.update(
          {
            loginAttempt: 0,
          },
          {
            where: {
              id: isAccountExist.id,
            },
          }
        );
      }
      if (!isAccountExist) throw "User not found";
      const isValid = await bcrypt.compare(password, isAccountExist.password);
      if (!isValid) {
        await user.update(
          {
            loginAttempt: isAccountExist.loginAttempt + 1,
          },
          {
            where: {
              id: isAccountExist.id,
            },
          }
        );
        throw `You entered wrong password, ${
          isAccountExist.loginAttempt + 1
        } attempts`;
      }
      const token = jwt.sign(
        {
          username: isAccountExist.username,
          id: isAccountExist.id,
        },
        "riza"
      );
      res.status(200).send({
        user: {
          username: isAccountExist.username,
          id: isAccountExist.id,
        },
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  keepLogin: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "riza");
      const result = await user.findAll({
        where: {
          id: verify.id,
        },
      });
      res.status(200).send({
        id: result[0].id,
        username: result[0].username,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  verification: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "riza");
      await user.update(
        {
          isVerified: true,
        },
        {
          where: {
            id: verify.id,
          },
        }
      );
      res.status(200).send("Verification success");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  uploadFile: async (req, res) => {
    try {
      let fileUploaded = req.file;
      await user.update(
        {
          profilePic: fileUploaded.filename,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const getUser = user.findOne({
        where: {
          id: req.params.id,
        },
        raw: true,
      });
      res.status(200).send({
        id: getUser.id,
        username: getUser.username,
        profilePic: getUser.profilePic,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
