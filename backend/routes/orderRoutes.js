import express from 'express'
import Order from '../models/orderModel.js'
import { auth, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST -> Order Info. 
router.post('/', auth, async (req, res) => {
    const newOrder = req.body

    try {
        if (newOrder && newOrder.orderItems.length === 0) {
            return res.status(400).send('No order items')
        }

        const order = new Order({ user: req.user._id, ...newOrder })

        if (!order) {
            return res.status(400).send('Order Failed')
        }

        const createdOrder = await order.save()

        res.status(201).send(createdOrder)

    } catch (error) {
        res.status(401).send({ message: error })
    }
})

// GET -> get All user Orders. 
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })

        if (!orders) {
            return res.status(401).send('No orders found')
        }

        res.status(200).send(orders)

    } catch (e) {
        res.status(401).send(e)
    }
})

// GET -> get All Orders. 
router.get('/orders', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name')

        if (!orders) {
            return res.status(401).send('No orders found')
        }

        res.status(200).send(orders)

    } catch (e) {
        res.status(401).send({ message: e })
    }
})

// GET -> get Order by ID. 
router.get('/:id', auth, async (req, res) => {

    try {
        const order = await Order.findById(req.params.id).populate("user", 'name email')
        if (!order) {
            return res.status(401).send('No order found')
        }

        res.status(200).send(order)

    } catch (e) {
        res.status(401).send({ message: e })
    }
})

// PATCH -> Update Order. 
router.patch('/:id/pay', auth, async (req, res) => {

    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(401).send('No order found')
        }

        order.isPaid = true
        order.paidAt = Date.now()

        const updatedOrder = await order.save()

        res.status(200).send(updatedOrder)

    } catch (e) {
        res.status(401).send({ message: e })
    }
})

// GET -> Update Order. 
router.patch('/:id/deliver', auth, admin, async (req, res) => {

    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(401).send('No order found')
        }

        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.status(200).send(updatedOrder)

    } catch (e) {
        res.status(404).send({ message: e })
    }
})




export default router