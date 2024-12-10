import mongoose from "mongoose";

const UserSchema =mongoose.Schema({
    ufname:{type:String,required:true},
    ulname:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    role:{type:String,enum:['admin','user'],default:"user"},
    profileImg:{type:String,default:""}
});

const UserModel=mongoose.model("Users",UserSchema,"Users");
export default UserModel;