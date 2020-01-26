Vue.component('cart', {
    data(){
        return {
            imgCart: 'https://placehold.it/100x50',
            cartUrl:'/getBasket.json',
            cartItems:[],
            isVisibleCart: false
        }
    },
    methods:{
        addProduct(product) {
            this.$parent.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === product.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            let prod = Object.assign({ quantity: 1 }, product);
                            this.cartItems.push(prod)
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        remove(item) {
            this.$parent.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1)
                        }
                    }
                })
        },
    },
    mounted(){
        this.$parent.getJson(`${API+this.cartUrl}`)
        .then(data => {
            for(let item of data.contents){
                this.cartItems.push(item);
            };
            console.log(data);
        })
    },
     template: `
    <div>
        <button class="btn btn-cart" type="button" @click="isVisibleCart = !isVisibleCart">Корзина</button>
        <div class="cart-block" v-show="isVisibleCart">
                        <div class="cart-items" v-if="cartItems.length">
                            <cart-item class="cart-item"
                            v-for="item of cartItems"
                            :key=item.id_product
                            :cart-item="item"
                            :img="imgCart"
                            @remove="remove"/>
                        </div>
                        <div class="cart-items" v-else>
                            <h4>Нет данных</h4>
                        </div>
        </div>
    </div>`
});

Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
                <div class="cart-item">
                    <div class="product-bio">
                        <img :src="img" alt="Some image">
                        <div class="product-desc">
                            <p class="product-title">{{cartItem.product_name}}</p>
                            <p class="product-quantity">Количество: {{cartItem.quantity}}</p>
                            <p class="product-single-price">{{cartItem.price}}₽ за единицу</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">{{cartItem.quantity*cartItem.price}}₽</p>
                        <button class="btn del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>`
});