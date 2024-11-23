const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://nguyenvanvinh0328vinh:7HRQrINYTN97qaEN@cluster0.d4om3.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Kết nối tới MongoDB thành công");
    app.listen(port, () => {
      console.log("máy chủ đang chạy 8000");
    });
  })
  .catch((err) => {
    console.log("Lỗi! không thể kết nối tới mongoDB", err);
  });

// register
const User = require("./models/user");
const Order = require("./models/order");

const sendVerificationEmail = async (email, verificationToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "nguyenvanvinh0328vinh@gmail.com",
      pass: "nguyenvanvinh",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Xác minh email",
    text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };
  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email xác minh đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi gửi email xác minh:", error);
  }
};
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email đã được đăng ký:", email); // Debugging statement
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("Người dùng mới đã đăng ký:", newUser);

    // Send verification email to the user
    // Use your preferred email service or library to send the email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác minh.",

    });
  } catch (error) {
    console.log("Lỗi trong quá trình đăng ký:", error); // Debugging statement
    res.status(500).json({ message: "Đăng ký không thành công" });
  }
});


app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user witht the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Mã thông báo xác minh không hợp lệ" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email đã được xác minh thành công" });
  } catch (error) {
    res.status(500).json({ message: "Xác minh email không thành công!" });
  }
});
// xác thực token login
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ" });
    }

    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Mật khẩu không hợp lệ" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập không thành công" });
  }
});
//endpoint to store a new address to the backend
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //add the new address to the user's addresses array
    user.addresses.push(address);

    //save the updated user in te backend
    await user.save();

    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error addding address" });
  }
});

//endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
});

//endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId",async(req,res) => {
  try{
    const userId = req.params.userId;

    const orders = await Order.find({user:userId}).populate("user");

    if(!orders || orders.length === 0){
      return res.status(404).json({message:"No orders found for this user"})
    }

    res.status(200).json({ orders });
  } catch(error){
    res.status(500).json({ message: "Error"});
  }
})