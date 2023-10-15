const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.set('strictQuery', false);

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, unique: true },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
