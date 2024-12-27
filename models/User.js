
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   isVerified: { type: Boolean, default: false },
//   verificationCode: String,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   picture: { type: String },
//   name: { type: String },
//   role: { 
//     type: String, 
//     enum: ['user', 'admin', 'editor'], 
//     default: 'user' 
//   }, // Defines user roles: 'user', 'admin', or 'editor'
//   permissions: [{ type: String }], // Optional, array of specific permissions (like 'canEdit', 'canDelete', etc.)
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  picture: { type: String },
  name: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'editor'], 
    default: 'user' 
  },
  permissions: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  label: {
    type: String,
    enum: ['level-1', 'level-2', 'Top Label', 'Pro'],
    default: 'level-1'
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateRatingAndReviews = async function() {
  const Gig = mongoose.model('Gig');
  const gigs = await Gig.find({ 'seller.id': this._id });
  
  let totalRating = 0;
  let totalReviews = 0;

  gigs.forEach(gig => {
    totalRating += gig.averageRating * gig.totalReviews;
    totalReviews += gig.totalReviews;
  });

  this.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
  this.totalReviews = totalReviews;

  await this.save();

  await Gig.updateMany(
    { 'seller.id': this._id },
    { 
      $set: { 
        'seller.averageRating': this.averageRating,
        'seller.totalReviews': this.totalReviews
      }
    }
  );
};

module.exports = mongoose.model('User', userSchema);
