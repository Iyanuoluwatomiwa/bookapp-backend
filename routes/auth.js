const express = require("express");
const router = express.Router();
const prisma = require("../library/prisma");
const argon = require("argon2");
const userSchema = require("../joischema/userSchema");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/login", async (req, res, next) => {
  try {
    //user validation of inputs using Joi
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    if (valResult.error) {
      return res.status(400).json({
        message: valResult.error.details,
      });
    }
    const { email, password } = req.body;

    //if user is on the database

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    //if password is correct

    const isPasswordCorrect = await argon.verify(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "password authentication error",
      });
    }

    //create token
    const payLoad = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    // console.log("Signed payload:", payLoad);

    const jwtOption = {
      expiresIn: "1d",
    };

    const token = jwt.sign(payLoad, config.get("jwtSecret"), jwtOption);

    //send token to client
    return res.status(200).json({
      access_token: token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
