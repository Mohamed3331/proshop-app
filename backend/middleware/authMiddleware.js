import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        if (!token) {
            throw new Error('Not authorized, invalid token')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            throw new Error('invalid user')
        }

        req.user = await User.findById(decoded.id)

        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(401).send({ message: 'You are not an Admin' })
    }
}

