import express from 'express';
import { renderLoginForm, renderRegisterationForm, submitFeedback, userLogin, userRegisteration, userView } from './user.controller.js';
import authenticate from '../../middlewares/jwtAuth.js';


const router = express.Router();

router.get('/login',renderLoginForm);
router.get('/',renderRegisterationForm);

router.post('/', userRegisteration);
router.post('/login',userLogin);

router.get('/:userId',authenticate,userView);
router.post('/:reviewId',submitFeedback);



export default router;
