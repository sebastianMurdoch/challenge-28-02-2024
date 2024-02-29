const path = require('path')
const Router = require('express').Router;
const ProductManager = require('../managers/ProductsManager.js');
const CartsManager = require('../managers/CartsManager.js')

const router = Router()
const rootDir = path.resolve(__dirname, '..');
let productsRoute = path.join(rootDir, 'data', 'products.json')
let cartsRoute = path.join(rootDir, 'data', 'carts.json')
const productsManager = new ProductManager(productsRoute)
const cartsManager = new CartsManager(cartsRoute)

router.post("/", (req, res) => {
    let newCart = cartsManager.createCart()

    res.status(201).json({ newCart })
})

router.get("/:id", (req, res) => {
    let id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ error: "id debe ser numérico" })
    }

    let cart = cartsManager.getCartById(id)
    if (!cart) {
        return res.status(400).json({ error: `No el recurso con id ${id}` })
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ cart });

})

router.post("/:cid/product/:pid", (req, res) => {

    let { cid, pid } = req.params

    let cart = cartsManager.getCartById(cid)
    if (!cart) {
        return res.status(400).json({ error: `No el recurso con id ${cid}` })
    }

    let product = productsManager.getProductById(pid)
    if (!product) {
        return res.status(400).json({ error: `No el recurso con id ${pid}` })
    }

    if (!Array.isArray(cart.products)) {
        return res.status(500).json({ error: `Error no esperado` })
    }

    let productIndex = cart.products.findIndex(u => u.product == pid)
    // si no existe el producto se agrega sino se incrementa la cantidad
    if (productIndex === -1) {
        cart.products.push({
            product: product.id,
            quantity: 1
        })
    } else {
        cart.products[productIndex].quantity++
    }

    cartsManager.saveCartsToFile(cart)

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ cart: cart });

})

module.exports=router




