<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '../stores/users';
import AuthModal from './AuthModal.vue';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { BarsOutlined, LogoutOutlined, ShoppingOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const { token, user } = storeToRefs(userStore);

const logout = async () =>
{
    message.success('Đăng xuất thành công!', 3);
    router.push(`/`);
    await userStore.handleLogout();
}

const showAllBook = () =>
{
    router.push(`/all-book`);
}

const viewAllOrder = async () =>
{
    await userStore.getUser();

    if (user.value)
    {
        router.push('/order_history')
    }
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
    <div>
        <a-layout-header class="header">
            <div class="nav-container">
                <div class="left-content">
                    <div style="font-size: 20px">
                        <RouterLink to="/">
                            <img src="../assets/ITIS_Logo.svg" alt="ITIS Library Logo" style="width: 75px;">
                            <span class="gradient-text">ITIS Library</span>
                        </RouterLink>
                    </div>
                </div>

                <div class="right-content" v-if="!token">
                    <a-button type="primary" @click.prevent="showAllBook">
                        <BarsOutlined />
                        Tất cả sách
                    </a-button>
                    <AuthModal :isLogin="false" />
                    <AuthModal :isLogin="true" />
                </div>

                <div class="right-content" v-else>
                    <a-button type="primary" @click.prevent="showAllBook">
                        <BarsOutlined />
                        Tất cả sách
                    </a-button>
                    <a-button type="primary" @click="viewAllOrder">
                        <ShoppingOutlined />
                        Đơn hàng
                    </a-button>
                    <a-button type="primary" @click.prevent="logout">
                        <LogoutOutlined />
                        Đăng xuất
                    </a-button>
                </div>
            </div>
        </a-layout-header>
    </div>
</template>

<style scoped>
.nav-container
{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
}

.left-content
{
    display: flex;
    align-items: center;
    justify-content: center;
}

.left-content a
{
    margin-right: 10px;
}

.right-content
{
    display: flex;
    align-items: center;
}

.right-content button
{
    margin-left: 10px;
}


.gradient-text
{
    background-image: linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}
</style>