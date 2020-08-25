const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const userSchema = new Schema({
  _id: {type: ObjectId},
  userFullName: {type: String, required: true, maxlength: 100},
  typeAccount: {type: String, require: true},
  dateRegistration: {type: Date, require: true},
  userName: {type: String, required: true, maxlength: 50},
  userPassword: {type: String, required: true}
});

userSchema.statics.getUser = async function(userId) {
  return await this.findOne(ObjectId(userId));
}

userSchema.statics.createUser = async function(user) {
  let { userFullName, userName, userPassword } = user;
  return result = await this.create({
    _id: new ObjectId(),
    userFullName,
    typeAccount: 'Dong',
    dateRegistration: Date.now(),
    userName,
    userPassword
  });
}

const userModel = mongoose.model('User Model', userSchema, 'Users');

module.exports = userModel;