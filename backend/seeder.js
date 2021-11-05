import dotenv from 'dotenv'
import connectDB from './config/db.js'

import products from "./data/products.js"
import users from "./data/users.js"

import User from "./models/userModel.js"
import Product from "./models/productModel.js"
import Order from "./models/orderModel.js"

dotenv.config()
connectDB()

const importData = async () => {
    try {
        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return {...product, user: adminUser}
        })

        await Product.insertMany(sampleProducts)
        console.log('data imported');
        process.exit()
    } catch (e) {
        console.log(e);
    }
}

const destoryData = async () => {
    try {
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()
    } catch (e) {
        console.log(e);
    }
}

// importData()
if (process.argv[2] === '-import') {
    importData()
} else if (process.argv[2] === '-destory') {
    destoryData()
} 

console.log('This script for importing/deleting custom fake data for development purposes');