const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path"); //used to extract the path of the uploaded file;

//import prisma
const prisma = require("../library/prisma");
const authProtect = require("../middleware/auth");

//Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatar"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Use a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Append extension;
  },
});
const upload = multer({ storage: storage });

// Endpoint for handling file uploads
router.post(
  "/upload",
  [authProtect],
  upload.single("image"), // Specify the field name for the uploaded file and it should be same as key in postman or frontend input in form
  async (req, res, next) => {
    console.log("running");
    console.log(req.file);

    try {
        const { destination, filename } = req.file;
        const profile = await prisma.profile.update({
          where: {
            userId: Number(req.user.sub),
          },
          data: {
            avatar: `${destination}/${filename}`,
          },
        });
         // Store full URL instead of local path
      const profileImage = `${req.protocol}://${req.get("host")}/${
        profile.avatar
        // profile
      }`;
      return res.status(200).json({
        message: "profile fetched successfully",
        profile: {
          profile,
          avatar: profileImage,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//get a user profile
router.get("/", authProtect, async (req, res, next) => {
  try {
    const { sub } = req.user;

    const profile = await prisma.profile.findFirst({
      where: {
        userId: Number(sub),
      },
      select: {
        id: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updateAt: true,
        user: {
          select: {
            name: true,
            email: true,
            userName: true,
            isAdmin: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Store full URL instead of local path
    const profileImage = `${req.protocol}://${req.get("host")}/${
      (profile.avatar)
    }`;

    return res.status(200).json({
      message: "profile fetched successfully",
      profile: {
        ...profile,
        avatar: profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
});

//update user profile
router.put("/update", authProtect, async (req, res, next) => {
  try {
    const { bio } = req.body;

    console.log(req.user.sub);

    const updatedProfile = await prisma.profile.update({
      where: {
        userId: Number(req.user.sub),
      },
      data: {
        bio,
      },
      select: {
        bio: true,
        updateAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!updatedProfile) {
      return res.status(400).json({
        message: "profile not updated",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
