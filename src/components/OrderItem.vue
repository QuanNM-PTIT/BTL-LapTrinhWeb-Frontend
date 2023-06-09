<script setup>
import { defineProps, ref, createVNode, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import axios from 'axios';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ReviewContent from './ReviewContent.vue'
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { user } = storeToRefs(userStore)
const total_paid = ref(0);
const visible = ref(false);
const router = useRouter();

const props = defineProps(['orderItem', 'user_name']);

const orderItem = props.orderItem;
const order_detail = ref([]);

onMounted(async () =>
{
    await userStore.getUser();
    const response = await axios.get(`order/get_total_paid/${orderItem.id}`);
    total_paid.value = response.data.total_paid;

    await axios.get(`order/get_order_detail/${orderItem.id}`).then((response) =>
    {
        order_detail.value = response.data;
    })

    if (order_detail.value.length == 0 && orderItem.status == 'Đã giao hàng')
    {
        await axios.put('order/change_status', {
            'order_id': orderItem.id,
            'status': 'Đã đánh giá'
        });
    }
})

const handleConfirm = async () =>
{
    Modal.confirm(
        {
            title: 'Xác nhận đã nhận được hàng',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc chắn muốn xác nhận đã nhận được hàng không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.put('order/change_status', {
                    'order_id': orderItem.id,
                    'status': 'Đã giao hàng'
                });

                message.success(
                    'Xác nhận đã nhận được hàng thành công!',
                    3,
                );

                location.reload();
            },
        });
}

const handleDelete = () =>
{
    Modal.confirm(
        {
            title: 'Xác nhận đã hủy đơn hàng',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            okText: 'Xác nhận hủy',
            cancelText: 'Quay lại',
            onOk: async () =>
            {
                await axios.put('order/change_status', {
                    'order_id': orderItem.id,
                    'status': 'Đã hủy'
                });

                message.success(
                    'Hủy đơn hàng thành công!',
                    3,
                );

                location.reload();
            },
        });
}

const handleDelivery = async () =>
{
    Modal.confirm(
        {
            title: 'Xác nhận giao cho đơn vị vận chuyển',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc chắn là đã giao cho đơn vị vận chuyển không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.put('order/change_status', {
                    'order_id': orderItem.id,
                    'status': 'Đang giao hàng'
                });

                message.success(
                    'Cập nhật trạng thái đơn hàng thành công!',
                    3,
                );

                location.reload();
            },
        });
}

const handleOk = () =>
{
    visible.value = false;
}

const handleReview = () =>
{
    visible.value = true;
}

const handleViewOrderDetail = () =>
{
    router.push(`/order/${orderItem.id}`);
}
</script>

<template>
    <div class="cart-item-container" v-if="user">
        <div class="content">
            <div class="book-info">
                <h3>Người đặt hàng: {{ props.user_name }}</h3>
                <h4>Địa chỉ: {{ orderItem.address }}</h4>
                <h4>Số điện thoại: {{ orderItem.phone_number }}</h4>
                <h4>Ngày đặt hàng: {{ orderItem.order_date }}</h4>
                <h4>Trạng thái:
                    <span style="color: rgb(2, 191, 2); font-weight: bold;"
                        v-if="orderItem.status == 'Đang giao hàng'">{{ orderItem.status }}</span>
                    <span style="color: rgb(201, 168, 17); font-weight: bold;"
                        v-if="orderItem.status == 'Chưa xác nhận'">{{ orderItem.status }}</span>
                    <span style="color: rgb(21, 51, 158); font-weight: bold;"
                        v-if="orderItem.status == 'Đã giao hàng'">{{ orderItem.status }}</span>
                    <span style="color: rgb(248, 58, 0); font-weight: bold;"
                        v-if="orderItem.status == 'Đã hủy'">{{ orderItem.status }}</span>
                    <span style="color: rgb(166, 0, 92); font-weight: bold;"
                        v-if="orderItem.status == 'Đã đánh giá'">{{ orderItem.status }}</span>
                </h4>
                <h3 style="color: red; font-weight: bold;">Số tiền thanh toán: {{ total_paid.toLocaleString() }}đ</h3>
            </div>
        </div>

        <div class="buttons">
            <a-button style="width: 150px; margin-bottom: 10px;" type="primary" @click="handleConfirm"
                v-if="orderItem.status == 'Đang giao hàng' && user.role == 'User'">Đã nhận được
                hàng</a-button>
            <a-button style="width: 150px; margin-bottom: 10px;" type="danger" @click="handleDelete"
                v-if="orderItem.status == 'Chưa xác nhận' && user.role == 'User'">Hủy đơn hàng</a-button>
            <a-button style="width: 150px; margin-bottom: 10px;" type="primary" @click="handleReview"
                v-if="orderItem.status == 'Đã giao hàng' && order_detail && user.role == 'User'">Đánh
                giá</a-button>
            <a-button type="primary" @click="handleDelivery"
                v-if="orderItem.status == 'Chưa xác nhận' && user.role == 'Admin'" style="width: 150px; margin-bottom: 10px;">Đã giao hàng</a-button>
            <a-button style="width: 150px;" type="primary" ghost @click="handleViewOrderDetail">Xem đơn hàng</a-button>

            <a-modal v-model:visible="visible" title="Đánh giá" @ok="handleOk">
                <ReviewContent v-for="detail in order_detail" :key="detail.id" :detail="detail" />
            </a-modal>
        </div>
    </div>
</template>

<style scoped>
.cart-item-container
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    width: 90%;
    margin-top: 5px;
    padding: 10px;
    padding-right: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
}

img
{
    width: 75%;
    margin-left: 0px;
}

.book-image
{
    width: 25%;
}

.book-info
{
    margin-left: 0px;
}

.buttons
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
}

.content
{
    display: flex;
    align-items: center;
}</style>