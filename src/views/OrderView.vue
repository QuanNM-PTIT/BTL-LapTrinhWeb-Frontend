<script setup>
import { reactive, onMounted, ref, createVNode } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import CartItem from '../components/CartItem.vue';
import axios from 'axios';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const listBook = ref([]);
const total = ref(0);
const route = useRoute();
const orderID = parseInt(route.params.id);
const router = useRouter();

const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const year = currentDate.getFullYear();

const tmp_name = ref('');

const orderDetail = reactive(
    {
        address: '',
        phone_number: '',
        order_date: `${day}/${month}/${year}`,
        status: 'Chưa xác nhận'
    })

onMounted(async () =>
{
    await userStore.getUser();

    if (!orderID)
    {
        await axios.get('cart/get_all_items')
            .then(async (response) =>
            {
                listBook.value = response.data.books;
                if (listBook.value)
                {
                    for (let i = 0; i < listBook.value.length; ++i)
                        total.value += listBook.value[i].price * listBook.value[i].quantity;
                }

                const responseGet = await axios.get(`user/get_user_name/${response.data.books[0].user_id}`);

                tmp_name.value = responseGet.data.user_name;
            });
    }
    else
    {
        await axios.get(`order/get_order/${orderID}`).then(async (response) =>
        {
            orderDetail.address = response.data.address;
            orderDetail.phone_number = response.data.phone_number;
            orderDetail.order_date = response.data.order_date;
            orderDetail.status = response.data.status;

            const responseGet = await axios.get(`user/get_user_name/${response.data.user_id}`);

            tmp_name.value = responseGet.data.user_name;
        });

        await axios.get(`order/get_order_books/${orderID}`)
            .then((response) =>
            {
                listBook.value = response.data;
                if (listBook.value)
                {
                    for (let i = 0; i < listBook.value.length; ++i)
                        total.value += listBook.value[i].price * listBook.value[i].quantity;
                }
            });
    }
})

const validatePhone = (phoneNumber) =>
{
    if (phoneNumber.length !== 10)
    {
        return false;
    }
    if (phoneNumber.charAt(0) !== '0')
    {
        return false;
    }
    const numberPattern = /^\d+$/;
    if (!numberPattern.test(phoneNumber.slice(1)))
    {
        return false;
    }
    return true;
}

const handleOrder = async () =>
{
    Modal.confirm(
        {
            title: 'Xác nhận đặt hàng',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc chắn muốn đặt hàng không?',
            okText: 'Đặt hàng',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                if (validatePhone(orderDetail.phone_number))
                {
                    const books = ref([]);

                    for (let i = 0; i < listBook.value.length; ++i)
                    {
                        books.value.push({
                            'book_id': listBook.value[i].id,
                            'quantity': listBook.value[i].quantity,
                            'price': listBook.value[i].price
                        })
                    }

                    await userStore.getUser();

                    await axios.post('order/new_order', {
                        address: orderDetail.address,
                        phone_number: orderDetail.phone_number,
                        order_date: orderDetail.order_date,
                        status: orderDetail.status,
                        order_details: books.value
                    });

                    message.success(
                        'Đặt hàng thành công!',
                        3,
                    );

                    router.push('/order_history');
                }
                else
                {
                    message.error(
                        'Số điện thoại không hợp lệ!',
                        3,
                    );
                }
            },
        });
}

const handleBack = () =>
{
    router.push('/order_history');
}

const handleBackHome = () =>
{
    router.push('/');
}
</script>

<template>
    <h1 style="text-align: center;font-size: 40px; font-weight: bold; margin-top: 10px;">Đặt hàng</h1>

    <div v-if="user">
        <main v-if="total > 0">
            <div class="order-container">
                <div class="form-content">
                    <a-form :model="orderDetail" style="width: 100%;">
                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Họ và tên" :label-col="{ span: 3 }" name="name">
                                    <a-input v-model:value="tmp_name" disabled />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Địa chỉ" :label-col="{ span: 3 }" name="address"
                                    :rules="[{ required: true, message: 'Hãy nhập địa chỉ!' }]">
                                    <a-input :disabled="orderID" v-model:value="orderDetail.address" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Số điện thoại" :label-col="{ span: 3 }" name="phone_number"
                                    :rules="[{ required: true, message: 'Hãy nhập số điện thoại!' }]">
                                    <a-input :disabled="orderID" v-model:value="orderDetail.phone_number" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Ngày đặt hàng" :label-col="{ span: 3 }" name="orderDate">
                                    <a-input v-model:value="orderDetail.order_date" disabled />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row v-if="orderID">
                            <a-col :span="24">
                                <a-form-item label="Trạng thái" :label-col="{ span: 3 }" name="orderDate">
                                    <h4 style="margin-top: 5px;">
                                        <span style="color: rgb(2, 191, 2); font-weight: bold;"
                                            v-if="orderDetail.status == 'Đang giao hàng'">{{ orderDetail.status }}</span>
                                        <span style="color: rgb(201, 168, 17); font-weight: bold;"
                                            v-if="orderDetail.status == 'Chưa xác nhận'">{{ orderDetail.status }}</span>
                                        <span style="color: rgb(21, 51, 158); font-weight: bold;"
                                            v-if="orderDetail.status == 'Đã giao hàng'">{{ orderDetail.status }}</span>
                                        <span style="color: rgb(248, 58, 0); font-weight: bold;"
                                            v-if="orderDetail.status == 'Đã hủy'">{{ orderDetail.status }}</span>
                                        <span style="color: rgb(166, 0, 92); font-weight: bold;"
                                            v-if="orderDetail.status == 'Đã đánh giá'">{{ orderDetail.status }}</span>
                                    </h4>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
            </div>

            <div class="center-obj" v-if="listBook">
                <h2>Chi tiết đơn hàng:</h2>
                <CartItem v-for="book in listBook" :key="book.id" :book="book" />
            </div>

            <div class="footer-container footer-pos">
                <div class="footer-content">
                    <h2>Tổng số tiền cần thanh toán: <span
                            style="color: red; font-weight: bold;">{{ total.toLocaleString() }}đ</span></h2>
                    <a-button type="primary" v-if="!orderID">
                        <span style="font-weight: bold;" @click="handleOrder">Xác nhận đặt hàng</span>
                    </a-button>
                    <a-button type="primary" v-else>
                        <span style="font-weight: bold;" @click="handleBack">Trở lại</span>
                    </a-button>
                </div>
            </div>
        </main>

        <template v-else>
            <a-result status="404" title="Giỏ hàng hiện tại đang rỗng!"
                sub-title="Hãy thêm gì đó vào giỏ hàng và quay lại sau nhé!">
                <template #extra>
                    <a-button type="primary" @click="handleBackHome">Trang chủ</a-button>
                </template>
            </a-result>
        </template>
    </div>
</template>

<style scoped>
.order-container
{
    display: flex;
    flex-direction: column;
    justify-content: center;
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

main
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.form-content
{
    display: flex;
    flex-direction: column;
    align-items: start;
}

input:disabled
{
    color: black;
}

.center-obj
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

.footer-container
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