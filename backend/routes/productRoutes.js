import express from 'express'
import Product from '../models/productModel.js'
import { auth, admin } from '../middleware/authMiddleware.js'

const router = express.Router()


// ***** PLEASE NOTE I PUT HERE BOTH THE ROUTE AND CONTROLLER LOGIC IN SAME FILE /ROUTES\

// GET -> Fetch products / by search keyword 
router.get('/', async (req, res) => {
    try {
        const pagSize = 2
        const page = Number(req.query.pageNumber) || 1
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {}

        const count = await Product.count({ ...keyword })
        const products = await Product.find({ ...keyword }).limit(pagSize).skip(pagSize * (page - 1))

        if (!products) {
            return res.status(400).send({ message: 'error happened in products' })
        }

        res.status(200).send({products, page, pages: Math.ceil(count / pagSize)})
    } catch (e) {
        res.status(404).send({ message: e })
    }
})

// POST -> create Product 
router.post('/', auth, admin, async (req, res) => {
    try {
        const { name, price, image, brand, category, countInStock, newReviews, description } = req.body

        const product = new Product({
            name: name || 'sample product',
            price: price || 50,
            user: req.user._id,
            image: image || '/uploads\sample.jpg',
            brand: brand || 'sample brand',
            category: category || 'sample category',
            countInStock: category || 5,
            newReviews: category || 10,
            description: category || 'sample description'
        })

        if (!product) {
            return res.status(400).send({ message: 'error in product creation' })
        }

        const createdProduct = await product.save()

        res.status(201).send(createdProduct)
    } catch (e) {
        res.status(404).send({ message: "validation error" })
    }
})

// GET -> Fetch Product 
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.send({ message: "product not found" })
        }

        res.send(product)
    } catch (e) {
        res.status(404).send({ message: e })
    }
})
// DELETE -> delete Product 
router.delete('/:id', auth, admin, async (req, res) => {
    try {

        if (req.params.id) {
            await Product.findByIdAndDelete(req.params.id)
        }

        res.send({ message: 'Product Removed' })
    } catch (e) {
        console.log(e);
    }
})

// PATCH -> update Product 
router.patch('/:id', auth, admin, async (req, res) => {
    try {
        const { name, price, category, description, image, brand, countInStock } = req.body
        const product = await Product.findById(req.params.id)
        if (product) {
            product.name = name,
                product.price = price,
                product.image = image,
                product.brand = brand,
                product.category = category,
                product.countInStock = countInStock,
                product.description = description
        }

        if (!product) {
            return res.status(404).send({ message: 'error in product update' })
        }

        const updatedProduct = await product.save()

        res.status(201).send(updatedProduct)
    } catch (e) {
        res.status(404).send({ message: e })
    }
})

// POST -> create Review 
router.post('/:id/reviews', auth, async (req, res) => {
    const { rating, comment } = req.body


    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(400).send({ message: "Product not found" })
        }

        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            return res.status(400).send({ message: 'Product already reviewed' })
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating =   // average of reviews
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length

        await product.save()
        res.status(201).send({ message: 'Review added' })
    } catch (error) {
        res.status(404).send({ message: 'Product not found' })
    }
})

export default router