const fs = require("fs")

class CartsManager {
    constructor(ruta) {
        this.ruta = ruta
    }

    getCartsFromFile() {
        if (fs.existsSync(this.ruta)) {
            return JSON.parse(fs.readFileSync(this.ruta, 'utf-8'))
        } else {
            return []
        }
    }

    saveCartsToFile(carts) {
        fs.writeFileSync(this.ruta, JSON.stringify(carts, null, 5))
    }

    createCart() {
        let carts = this.getCartsFromFile()

        let id = 1
        if (carts.length > 0) {
            id = Math.max(...carts.map(d => d.id)) + 1
        }

        let newCart = {
            id,
            products: []
        }

        carts.push(newCart)

        this.saveCartsToFile(carts)

        return newCart
    }

    getCartById(id) {
        let carts = this.getCartsFromFile()

        let cart = carts.find(u => u.id == id)

        return cart
    }



}

module.exports = CartsManager