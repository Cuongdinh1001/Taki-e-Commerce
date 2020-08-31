import { Schema as _Schema, Types, model } from 'mongoose';
import { createHash } from 'crypto';

const Schema = _Schema;
const { ObjectId } = Types;

const userSchema = new Schema({
  _id: { type: ObjectId },
  userFullName: { type: String, required: true, maxlength: 100 },
  typeAccount: { type: String, require: true },
  dateRegistration: { type: Date, require: true },
  userName: { type: String, required: true, maxlength: 50 },
  userPassword: { type: String, required: true }
});

userSchema.statics.getUser = async function (userId) {
  let result = await this.findOne(ObjectId(userId));
  result = result.toObject();
  delete result.userPassword;
  delete result.__v;
  return result;
};

userSchema.statics.createUser = async function (user) {
  try {
    let result = await this.create({
      _id: new ObjectId(),
      userFullName: user.userFullName,
      typeAccount: 'Dong',
      dateRegistration: Date.now(),
      userName: user.userFullName,
      userPassword: createHash('sha1').update(user.userPassword).digest('hex')
    });
    return result;
  } catch (error) {
    console.log(`Error in User: createUser() - ${error}`);
  }
};

const userModel = model('User Model', userSchema, 'Users');

export default userModel;
