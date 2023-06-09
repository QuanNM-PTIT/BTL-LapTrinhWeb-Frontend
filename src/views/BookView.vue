<script setup>
import axios from 'axios';
import { ref, onMounted, createVNode } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import Review from '../components/Review.vue';
import Cart from "../components/Cart.vue";
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();
const { user } = storeToRefs(userStore)

const route = useRoute();
const bookID = parseInt(route.params.id);

const book = ref(null);
const quantity = ref(1);
const min = ref(1);
const reviews = ref([]);

const increase = () =>
{
    quantity.value++;
};

const decrease = () =>
{
    if (quantity.value > min.value)
    {
        quantity.value--;
    }
};

const getDate = (release_date) =>
{
    const parts = release_date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

onMounted(async () =>
{
    await axios.get(`book/${bookID}`)
        .then((response) =>
        {
            book.value = response.data;
        });

    await axios.get(`review/get_review/${bookID}`)
        .then((response) =>
        {
            reviews.value = response.data;
        })
})

const addToCart = async () =>
{
    Modal.confirm(
        {
            title: 'Thêm vào giỏ hàng',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn thêm quyển sách này vào giỏ hàng?',
            okText: 'Thêm',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                if (quantity.value <= 0)
                {
                    message.error(
                        'Số lượng sách không hợp lệ',
                        3,
                    );
                }
                else
                {
                    await userStore.getUser();

                    if (!user.value)
                    {
                        message.error(
                            'Vui lòng đăng nhập để tiếp tục!',
                            3,
                        );
                    }
                    else
                    {
                        await axios.post('cart/add_cart',
                            {
                                'book_id': bookID,
                                'quantity': quantity.value
                            }
                        ).then((response) =>
                        {
                            message.success(
                                'Thêm thành công!',
                                3,
                            );
                        }).catch((error) =>
                        {

                        });
                    }
                }
            },
        });
}
</script>

<template>
    <main style="padding-bottom: 20px; padding-top: 10px;">
        <div class="container" v-if="book">
            <div class="cover">
                <img alt="Book" :src="book.image" />
            </div>

            <div class="content">
                <div class="detail">
                    <div class="title" v-if="book">
                        <h1 style="font-weight: bold;">{{ book.title }}</h1>
                    </div>
                    <h3>Tác giả: {{ book.author }}.</h3>
                    <h3>Thể loại: {{ book.category }}.</h3>
                    <h3>Ngày phát hành: {{ getDate(book.release_date) }}.</h3>
                    <h3 class="bookPrice">Giá bán: {{ book.price.toLocaleString() }}đ</h3>
                </div>

                <div class="buy">
                    <h3>Số lượng: </h3>
                    <button @click.prevent="decrease">-</button>
                    <input type="number" v-model="quantity" :min="min" :max="max" />
                    <button @click.prevent="increase">+</button>
                </div>

                <div class="add-to-buy">
                    <a-button type="primary" shape="round" @click="addToCart">
                        <template #icon>
                            <ShoppingCartOutlined />
                        </template>
                        Thêm vào giỏ hàng
                    </a-button>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="info" v-if="book">
                <h2>Thông tin sách:</h2>
                <p>{{ book.description }}</p>
                <br>
            </div>
        </div>

        <div class="review-content" v-if="reviews">
            <div class="info">
                <h2>Đánh giá:</h2>
            </div>
            <div class="center-content">
                <Review v-for="review in reviews" :key="review.id" :review="review" />
            </div>
        </div>
    </main>

    <Cart />
</template>

<style scoped>
img
{
    width: 75%;
}

.container
{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    margin-left: 4%;
    margin-right: 4%;
    margin-bottom: 2%;
}

.title
{
    margin-top: 1%;
    font-size: 20px;
    margin-bottom: 1%;
}

.cover
{
    width: 49%;
}

.content
{
    width: 49%;
}

.detail
{
    font-size: 1.3vw;
}

.bookPrice
{
    font-weight: bold;
    margin: 0 0 0;
    color: rgb(255, 95, 95);
}

.buy button
{
    color: black;
    font-weight: bold;
    width: 2.5vw;
    height: 2.5vw;
    background: linear-gradient(to right, #ffffff, #e2e1e1);
    border: 1px solid;
    border-radius: 5px;
}

.buy input
{
    border: solid;
    border-color: black;
    color: black;
    text-align: center;
    width: 7vw;
    margin-left: 1%;
    margin-right: 1%;
    font-weight: bold;
}

.buy
{
    font-size: 1.3vw;
    margin-top: 2%;
}

.add-to-buy
{
    margin-top: 2%;
    color: rgb(254, 254, 254);
}

.add-to-buy button
{
    margin-top: 1%;
    font-weight: bold;
    width: 40%;
    height: 30%;
    font-size: 20px;
}

.info
{
    margin-left: 2%;
    margin-top: 1%;
    color: black;
}

.info p
{
    width: 95%;
    font-size: 20px;
}

.info h2
{
    font-size: 25px;
    font-weight: bold;
}

.review-content
{
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    margin-left: 4%;
    margin-right: 4%;
    margin-bottom: 2%;
    color: black;
}

.center-content
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>