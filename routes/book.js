const express = require("express");
const router = express.Router();

//import prisma
const prisma = require("../library/prisma");

//get auth middleware
const authProtect = require("../middleware/auth");

//create a book
router.post("/create", authProtect, async (req, res, next) => {
  try {
    const {
      title,
      description,
      priceRequest,
      author,
      categoryId,
      isbn,
      publisher,
      publicationDate,
    } = req.body;
    const { sub, email } = req.user;

    // console.log("Incoming categoryId:", categoryId);

    //create a book on database
    const book = await prisma.book.create({
      data: {
        title: title,
        description: description,
        priceRequest: priceRequest,
        author: author,
        isbn: isbn,
        publisher: publisher,
        publicationDate: publicationDate,

        category: {
          connect: {
            id: Number(categoryId),
          },
        },
        user: {
          connect: {
            id: Number(sub),
          },
        },
        // categoryId: Number(categoryId),
        // userId: Number(sub),
      },
    });

    //send back response
    return res.status(200).json({
      message: "book created successfully",
      book,
    });
  } catch (error) {
    next(error);
    console.error("Error creating book:", error);
  }
});

//get all books for a user
router.get("/allbooks", authProtect, async (req, res, next) => {
  try {
    const { sub } = req.user;
    const books = await prisma.book.findMany({
      where: {
        userId: Number(sub),
      },
    });

    return res.status(200).json({
      message: "books fetched successfully",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//get one book
router.get("/single/:bookId", authProtect, async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await prisma.book.findFirst({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
      include: {
        category: true,
      },
    });

    if (!book) {
      return res.status(400).json({
        message: "book not found",
      });
    }

    return res.status(200).json({
      message: "book fetched successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
});

//update a book
router.put("/update/:bookId", authProtect, async (req, res, next) => {
  try {
    const {
      title,
      description,
      priceRequest,
      author,
      isbn,
      publisher,
      publicationDate,
    } = req.body;
    const { bookId } = req.params;

    const book = await prisma.book.findFirst({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "book not found",
      });
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
      data: {
        title: title,
        description: description,
        priceRequest: priceRequest,
        author: author,
        isbn: isbn,
        publisher: publisher,
        publicationDate: publicationDate,
      },
    });

    if (!updatedBook) {
      return res.status(400).json({
        message: "book not updated",
      });
    }

    return res.status(200).json({
      message: "book updated successfully",
      updatedBook,
    });
  } catch (error) {
    next(error);
  }
});

//delete a category
router.delete("/delete/:bookId", authProtect, async (req, res, next) => {
  try {
    const { bookId } = req.params;

    //find the book
    const book = await prisma.book.findFirst({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "book not found",
      });
    }

    //delete the book
    const deletedBook = await prisma.book.delete({
      where: {
        id: Number(bookId),
        userId: Number(req.user.sub),
      },
    });

    if (!deletedBook) {
      return res.status(400).json({
        message: "book not deleted",
      });
    }

    return res.status(200).json({
      message: "book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
