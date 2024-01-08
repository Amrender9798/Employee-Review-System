import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./user.schema.js";
import Review from "./userReview.schema.js";
export const renderRegisterationForm = async (req, res) => {
  res.render("register", { errors: null });
};
export const renderLoginForm = async (req, res) => {
 
  res.render("login", { loginFailed: null });
};


export const userRegisteration = async (req, res) => {
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  res.redirect('/login');
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { loginFailed: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('login', { loginFailed: 'Invalid email or password' });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin, // Include isAdmin in the token payload
      },
      'secret-key',
      {
        expiresIn: '1h', // You can adjust the expiration time
      }
    );
    res.cookie('token', token, { httpOnly: true });
    if(user.isAdmin){
      res.redirect('/admin/dashboard');
    }
    else{
      res.redirect(`/${user._id}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const userView = async (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const user = await User.findById(userId).populate("reviewsFromOthers").populate("reviewsToOthers");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const recipients = await Promise.all(
      user.reviewsToOthers.map(async (review) => {
        const recipientUser = await User.findById(review.recipient);
        return {
          id: review._id,
          name: recipientUser.name,
          email: recipientUser.email,
        };
      })
    );

    const reviewsWithFeedback = await Promise.all(
      user.reviewsFromOthers
        .filter((review) => review.feedback)
        .map(async (review) => {
          const reviewer = await User.findById(review.reviewer);
          return {
            feedback: review.feedback,
            reviewerName: reviewer ? reviewer.name : 'Unknown Reviewer',
            reviewerEmail : reviewer ? reviewer.email : 'Unknown Email'
          };
        })
    );
    

    // Render your view or send the data as needed
    // res.render('user', { recipients, reviewsWithFeedback });
    // Or send as JSON
    res.render('user',{recipients,reviewsWithFeedback});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const submitFeedback = async(req,res) => {
  try {
    const {reviewId} = req.params;
    const {feedback} = req.body;
    const review = await Review.findById({_id:reviewId});
    review.feedback = feedback.trim();
    await review.save();

    const user = await User.findById({_id:review.reviewer});
    user.reviewsToOthers = user.reviewsToOthers.filter((reviewToOther) => reviewToOther.toString() !== reviewId);
    await user.save();
    res.redirect(`/${review.reviewer}`);
  } catch (error) {
    console.log(error);
    
  }
}

