const GigOrder = require("../models/GigOrder");
const Gig = require("../models/Gig"); // Ensure this points to your Gig model

const User = require("../models/User"); // Assuming you have a User model

exports.createOrder = async (req, res) => {
  try {
    const { gigId, packageId, clientId } = req.body;

    // Validate the gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Validate the package
    const selectedPackage = gig.packages.id(packageId);
    if (!selectedPackage) {
      return res
        .status(404)
        .json({ error: "Package not found in the selected gig" });
    }

    // Fetch client details using clientId
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Extract client details
    const { name, email, picture, _id: clientMongoId } = client;

    // Prepare the order's requirements
    const requirements = gig.requirements.map((req) => ({
      _id: req._id,
      question: req.question,
      type: req.type,
      choices: req.choices,
      answer: null, // Initialize as blank
    }));

    // Create the order
    const order = new GigOrder({
      gig: gigId,
      packageId,
      price: selectedPackage.price,
      deliveryTime: selectedPackage.deliveryTime,
      features: selectedPackage.features,
      status: "Not Complete",
      clientId: clientMongoId, // Add client ID to order
      clientName: name || "User", // Add client name to order
      clientEmail: email, // Add client email to order
      clientImage: picture || "https://cdn0.iconfinder.com/data/icons/man-user-human-profile-avatar-business-person/100/09B-1User-512.png", // Add client image to order
      requirements, // Include requirements
    });

    await order.save();

    // Create a stats entry for the gig
    const statsEntry = {
      date: new Date().toISOString(),
      orders: 1, // Increment order count
    };

    // Update gig stats
    gig.stats.unshift(statsEntry);
    await gig.save();

    res.status(201).json({
      message:
        "Order created successfully with requirements and gig stats updated.",
      order,
      gig,
    });
  } catch (error) {
    console.error("Error creating order and updating stats:", error.message);
    res.status(500).json({ error: "Failed to create order and update stats" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await GigOrder.find()
      .populate("gig", "title images seller") // Populates gig details
      .sort({ createdAt: -1 }); // Orders by creation date (most recent first)

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

//get order by id

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await GigOrder.findById(orderId)
      .populate({
        path: "gig",
        select: "title category subcategory images seller requirements", // Select specific fields from Gig
        populate: {
          path: "seller.id",
          select: "name averageRating totalReviews image", // Populate seller details within gig
        },
      })
      .populate({
        path: "clientId",
        select: "name email image", // Populate client details
      });

    // If packageId is part of the gig (embedded), manually enhance it
    if (order && order.gig && order.gig.packages) {
      // Find the package within the gig's packages array
      const packages = order.gig.packages.find(
        (pkg) => pkg._id.toString() === order.packageId.toString()
      );
      order.packageDetails = packages || {}; // Attach the package details to the order if found
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Function to update the order's status and delivery details
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Get the order ID from the URL params
    const { status, description, workFiles, sourceFiles, galleryImages } =
      req.body; // Destructure data from request body

    // Validate the status
    const validStatuses = [
      "Not Complete",
      "Processing",
      "Delivered",
      "Completed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find the order by ID and update status and delivery
    const order = await GigOrder.findByIdAndUpdate(
      orderId,
      {
        status, // Update status
        delivery: {
          description, // Update delivery description
          workFiles, // Update work files
          sourceFiles, // Update source files
          galleryImages, // Update gallery images
        },
      },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order status and delivery updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status and delivery:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update order status and delivery" });
  }
};

// // Function to update only the order's requirements

exports.updateRequirements = async (req, res) => {
  const { requirements } = req.body;
  const { orderId } = req.params;

  try {
    const order = await GigOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!Array.isArray(order.requirements)) {
      return res
        .status(400)
        .json({ message: "Order requirements not initialized" });
    }

    // Update requirements
    order.requirements.forEach((reqItem) => {
      const updatedReq = requirements.find(
        (r) => r._id === reqItem._id.toString()
      );
      if (updatedReq) {
        reqItem.answer = updatedReq.answer;
      }
    });

    // Update the status to "Processing"
    order.status = "Processing";

    // Save the updated order
    await order.save();

    return res
      .status(200)
      .json({ message: "Requirements and status updated successfully", order });
  } catch (error) {
    console.error("Error updating requirements and status:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update requirements and status", error });
  }
};
