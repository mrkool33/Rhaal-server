import mongoose from "mongoose";

const BookingSchema = mongoose.Schema({
  url: { type: String, required: true },
  Iname: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: {
    type: [String],
    default: [],
  },
  user: {
    type: [String],
    default: [],
  },
});

const BookingsModel = mongoose.model("booking", BookingSchema, "booking");
export default BookingsModel;
