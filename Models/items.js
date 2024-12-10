import mongoose from "mongoose";

const ItemsSchema = mongoose.Schema({
  url: { type: String, required: true },
  Iname: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

const ItemsModel = mongoose.model("Items", ItemsSchema, "Items");
export default ItemsModel;
