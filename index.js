import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';  
import path from 'path';
import expressEjsLayouts from 'express-ejs-layouts';

import connectDB from './dbconfig.js';
import userRouter from './src/features/user/user.route.js';
import adminRouter from './src/features/admin/admin.route.js';
import authenticate from './src/middlewares/jwtAuth.js';


const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join('views'));  // Specify the correct directory

 
function check(req,res,next){
  res.locals.email = req.user ? req.user.email : null;
  res.locals.isAdmin = req.user ? req.user.isAdmin : null;
  next();
}

app.use(check);
app.use(expressEjsLayouts);  // Specify that you're using express-ejs-layouts



app.use('/',userRouter);
app.use('/admin',authenticate,adminRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
