// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   gig: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Gig', 
//     required: true 
//   }, // Reference to Gig
//   clientId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     required: true, 
//     ref: 'User' // Assuming the client is stored in the 'User' collection
//   }, // Refers to the client making the order
//   packageId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     required: true, 
//     ref: 'Package' // Assuming you have a Package collection
//   }, // Refers to the specific package within the gig
//   price: { 
//     type: Number, 
//     required: true 
//   }, // Price of the package
//   deliveryTime: { 
//     type: String, 
//     required: true 
//   }, // Delivery time of the package
//   features: { 
//     type: [String], 
//     required: true 
//   }, // Features included in the package
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }, // Timestamp for order creation
//   status: { 
//     type: String, 
//     enum: ["Not Complete", "Processing", "Delivered", "Completed"], 
//     default: "Not Complete" // Default status
//   },
//   clientId: { 
//     type: String, 
//     required: true 
//   }, // Client's name (added manually)
//   clientName: { 
//     type: String, 
//     required: true 
//   }, // Client's name (added manually)
//   clientEmail: { 
//     type: String, 
//     required: true 
//   }, // Client's email (added manually)
//   clientImage: { 
//     type: String, 
//     required: true 
//   }, // Client's profile image (added manually)
//    // Delivery data
//    delivery: {
//     description: { 
//       type: String, 
//       required: false 
//     }, // Description for delivery
//     workFiles: [
//       {
//         preview: { 
//           type: String, 
//           required: false 
//         } // Preview URL for work files
//       }
//     ],
//     sourceFiles: [
//       {
//         preview: { 
//           type: String, 
//           required: false 
//         } // Preview URL for source files
//       }
//     ],
//     galleryImages: [
//       {
//         preview: { 
//           type: String, 
//           required: false 
//         } // Preview URL for gallery images
//       }
//     ]
//   }
// });

// module.exports = mongoose.model('GigOrder', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  gig: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: true 
  }, // Reference to Gig
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' // Assuming the client is stored in the 'User' collection
  }, // Refers to the client making the order
  packageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Package' // Assuming you have a Package collection
  }, // Refers to the specific package within the gig
  price: { 
    type: Number, 
    required: true 
  }, // Price of the package
  deliveryTime: { 
    type: String, 
    required: true 
  }, // Delivery time of the package (e.g., "3 days")
  features: { 
    type: [String], 
    required: true 
  }, // Features included in the package
  status: { 
    type: String, 
    enum: ["Not Complete", "Processing", "Delivered", "Completed"], 
    default: "Not Complete" // Default status
  },
  clientId: { 
    type: String, 
    required: true 
  }, // Client's name (added manually)
  clientName: { 
    type: String, 
    required: true 
  }, // Client's name (added manually)
  clientEmail: { 
    type: String, 
    required: true 
  }, // Client's email (added manually)
  clientImage: { 
    type: String, 
    required: true 
  }, // Client's profile image (added manually)
  // Delivery data
  delivery: {
    description: { 
      type: String, 
      required: false 
    }, // Description for delivery
    workFiles: [
      {
        preview: { 
          type: String, 
          required: false 
        } // Preview URL for work files
      }
    ],
    sourceFiles: [
      {
        preview: { 
          type: String, 
          required: false 
        } // Preview URL for source files
      }
    ],
    galleryImages: [
      {
        preview: { 
          type: String, 
          required: false 
        } // Preview URL for gallery images
      }
    ]
  },
  // Delivery date calculated from createdAt + deliveryTime
  deliveryDate: { 
    type: Date,
    required: false
  },
  requirements: [
    {
      _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
      }, // ID from the Gig's requirements
      question: { 
        type: String, 
        required: true 
      }, // Requirement question from the Gig
      type: { 
        type: String, 
        required: true 
      }, // Requirement type (e.g., 'file', 'text')
      choices:{
        type: [String], 
        required: true 
      },
      answer: { 
        type: mongoose.Schema.Types.Mixed, 
        default: null // Initially blank to be updated by the user
      }
    }
  ]
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Mongoose middleware to set the delivery date when creating an order
orderSchema.pre('save', function (next) {
  if (this.isNew && this.deliveryTime) {
    const createdAt = this.createdAt || new Date();
    const deliveryTimeInDays = parseInt(this.deliveryTime.split(" ")[0], 10); // Assume the format is "X days"
    
    if (!isNaN(deliveryTimeInDays)) {
      const deliveryDate = new Date(createdAt);
      deliveryDate.setDate(deliveryDate.getDate() + deliveryTimeInDays); // Add delivery days to createdAt
      this.deliveryDate = deliveryDate;
    }
  }
  next();
});

module.exports = mongoose.model('GigOrder', orderSchema);
