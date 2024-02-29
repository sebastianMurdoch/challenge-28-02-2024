const fs=require("fs")

class ProductsManager {
    constructor(ruta) {
        this.ruta = ruta
    }

    getProductsFromFile() {
        if (fs.existsSync(this.ruta)) {
            return JSON.parse(fs.readFileSync(this.ruta, 'utf-8'))
        } else {
            return []
        }
    }

    saveProductsToFile(product) {
        fs.writeFileSync(this.ruta, JSON.stringify(product, null, 5))
    }

    getProducts(limit) {
        if (isNaN(limit)) {
            limit = 0;
        }

        let products = this.getProductsFromFile()

        if (limit > 0) {
            products = products.slice(0, limit)
        }

        return products
    }

    getProductById(id) {
        let products = this.getProductsFromFile()

        return products.find(u => u.id == id)
    }

    createProduct(request) {
        let products = this.getProductsFromFile()

        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(d => d.id)) + 1
        }

        let newProduct = {
            id,
            ...request
        }

        if (!newProduct.thumbnails) {
            newProduct.thumbnails = []
        }

        products.push(newProduct)

        this.saveProductsToFile(products)

        return newProduct
    }

    updateProduct(id) {
        let products = this.getProductsFromFile()
        let productIndex = products.findIndex(u => u.id === id)
        if (productIndex === -1) {
            return
        }

        products[productIndex] = {
            ...products[productIndex],
            ...req.body,
            id
        }

        this.saveProductsToFile(products)

        return products[productIndex]
    }

    deleteProduct(id) {
        let products = this.getProductsFromFile()
        let productIndex = products.findIndex(u => u.id === id)
        if (productIndex === -1) {
            return
        }

        let deletedProduct = products[productIndex]
        products.splice(productIndex, 1)

        return deletedProduct
    }

}

module.exports = ProductsManager