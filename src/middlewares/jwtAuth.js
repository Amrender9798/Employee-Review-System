import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  try {
    // Get the token from the request cookies or headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // Check if the token is present
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, 'secret-key');

    // Attach the user information to the request object
    req.user = decodedToken;

    res.locals.email = req.user.email;
    res.locals.isAdmin = req.user.isAdmin;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authenticate;
