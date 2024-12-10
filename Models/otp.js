import mongoose from "mongoose";

const OtpSchema =mongoose.Schema({
    otpNumber:{type:String,required:true},
    email:{type:String,required:true},
    otpType:{type:String,required:true},
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true},
});
// Add a TTL index
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel=mongoose.model("Otp",OtpSchema,"Otp");
export default OtpModel;