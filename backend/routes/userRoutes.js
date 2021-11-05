import express from 'express'
import User from '../models/userModel.js'
import { auth, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET -> Fetch all users - Protected Route) + (admin)
router.get('/', auth, admin, async (req, res) => {
    try {
        let users = await User.find({})

        if (!users) {
            return res.status(401).send({ message: 'Users not Found' })
        }

        res.status(200).send(users)
    } catch (e) {
        res.status(404).send({ message: e })
    }
})

// DELETE -> delete user  (Protected Route) + (admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(401).send({ message: 'User ID is Invalid' })
        }
        await User.findByIdAndDelete(req.params.id)

        res.status(200).send({ message: 'user removed' })
    } catch (error) {
        res.status(404).send({ message: error })
    }
})

// GET -> Fetch User's profile (Protected Route)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(401).send({ message: 'User not Found' })
        }

        res.status(200).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } catch (e) {
        res.status(404).send({ message: 'User Profile not Found' })
    }
})

// GET -> get user by ID -password Protected Route) + (admin)
router.get('/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
            return res.status(401).send({ message: 'User not Found' })
        }

        res.status(200).send(user)
    } catch (e) {
        res.status(404).send({ message: 'User Profile not Found' })
    }
})

// PATCH -> Update User's profile (Protected Route)
router.patch('/profile', auth, async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        return res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: await updatedUser.generateAuthToken(updatedUser._id),
        })
    } else {
        res.status(401).send({ message: 'User not Found' })
    }
})

// UPDATE -> get user by ID and Update Protected Route) + (admin)
router.patch('/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (user) {
            user.name = req.body.name || user.namse
            user.email = req.body.email || user.email
            user.isAdmin = req.body.isAdmin
            const updatedUser = await user.save()

            return res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })
        }

        if (!user) {
            return res.status(401).send({ message: 'User not Found' })
        }
    } catch (e) {
        res.status(401).send({ message: 'User Profile not Found' })
    }
})

// POST -> Authenticate user
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).send({ message: 'User not Found' })
        }

        const myPassword = await user.checkPasswordMatch(password)

        if (!myPassword) {
            return res.status(401).send({ message: 'Wrong password' })
        }

        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.generateAuthToken(user._id)
        })
    } catch (error) {
        res.status(401).send({ message: error })
    }
})

// POST -> Creating a new User
router.post('/create', async (req, res) => {
    const { email } = req.body
    try {
        const userExists = await User.findOne({ email })

        if (userExists || !email) {
            return res.status(401).send({ message: 'Email Invalid' })
        }

        const user = new User(req.body)

        if (!user) {
            return res.status(401).send({ message: 'invalid user creation' })
        }

        await user.save()
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.generateAuthToken(user._id)
        })
    } catch (e) {
        res.status(400).send({ message: 'User creation failed' })
    }

})






export default router