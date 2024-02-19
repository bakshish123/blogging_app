const {Schema,model} = require ('mongoose');
const {createHmac,randomBytes}= require('crypto');
const { createUserToken } = require('../service/authentication');

const userSchema =new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:['admim','user'],
        default:'user'
    },
},{timestamps:true})

userSchema.pre('save', function (next){
    const user = this;
    if(!user.isModified('password')) return;

    const salt =randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt)
            .update(user.password)
            .digest('hex');

    this.password=hashedPassword;
    this.salt=salt;

    next();
})

userSchema.static('matchPasswordAndGenerateToken',async function (email,password) {
   const user = await this.findOne({email})
   if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const providedHashedPassword=createHmac('sha256',salt)
            .update(password)
            .digest('hex');
   if(hashedPassword != providedHashedPassword){
        throw new Error("Incorrect Password");
    }
   const token= createUserToken(user);
   return token;
})

const User = model('user',userSchema);
module.exports= User;