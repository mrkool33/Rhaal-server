import mongoose from "mongoose";

const LocationSchema =mongoose.Schema({
    url:{type:String,required:true},
    discrypter:{type:String,required:true},
    lat:{type:Number,required:true},
    lng:{type:Number,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    category:{type:String,required:true},
    rating:{type:Number,required:true},
    createdAt: { type: Date, default: Date.now },
    
});

const LocationsModel=mongoose.model("Locations",LocationSchema,"Locations");
export default LocationsModel;