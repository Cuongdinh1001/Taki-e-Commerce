const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const userSchema = new Schema({
  _id: { type: ObjectId },
  userFullName: { type: String, required: true, maxlength: 100 },
  typeAccount: { type: String, require: true },
  dateRegistration: { type: Date, require: true },
  userName: { type: String, required: true, maxlength: 50 },
  userPassword: { type: String, required: true }
});

userSchema.statics.getUser = async function (userId) {
  return await this.findOne(ObjectId(userId), { __v: 0, userPassword: 0 });
}

userSchema.statics.createUser = async function (user) {
  try {
    let { userFullName, userName, userPassword } = user;
    let result = await this.create({
      _id: new ObjectId(),
      userFullName: userFullName,
      typeAccount: 'Dong',
      dateRegistration: Date.now(),
      userName: userName,
      userPassword: crypto.createHash('sha1').update(userPassword).digest('hex')
    });
    delete result._doc.userPassword;
    delete result._doc.__v;
    return result;
  } catch (error) {
    console.log("Error in User: createUser() - " + error);
  }
}

const userModel = mongoose.model('User Model', userSchema, 'Users');

module.exports = userModel;