<script setup>
import CartItem from '../components/CartItem.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const listBook = ref([]);
const router = useRouter();
const status = ref('cart');
const total = ref(0);

onMounted(async () =>
{
    await userStore.getUser();

    while (!user);

    await axios.get('cart/get_all_items')
        .then((response) =>
        {
            listBook.value = response.data.books;

            if (listBook)
            {
                for (let i = 0; i < listBook.value.length; ++i)
                    total.value += listBook.value[i].price * listBook.value[i].quantity;
            }
        });
})

const handleOrder = () =>
{
    router.push('/order');
}

const handleBackHome = () =>
{
    router.push('/');
}
</script>

<template>
    <h1 style="text-align: center;font-size: 40px; font-weight: bold; margin-top: 10px;">Giỏ hàng</h1>

    <div v-if="user">
        <div v-if="total > 0">
            <div class="center-obj">
                <div class="container" v-if="listBook">
                    <CartItem v-for="book in listBook" :key="book.id" :book="book" :status="status" />
                </div>

                <div class="container footer-pos">
                    <div class="footer-content">
                        <h2>Tổng số tiền cần thanh toán:
                            <span style="color: red; font-weight: bold;">{{ total.toLocaleString() }}</span>
                        </h2>
                        <a-button type="primary">
                            <span style="font-weight: bold;" @click="handleOrder">Đặt hàng</span>
                        </a-button>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="total <= 0">
            <a-result status="404" title="Giỏ hàng hiện tại đang rỗng!"
                sub-title="Hãy thêm gì đó vào giỏ hàng và quay lại sau nhé!">
                <template #extra>
                    <a-button type="primary" @click.prevent="handleBackHome">Trang chủ</a-button>
                </template>
            </a-result>
        </template>
    </div>
</template>

<style scoped>
.container
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 20px;
    margin-left: 4%;
    margin-right: 4%;
    margin-bottom: 2%;
    width: 85%;
}

.center-obj
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.footer-pos
{
    bottom: 0;
    height: 60px;
    background-color: white;
}

.footer-content
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}
</style>