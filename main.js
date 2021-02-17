var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: '/Users/angielamoreno/Documents/proyectos/vmSocks-green.png',
        link: 'https://www.amazon.com/s?k=socks&ref=nb_sb_noss',
        inventory: 10,
        inStock: true,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        sizes: ["35","36","37","38"],

        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: '/Users/angielamoreno/Documents/proyectos/vmSocks-green.png',
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: '/Users/angielamoreno/Documents/proyectos/vmSocks-blue.png',
            }
        ],

        cart: 0
    },
    methods: {
        addToCart() {
            this.cart += 1
        },

        updateProduct(variantImage) {
            this.image = variantImage
        },

        removeFromCart() {
            this.cart -= 1
        }
    }

})



