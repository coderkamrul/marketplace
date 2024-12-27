// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });

// // Signup function
// exports.signup = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
//     user = new User({ email, password: hashedPassword, verificationCode, role:'user' });
//     await user.save();

//     const mailOptions = { from: process.env.EMAIL_USER, to: email, subject: 'Verify Email', text: `Your code: ${verificationCode}` };
//     transporter.sendMail(mailOptions);

//     res.status(201).json({ message: 'User created. Please verify your email.' });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Verify email function
// exports.verifyEmail = async (req, res) => {
//   try {
//     const { email, verificationCode } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || user.verificationCode !== verificationCode) return res.status(400).json({ message: 'Invalid verification code' });

//     user.isVerified = true;
//     user.verificationCode = undefined;
//     await user.save();

//     const payload = {
//       userId: user._id,
//       role: user.role, // Include the role in the payload
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Email verified successfully', token });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Check email existence
// exports.checkEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const exists = await User.findOne({ email });
//     res.json({ exists: !!exists });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Signin function
// exports.signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !await bcrypt.compare(password, user.password) || !user.isVerified) {
//       return res.status(400).json({ message: 'Invalid credentials or unverified email' });
//     }
//     const payload = {
//       userId: user._id,
//       role: user.role, // Include the role in the payload
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Signed in successfully', token });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Forgot password function
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const token = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000;
//     await user.save();

//     const mailOptions = { from: process.env.EMAIL_USER, to: email, subject: 'Password Reset', text: `Reset link: http://localhost:5173/reset-password/${token}` };
//     transporter.sendMail(mailOptions);
//     res.json({ message: 'Password reset email sent' });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Verify reset token
// exports.verifyResetToken = async (req, res) => {
//   try {
//     const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
//     if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
//     res.json({ message: 'Token is valid' });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
//     if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

//     user.password = await bcrypt.hash(req.body.password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successfully' });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };

// // Google Sign-in
// exports.googleSignin = async (req, res) => {
//   try {
//     const { email, name, picture } = req.body;
//     let user = await User.findOne({ email });
//     if (!user) {
//       const password = crypto.randomBytes(20).toString('hex');
//       user = new User({ email, password: await bcrypt.hash(password, 10), name, picture, isVerified: true, role: 'user' });
//       await user.save();
//     }
// const payload = {
//       userId: user._id,
//       role: user.role, // Include the role in the payload
//     };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, user: { email: user.email, name: user.name, picture: user.picture } });
//   } catch (error) { res.status(500).json({ message: 'Server error' }); }
// };


// // get profile 
// exports.getProfileById = async (req, res) => {
//   const { userId } = req.params; // Get the userId from the request parameters

//   // Check if userId is a valid ObjectId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: 'Invalid user ID format' });
//   }

//   try {
//     // Use findById to get the user by _id
//     const user = await User.findById(userId).select('name email picture role'); // Adjust fields as needed
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // Get all users (admin only)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('name email picture role'); // Adjust fields as needed
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // Get a single user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('name email picture role');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Create a new user (admin only)
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
    
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'user', // Default to 'user' if no role is specified
//       isVerified: true // Assuming admin-created users are automatically verified
//     });

//     await user.save();

//     res.status(201).json({ message: 'User created successfully', user: { name: user.name, email: user.email, role: user.role } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update a user
// exports.updateUser = async (req, res) => {
//   try {
//     const { name, email, role } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update fields
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (role) user.role = role;

//     await user.save();

//     res.json({ message: 'User updated successfully', user: { name: user.name, email: user.email, role: user.role } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Delete a user
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }


//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Search users
// exports.searchUsers = async (req, res) => {
//   try {
//     const { query } = req.query;
//     const users = await User.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } }
//       ]
//     }).select('name email picture role');

//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user = new User({ email, password: hashedPassword, verificationCode, role: 'user', averageRating: 0, totalReviews: 0 });
    await user.save();

    const mailOptions = { from: process.env.EMAIL_USER, to: email, subject: 'Verify Email', text: `Your code: ${verificationCode}` };
    transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== verificationCode) return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const payload = {
      userId: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Email verified successfully', token });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email });
    res.json({ exists: !!exists });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password) || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid credentials or unverified email' });
    }
    const payload = {
      userId: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Signed in successfully', token });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const mailOptions = { from: process.env.EMAIL_USER, to: email, subject: 'Password Reset', text: `Reset link: http://localhost:5173/reset-password/${token}` };
    transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    res.json({ message: 'Token is valid' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.googleSignin = async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const password = crypto.randomBytes(20).toString('hex');
      user = new User({ email, password: await bcrypt.hash(password, 10), name, picture, isVerified: true, role: 'user', averageRating: 0, totalReviews: 0 });
      await user.save();
    }
    const payload = {
      userId: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, name: user.name, picture: user.picture, averageRating:user.averageRating, totalReviews: user.totalReviews} });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.getProfileById = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }
  try {
    const user = await User.findById(userId).select('name email picture role averageRating totalReviews');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email picture role');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email picture role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      isVerified: true,
      averageRating:0,
      totalReviews: 0
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated successfully', user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('name email picture role');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

