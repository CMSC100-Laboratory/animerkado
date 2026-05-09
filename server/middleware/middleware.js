import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")){
  // Check if header exists and has Bearer format
   return res.status(401).send({
      authorized: false,
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];//extract token by removing 'Bearer'

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = {
      id:decoded.id,
      userType: decoded.userType,
    };

    next();
  } catch (err) {
    return res.status(401).send({ 
      authorized: false,
      message: "Unauthorized",
     });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).send({
      authorized: false,
      error: "Unauthorized",
    });
  }
  next();
};

