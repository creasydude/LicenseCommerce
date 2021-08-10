import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) return res.status(401).json({ message: "401 Access Denied No Token Found!" });
    try {
        const verifyToken = jwt.verify(token, process.env.AUTH_KEY);
        req.user = verifyToken;
        if (!verifyToken.isAdmin) return res.status(401).json({message: "401 Access Denied You Are Not Admin!"})
        next()
    } catch (err) {
        return res.status(400).json({message: err});
    }

}

export default adminAuth;