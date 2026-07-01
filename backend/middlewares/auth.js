import jwt from 'jsonwebtoken'

const authUser = async(req, res, next)=>{

    // Prefer the httpOnly cookie set on login; fall back to the
    // Authorization header for non-browser clients (e.g. mobile apps).
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
        return res.status(401).json({success: false, message: "Not Authorized, Login Again"});
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: token_decode.id }
        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, message: error.message})
    }
}

export default authUser;