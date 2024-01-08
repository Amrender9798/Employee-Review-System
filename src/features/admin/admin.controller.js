import mongoose from "mongoose";
import User from "../user/user.schema.js";
import Review from "../user/userReview.schema.js";
import bcrypt from 'bcrypt';

export const renderAdminView = async (req, res) => {
  const employees = await User.find({isAdmin:false});
  res.render("admin", { employees });
};

export const reviewForm = async (req, res) => {
  const reviewer = req.params.id;
  const { recipient } = req.body;
  try {
    // Create a new review
    const review = new Review({
      reviewer,
      recipient,
      // Add any other review data you want to save
    });

    // Save the review
    await review.save();

    // Update the employee's reviewsToOthers array
    await User.findByIdAndUpdate(
      reviewer,
      { $push: { reviewsToOthers: review._id } },
      { new: true }
    );

    // Update the recipient employee's reviewsFromOthers array
    await User.findByIdAndUpdate(
      recipient,
      { $push: { reviewsFromOthers: review._id } },
      { new: true }
    );

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.redirect("/admin/dashboard"); // Redirect to the admin page after successful update
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await User.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.redirect("/admin/dashboard"); // Redirect to the admin page after successful delete
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signOut = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

export const addEmployee = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    password = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const grantAdminAccess = async(req,res) => {
  const user = await User.findById({_id:req.params.id});
  user.isAdmin = true;
  await user.save();
  res.redirect("/admin/dashboard");
}