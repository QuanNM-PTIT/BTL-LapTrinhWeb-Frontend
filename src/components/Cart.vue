<script setup>
import { ShoppingCartOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const router = useRouter();

const viewCart = async () =>
{
    await userStore.getUser();

    if (user.value)
        router.push('/cart');
    else
    {
        message.error(
            'Vui lòng đăng nhập để tiếp tục!',
            3,
        );
    }
}
</script>

<template>
    <main v-if="user">
        <div class="shopping-cart" @click="viewCart" v-if="user.role == 'User'">
            <ShoppingCartOutlined style="font-size: 35px; color: white;" />
        </div>
    </main>
</template>

<style scoped>
.shopping-cart
{
    position: fixed;
    bottom: 30px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0px;
    width: 70px;
    height: 70px;
    border-radius: 50px;
    background-image: linear-gradient(to right, #fc466b, #3f5efb);
    margin-top: 1%;
    border: 5px #000000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 2%;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

.shopping-cart:hover
{
    transform: scale(1.1);
}
</style>