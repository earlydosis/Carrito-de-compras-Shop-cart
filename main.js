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

    <info-tabs :shipping="shipping" :details="details"></info-tabs>

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

            <product-tab :reviews="reviews"></product-tabs>

            <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul> 
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
            </div>
        

    
    
    
</div>

</div>
    `,
    data() {
        return {
                brand: 'Vue Mastery',
                product: 'Poke Socks',
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
                ],
                reviews: []
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
        },

        addReview(productReview) {
            this.reviews.push(productReview)
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
        },
        mounted() {
            eventBus.$on('review-submitted' , productReview => {
                this.reviews.push(productReview)
            })
        }
 
    }

}),


Vue.component('product-review', {
    template: ` 
    <form class="review-form" @submit.prevent="onSubmit">
    
    <p class="error" v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>

    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
    </p>

    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>

    <p>Would you recommend this product?
    <label>
      Yes
      <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    </p>

    <p>
        <input type="submit" value="Submit">
    </p>

    </form>

    `, 
data() {
    return {
        name: null,
        review: null,
        rating: null,
        recommend: null,
        errors: []
    }
},

methods: {
    onSubmit() {
        this.errors = []
        if(this.name && this.review && this.rating && this.recommend) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }

        eventBus.$emit('review-submitted' , productReview)
            this.name = null
            this.review = null
            this.rating = null 
            
        } 
        else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.errors.push("Recommendation required.")
        }
    }
}

})

Vue.component('product-tabs', {

    props: {
        reviews: {
        type: Array,
        required: false
        }
        
    },

    template: `
        <div>
        <ul>
            <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            @click="selectedTab = tab"
            :key="tab">  
            {{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
            <li v-for="(review, index) in reviews" :key="index">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
            </li>
        </ul>
        </div>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews' 
        }
    }
})

Vue.component('info-tabs' , {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div> 

    <ul>
    <span class="tabs"
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs"
            @click="selectedTab = tab"
            :key="tab">
            {{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Shipping'">
            <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>

    </div>
`,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
        }
    }
})

Vue.component('info-tabs' , {
    props: {
        shipping: {
            required: true
        },
    details: {
        type: Array,
        required: true 
    }
    },
    template: `
    <div> 
        <ul>
            <span class="tabs"
            :class="{ activeTab_ selectedTab === tab}"
            v-for="(tab, index) in tabs"
            @click="selectedTab = tab"
            :key="tab"> {{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,

    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
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



