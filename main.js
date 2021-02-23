Vue.component('product-details',{
    props: {
        details: {
            type: Array,
            required: true
        } 
    },

    data() {
        return {
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
        }
    },
    template: ` 
    <div class="product-details"> 
    <ul>
    <li v-for="detail in details">{{ detail }}</li>
    </ul>
    </div>
    `
}),

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
  
    <div class="product-image">
    <img v-bind:src="image">
    </div>
    
    <div class="product-info">
    <h1>{{ product }}</h1>
    <p v-if="inventory  > 10">In Stock</p>
    <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
    <p v-else>Out of Stock</p>
    <a v-bind:href="link" target="_blank">More products like this</a>
    <p v-if="inStock">In Stock!</p>
    <p v-else :class="{ outOfStock:inStock }">Out of Stock</p>
    <p>{{ sale }}</p>
    <p>Shipping: {{ shipping }} </p>

    <product-details :details="[ '80% cotton', '20% polyester', 'Gender-neutral' ]"></product-details> 

    <div class="color-box"
        v-for="(variant, index) in variants" 
        :key="variant.variantId"
        :style="{ backgroundColor: variant.variantColor }" 
        @mouseover="updateProduct(index)">
    </div>

    <ul>
        <li v-for="size in sizes">{{ size }}</li>
    </ul>

    <button v-on:click="addToCart" 
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }">
            Add to Cart
            </button>
            <button @click="removeFromCart">Remove from Cart</button>

    
</div>
</div>
    `,
    data() {
        return {
                brand: 'Vue Mastery',
                product: 'Socks',
                selectedVariant: 0,
                link: 'https://www.amazon.com/s?k=socks&ref=nb_sb_noss',
                inventory: 10,
                sizes: ["35","36","37","38"],

                variants: [
                    {
                        variantId: 2234,
                        variantColor: 'green',
                        variantImage: 'vmSocks-green.png',
                        variantQuantity: 10
                    },
                    {
                        variantId: 2235,
                        variantColor: 'blue',
                        variantImage: 'vmSocks-blue.png',
                        variantQuantity: 0
                    }
                ]
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)  
        },

        updateProduct(index) {
            this.selectedVariant = index
        },
        //la funcion metodo removeFromCart estaba mal escrita en camelCase donde cart se encontraba en minuscula
        // removeFromCart != removeFromcart -- es diferente
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        }
    }, 

    computed: {
        tittle() {
            return this.brand + ' ' + this.product
        },
        image() {
            /**
             * la llave del objeto a retornar estaba mal escrita < . varianteImage >
             */
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity 
        },
        sale() {
            if (this.onSale) {
            return this.brand + ' ' + this.product + ' are on sale! '
            }
            return this.brand + ' ' + this.product + ' are not on sale'
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
 
    }

})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart:[] 
    },
methods: {
    updateCart(id) {
        this.cart.push(id)
    },
    removeItem(id) {
        for(var i = this.cart.length - 1; i >= 0; i--) {
            if (this.cart[i] === id) {
                this.cart.splice(i, 1);
            }
        }
    }
}

})



