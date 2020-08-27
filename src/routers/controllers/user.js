import { Router } from 'express';
import userModel from '../../models/Users';

const router = Router();


router.get('/:userId', async(req, res) => {
  let result = await userModel.getUser(req.params.userId);
  delete result._doc._id
  res.status(200).send(result);
});

router.post('/create', async(req, res) => {
  try {
    let user = req.body;
    let result = await userModel.createUser(user);
    const userId = result._id;
    res.status(200).send({
      message: 'User account was created',
      request: {
        url: `${process.env.L_HOST}/user/${userId}`,
        method: 'GET'
      }
    });
  } catch (error) {
    console.log("Error in user: router.post() - " + error);
  }
  
});

export default router;