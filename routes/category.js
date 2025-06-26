const express = require("express");
const router = express.Router();

//import prisma
const prisma = require("../library/prisma");

//get all categeories
router.get("/all", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    if (!categories) {
      return res.status(400).json({
        message: "categories not fetched",
      });
    }

    return res.status(200).json({
      message: "categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
  }
});

//get one category
router.get("/:categoryId", async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
      },
    });

    return res.status(200).json({
      message: "category fetched successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});

//create category
router.post("/create", async (req, res) => {
  const { categoryName, description } = req.body;

  const category = await prisma.category.create({
    data: {
      name: categoryName,
      description: description,
    },
  });
  if (!category) {
    return res.status(400).json({
      message: "category not created",
    });
  }

  return res.status(200).json({
    message: "category created successfully",
  });
});

//delete a category
router.delete("/delete/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  const category = await prisma.category.delete({
    where: {
      id: Number(categoryId),
    },
  });

  if (!category) {
    return res.status(400).json({
      message: "category not deleted",
    });
  }

  return res.status(200).json({
    message: "category deleted successfully",
  });
});

//update a category
router.put("/update", async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;

    const category = await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        name: categoryName,
      },
    });

    if (!category) {
      return res.status(400).json({
        message: "category not updated",
      });
    }

    return res.status(200).json({
      message: "category updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
