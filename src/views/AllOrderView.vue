<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import OrderItem from '../components/OrderItem.vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const listOrder = ref([]);
const user_name = ref('');
const canView = ref(false);
const router = useRouter();
const orders = ref([]);

const checked = ref(false);

onMounted(async () =>
{
    await userStore.getUser();

    while (!user);

    if (user.value.role == 'User')
    {
        const response = await axios.get('order/all_order');

        if (response.data.length > 0)
        {
            canView.value = true;
        }

        listOrder.value = response.data;
    }
    else
    {
        const response = await axios.get('order/get_all_order_by_admin');

        if (response.data.length > 0)
        {
            await axios.get(`user/get_user_name/${response.data[0].user_id}`).then((response) =>
            {
                user_name.value = response.data.user_name;
            });
        }

        listOrder.value = response.data;
        orders.value = response.data;
    }
});

watch(checked, () =>
{
    if (checked.value)
        listOrder.value = orders.value.filter(item => item.status == 'Chưa xác nhận');
    else
        listOrder.value = orders.value;
})

const handleBackHome = () =>
{
    router.push('/');
}
</script>

<template>
    <div v-if="user">
        <main v-if="canView || user.role == 'Admin'">
            <h1 style="text-align: center;font-size: 40px; font-weight: bold; margin-top: 10px;">Lịch sử đặt hàng</h1>

            <div class="all-order-container">
                <span>
                    <a-checkbox v-if="user.role == 'Admin'" v-model:checked="checked">Lọc đơn hàng chưa xác nhận</a-checkbox>
                </span>
                <OrderItem v-for="orderItem in listOrder" :key="orderItem.id" :orderItem="orderItem"
                    :user_name="orderItem.user_name" />
            </div>
        </main>

        <template v-else>
            <a-result status="404" title="Bạn không có đơn hàng nào!" sub-title="Hãy đặt hàng và quay lại sau nhé!">
                <template #extra>
                    <a-button type="primary" @click="handleBackHome">Trang chủ</a-button>
                </template>
            </a-result>
        </template>
    </div>
</template>

<style scoped>
main
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.all-order-container
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
</style>