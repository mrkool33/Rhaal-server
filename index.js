//npm install react-native-dotenv
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./Models/User.js";
import crypto from "crypto";
import { createRequire } from "module";
import OtpModel from "./Models/otp.js";
const require = createRequire(import.meta.url);
const sendMail = require("./utils/sendMail.cjs");
import bcrypt from "bcrypt";
import LocationsModel from "./Models/locations.js";
import { error } from "console";
import ItemsModel from "./Models/items.js";

let app = express();
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(500).json({ massege: "User Not Found..." });
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match)
        return res.status(200).json({ user: user, message: "Seccess" });
      else return res.status(401).send({ massege: "Invalid Credentials " });
    }
  } catch (error) {
    return res.status(500).json({ massege: error });
  }
});
app.post("/logout", async (req, res) => {
  try {
    //clareing the seesion

    return res.send("logout secceful..");
  } catch (error) {
    return res.status(500).json({ massege: error });
  }
});

app.post("/inserUser", async (req, res) => {
  try {
    // checking thr user on DB
    const user = await UserModel.findOne({ email: req.body.email });
    const phone = await UserModel.findOne({ phone: req.body.phone });
    if (user) {
      res.status(400).send("use another email");
    } else if (phone) {
      res.status(400).send("change phone number");
    } else {
      const match = await bcrypt.hash(req.body.password, 10);

      //seve user
      const newuser = new UserModel({
        ufname: req.body.ufname,
        ulname: req.body.ulname,
        password: match,
        email: req.body.email,
        phone: req.body.phone,
      });
      await newuser.save();
      res.send("User Added..");
    }
  } catch (error) {}
});

app.post("/sendVerification", async (req, res) => {
  try {
    const { email } = req.body;
    //if the user is not on DB
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //  **************if one otp for user on DB condation***************
    /**
        const userOtp = await OtpModel.findOne({ email: email });
        if(userOtp){
            return res.status(200).json({ success: true,user:user, message: "user have pinding Otp " });}
        */
    else {
      // create the verification code
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate code

      // Send the email
      const emailResult = await sendMail({
        email,
        subject: "OTP for reset password",
        template: "resetingPassword.ejs",
        data: { user: user.email, activationCode: otp },
      });

      if (emailResult.success) {
        //testing
        //console.log(`Verification code for ${user.email}: ${otp}`);

        //save the Otp
        const otpnew = new OtpModel({
          otpNumber: otp,
          email: email,
          otpType: "reset password",
          expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Current time + 2 min
        });

        await otpnew.save();
        return res
          .status(200)
          .json({ success: true, user: user, message: "Seccess send" });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      }
    }
  } catch (error) {
    console.error("Error in sendVerification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otpNumber } = req.body;

    console.log(email, " ", otpNumber);

    const otpRecord = await OtpModel.findOne({
      email: email,
      otpNumber: otpNumber,
    });
    const user = await UserModel.findOne({ email: email });
    if (!otpRecord) {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    if (otpRecord.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    return res.status(200).json({
      success: true,
      user: user,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
app.put("/setNewPass", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found..." });
    }
    const match = await bcrypt.hash(req.body.password, 10);
    user.password = match;
    await user.save();
    return res.status(200).json({ message: "password changed seccessfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/inserLocation", async (req, res) => {
  //console.log(req.body);

  try {
    // checking thr user on DB
    const local = new LocationsModel({
      url: req.body.url,
      discrypter: req.body.discrypter,
      lat: req.body.lat,
      lng: req.body.lng,
      city: req.body.city,
      state: req.body.state,
      category: req.body.category,
      rating: req.body.rating,
    });
    await local.save();
    res.send("location Added..");
  } catch (error) {}
});
app.get("/GetLocation", async (req, res) => {
  try {
    // Fetch all locations from the database
    const locations = await LocationsModel.find();

    // Send the locations in the response
    res.status(200).json({ location: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);

    // Send error response
    res
      .status(500)
      .json({ error: "An error occurred while fetching locations." });
  }
});
app.delete("/deleteLocation/:locationID", async (req, res) => {
  try {
    const locationID = req.params.locationID;
    const delLocation = await LocationsModel.findOneAndDelete({
      _id: locationID,
    });
    if (delLocation) {
      res.status(200).send({ massege: "user deleted.." });
    } else {
      res.status(401).send({ massege: "user not deleted.." });
    }
  } catch (error) {}
});
app.put("/updateLocation", async (req, res) => {
  try {
    const locationID = req.body.locationID;
    const url = req.body.url;
    const discrypter = req.body.discrypter;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const city = req.body.city;
    const state = req.body.state;
    const category = req.body.category;
    const rating = req.body.rating;
    const location = await UserModel.findOne({ _id: locationID });
    location.ufname = ufname;
    location.ulname = ulname;
    await location.save();
    res.send({ location: location, massege: "location update.." });
  } catch (error) {
    return res.status(500).json({ massege: error });
  }
});
app.get("/GetItem", async (req, res) => {
  try {
    // Fetch all item from the database
    const item = await ItemsModel.find();

    // Send the item in the response
    res.status(200).json({ Item: item });
  } catch (error) {
    console.error("Error fetching locations:", error);

    // Send error response
    res
      .status(500)
      .json({ error: "An error occurred while fetching locations." });
  }
});
app.post("/addItems", async (req, res) => {
  try {
    const item = new ItemsModel({
      url: req.body.url,
      Iname: req.body.Iname,
      price: req.body.price,
      description: req.body.description,
    });
    await item.save();
    res.send("item Added..");
  } catch (error) {}
});
app.delete("/deleteItem/:ItemID", async (req, res) => {
  try {
    const ItemID = req.params.ItemID;
    const delItem = await ItemsModel.findOneAndDelete({
      _id: ItemID,
    });
    if (delItem) {
      res.status(200).send({ massege: "user deleted.." });
    } else {
      res.status(401).send({ massege: "user not deleted.." });
    }
  } catch (error) {}
});
app.delete("/deleteUser/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const delUser = await UserModel.findOneAndDelete({ _id: userID });
    if (delUser) {
      res.status(200).send({ massege: "user deleted.." });
    } else {
      res.status(401).send({ massege: "user not deleted.." });
    }
  } catch (error) {}
});
app.put("/updateUser", async (req, res) => {
  try {
    const userID = req.body.userID;
    const ufname = req.body.ufname;
    const ulname = req.body.ulname;
    //const email = req.body.email;
    //const phone = req.body.phone;
    const user = await UserModel.findOne({ _id: userID });
    user.ufname = ufname;
    user.ulname = ulname;
    await user.save();
    res.send({ user: user, massege: "user update.." });
  } catch (error) {
    return res.status(500).json({ massege: error });
  }
});

const db =
  "mongodb+srv://mangomanutas:mangoman1234@cluster0.271ea.mongodb.net/rahaal?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(db);

app.listen(8080, () => {
  console.log("Server Connected...");
});
