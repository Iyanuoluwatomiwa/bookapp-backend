const express = require("express");
const router = express.Router();
const prisma = require("../library/prisma");

const userSchema = require("../joischema/userSchema");

const argon2 = require("argon2");
const authProtect = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

//create user route
router.post("/register", async (req, res, next) => {
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

    const pwdResult = userSchema.pwdVal.validate(req.body.password);

    if (pwdResult.error) {
      return res.status(400).json({
        message: pwdResult.error.details,
      });
    }

    const { email, password, userName, name } = req.body;

    //check if a user exists
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //return an error if user exists
    if (userExists) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    //check if the userName exists
    if (userName) {
      const userNameExists = await prisma.user.findUnique({
        where: { userName },
      });

      if (userNameExists) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }
    }

    //hash password
    const hashedPassword = await argon2.hash(password);

    //create a new user
    const aUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        userName: userName,
      },
    });

    if (!aUser) {
      return res.status(400).json({
        message: "failed to create user",
      });
    }

    //create a profile
    const aProfile = await prisma.profile.create({
      data: {
        userId: aUser.id,
      },
    });

    if (!aProfile) {
      return res.status(400).json({
        message: `failed to create profile for ${aUser.email}`,
      });
    }

    return res.status(201).json({
      message: "user registered successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getall", [authProtect, authAdmin], async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isAdmin: true,
        profile: {
          select: {
            bio: true,
            userName: true,
          },
        },
        books: {
          select: {
            title: true,
            author: true,
            priceRequest: true,
            description: true,
          },
        },
      },
    });
    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
