import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utlis/features.js";

// get all products
export const getAllProductsController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await productModel
      .find({
        name: {
          $regex: keyword || "",
          $options: "i",
        },
      })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Get all products successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get all products api",
      error,
    });
  }
};

// get top product
export const getTopProductController = async (req, res) => {
  try {
    const topProducts = await productModel.find().sort({ rating: -1 }).limit(3);

    res.status(200).send({
      success: true,
      message: "get top product Successfully",
      topProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get top products api",
      error,
    });
  }
};

// Get single  product by id
export const getSingleProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    // get product by id
    const product = await productModel.findById(productId);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "No Product Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "product found",
      product,
    });
  } catch (error) {
    console.log(error);
    // CastError || ObjectId
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in get single product api",
      error,
    });
  }
};

// create new product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    // validate data
    // if (!name || !description || !price || !category || !stock) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Please provide all fields",
    //   });
    // }

    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide images",
      });
    }

    const file = getDataUri(req.file);
    const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cloudinaryDB.public_id,
      url: cloudinaryDB.secure_url,
    };

    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    res.status(201).send({
      success: true,
      message: "product created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get single product api",
      error,
    });
  }
};

// update product
export const updateProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    // find product
    const product = await productModel.findById(productId);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    // validate & update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    res.status(200).send({
      success: true,
      message: "product updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in update product api",
      error,
    });
  }
};

// update product image
export const updateProductImageController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "No Product Found" });
    }

    // check file
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No Image found!",
      });
    }

    const file = getDataUri(req.file);
    const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content);
    console.log(cloudinaryDB.public_id);
    const image = {
      public_id: cloudinaryDB.public_id,
      url: cloudinaryDB.secure_url,
    };

    // save
    product.images.push(image);
    await product.save();

    res.status(200).send({
      success: true,
      message: "product image updated",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in update product api",
      error,
    });
  }
};

// delete product image
export const deleteProdImgController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }

    // image id
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "product image not found",
      });
    }
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });

    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "images not found",
      });
    }

    // delete image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    res.status(200).send({
      success: true,
      message: "product image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in update product api",
      error,
    });
  }
};

// delete product
export const deleteProductController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }

    // find and remove image form cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    // remove product form databse
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "product deleted",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in update product api",
      error,
    });
  }
};

// Add product review
export const addReviewController = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    let userId = req.user._id;

    // find product
    const product = await productModel.findById(req.params.id);

    // Check user previous comment & review
    const reviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (reviewed) {
      return res.status(400).send({
        success: false,
        field: "already reviewed",
      });
    }

    const review = {
      user: userId,
      name: req.user.name,
      comment,
      rating,
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
      product.reviews.length;

    // save
    await product.save();

    res.status(200).send({
      success: true,
      message: "review added",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in review comment api",
      error,
    });
  }
};
