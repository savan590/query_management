const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const jwttoken  = req.header('Authorization')
    // console.log(jwttoken)
    if (!jwttoken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const decoded = jwt.verify(jwttoken, process.env.JWT_SECRET);
      req.user = decoded;
    //   console.log(req.user)
      next();
    } catch (error) {
      console.error(error);
      res.json({ message: 'Invalid token' });
    }
  };

module.exports = authenticate;