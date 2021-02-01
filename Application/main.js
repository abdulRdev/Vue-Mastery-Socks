var eventBus = new Vue()


Vue.component('product-details',
{
    props: {
        details:{ type: Array, 
        required: true }
    },

    template: `
    <ul>
    <li v-for= "deets in details ">{{deets}} </li> 
    </ul>   `
})

Vue.component('product', {
props:{
    premium:
    {
        type: Boolean,
        required: true
    },

},

    template: `  
    <div class="product"> 

    <div class="product-image">
        <img v-bind:src="imagee">
    </div>

    <div class="product-info">
        <h1>{{prodTitle }}</h1>
        <h3>{{isOnSale}}</h3>
        <p v-if="inStock">Is in stock</p>
        <p v-else :class="{lineThrough:!inStock}">Is out of stock</p>
        <p>User is premium: {{premium}} </p>
        <p>Shipping: {{shipping}}</p>

        <product-details :details="details"></product-details>

        <ul>
        <li v-for="descript in details" :key="descript"> {{descript}}</li>
        </ul>
        
        <div v-for="(attribute, index) in types" :key="attribute.Id" v-on:mouseover="updateProduct(index)" class="color-box" :style="{backgroundColor: attribute.colour}">
        </div>
       

        <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton:!inStock}">Add to Cart</button> 
        <button v-on:click="decrementCart">Remove from Cart</button>
</div>
        <product-tabs :reviews="reviews"></product-tabs>

</div>
 `,

 data() { 
    return {        
    brand: 'Vue Mastery',
    product: 'Socks',
    onSale: true,
    num: 0,
 //image: 'green-socks.jpg',
    details: ["80% cotton", "20% polyester", "Extra comfortable","Hand knit"], 
    types: 
    [
        {
            Id: 2750,
            colour: "lightgreen",
            img:"green-socks.jpg",
            quantity: 10
        },

        {
            Id: 2760,
            colour: "blue",
            img:"blue-socks.jpg",
            quantity:0
        }
    ],
    reviews: []
}


},
 
methods: {
        addToCart() {
            this.$emit('add-to-cart', this.types[this.num].Id)

        },

        updateProduct(index){
            this.num = index
           console.log(index)  

        },

        decrementCart: function(){
            this.$emit('remove-from-cart', this.types[this.num].Id)
        },

        removeAll: function(){
            this.cart=0
        },
},

computed: {
    prodTitle() {
        return this.brand +" "+this.product
    },

    isOnSale(){
        if (this.onSale)
            return this.brand + ' ' + this.product + " are on sale!"
        
        else
            return this.brand + ' ' + this.product + " are on sale!"

    },

    shipping(){
        if (this.premium)
        {
            return "Free"
        }
            return "$10.99"
        
    },
    
    imagee: function()           
    {
            return this.types[this.num].img
    },

    inStock: function() {
        return this.types[this.num].quantity
        
        },

       
    },
     mounted()
    {
            eventBus.$on('review-submitted',productReview=>{
                this.reviews.push(productReview)
            })
    }
   


})


Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length>0"> 
    <b>Please correct following errors:</b>

    <ul>
        <li v-for="error in errors">{{error}}</li>
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

<p>Would you recommend this product?</p>
<p>      
    <input type="radio"  id="recommend" v-model="recommend" value="Yes"> 
    <label for="recommend">Yes!</label>

    <input type="radio" id="notRecommend"  v-model="recommend" value="0"> 
    <label for="notRecommend">No</label>

</p>

<p> 
<input type="submit" value="Submit">
</p>

</form>
`, 
    data(){
        return{ name:null,
                review:null,
                rating:null,
                recommend:null,
                errors:[]}
    },

    methods: {

        onSubmit ()
        {   //creating an obj with form data as its attributes
            
            if(this.name && this.review&& this.rating && this.recommend)
            {
                let productReview = 
                {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
               //send up to component
                eventBus.$emit('review-submitted',productReview)

                //reset values after submitted
                this.name=null,
                this.review=null,
                this.rating=null,
                this.recommend=null

            }

            else 
            {
                if(!this.name)
                {this.errors.push("Name is required.")}

                if(!this.review)
                {this.errors.push("Review is required.")}

                if(!this.rating)
                {this.errors.push("Rating is required.")}

                if(this.recommend==null)
                {this.erros.push("Answer recommendation please")}
            }
            
        }
    }

    })


    Vue.component('product-tabs', {
    
        props: {
            reviews: {
                type: Array,
                required: true
            },
            
            details:{ 
                type: Array, 
            required: true }
        },
        
        template: 
        `<div>
            <span class="tab"
            :class="{ activeTab: selectedTab===tab}" 
            v-for="(tab,index) in tabs" 
            :key="index" 
            @click="selectedTab=tab"
            >{{ tab }}</span>
    
            <div v-show="selectedTab==='Reviews'">
            <h2>List of Reviews</h2>
            <p v-if="reviews.length<1">No reviews yet</p>
            <ul>
                <li v-for="review in reviews">
                <p>Name: {{review.name}}</p>
                <p>Review: {{review.review}}</p>
                <p>Rating: {{review.rating}}</p>
                </li>
            </ul>
    
            </div>
            <product-review v-show="selectedTab==='Make a Review'"></product-review>
    
            <div v-show="selectedTab==='Shipping'">
                <p>Shipping is $12</p>
            </div>

            <div v-show="selectedTab==='Details'">
            <p>Some details</p>
                <ul>
                <li v-for= "deets in details ">{{deets}} </li> 
                </ul>   
            </div>


        </div>  

        `,
    
        data(){
            return{
                tabs: ['Reviews','Make a Review','Shipping','Details'],
                selectedTab: 'Reviews'
            }
    
        }
        
    
    })



var app = new Vue ({
    el: '#app',
    data: 
    {
        premium: false,
        cart: []

    },
    methods: {

        updateCart(Id) {
            this.cart.push(Id)
        },
    
    removeCart(Id){
        this.cart.pop(Id)
    }

    }

})

