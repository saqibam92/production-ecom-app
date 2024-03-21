import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const creatCategory = async (req, res) => {
  try {
    const { category } = req.body;
    // validation
    if (!category) {
      return res.status(400).send({
        success: false,
        msg: "Please enter a category",
      });
    }
    await categoryModel.create({ category });
    res.status(201).send({
      success: true,
      message: `${category} category created successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: " error in create category api",
    });
  }
};

// get all cat
export const getAllCat = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    // validation
    if (!categories) {
      return res.status(404).json({
        success: false,
        massage: "No Category Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Categories List",
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: " error in delete category api",
    });
  }
};

// update category
export const updateCatController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "no category found",
      });
    }
    // get new category
    const { updatedCategory } = req.body;
    // update ptoducts category
    const products = await productModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      await productModel.updateOne(
        { _id: products[i]._id },
        { $set: { category: updatedCategory } }
      );
    }
    // update category
    await category.updateOne({ category: updatedCategory });
    res.status(200).send({
      success: true,
      message: "category updated successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    return res.status(500).send({
      success: false,
      message: " error in get all category api",
    });
  }
};

// delete category
export const deletCatController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "no category found",
      });
    }
    // update ptoducts category
    const products = await productModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      await productModel.updateOne(
        { _id: products[i]._id },
        { $set: { category: null } }
      );
    }
    // delete category
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid Id",
      });
    }
    return res.status(500).send({
      success: false,
      message: " error in update category api",
    });
  }
};
