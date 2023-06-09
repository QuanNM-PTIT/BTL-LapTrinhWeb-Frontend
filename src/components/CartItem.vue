<script setup>
import { defineProps, ref, createVNode } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import axios from 'axios';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const { user } = storeToRefs(userStore)

const props = defineProps(['book', 'status']);

const book = props.book;

const quantity = ref(book.quantity);

const new_quantity = ref(quantity.value);

const total = ref(quantity.value * book.price);

const showModal = ref(false);

const canClick = ref(false);

canClick.value = props.status == 'cart';

const handleDelete = async () =>
{
    Modal.confirm(
        {
            title: 'Xóa khỏi giỏ hàng',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn xóa quyển sách này khỏi giỏ hàng không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await userStore.getUser();

                await axios.delete(`cart/remove_item/${book.id}`);

                message.success(
                    'Xóa thành công!',
                    3,
                );
            },
        });
}

const editButton = () =>
{
    showModal.value = true;
}

const handleEdit = async () =>
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
        await axios.put('cart/edit_quantity',{
            book_id: book.id,
            quantity: new_quantity.value
        });

        quantity.value = new_quantity.value;

        message.success(
            'Cập nhật số lượng thành công!',
            3,
        );

        location.reload();

        showModal.value = false;
    }
}

</script>

<template>
    <div class="cart-item-container">
        <div class="content">
            <div class="book-image">
                <img :src="book.image" alt="">
            </div>

            <div class="book-info">
                <h3 style="font-weight: bold;">{{ book.title }}</h3>
                <h4>Tác giả: {{ book.author }}</h4>
                <h4>Thể loại: {{ book.category }}</h4>
                <h4 style="color: red; font-weight: bold;">Đơn giá: {{ book.price.toLocaleString() }}đ</h4>
                <h4>Số lượng: {{ quantity }}</h4>
                <h3 style="color: rgb(6, 125, 0);">Thành tiền: {{ total.toLocaleString() }}đ</h3>
            </div>
        </div>

        <div class="buttons" v-if="canClick">
            <a-button style="width: 100px; margin-bottom: 10px;" type="primary" @click="editButton">Chỉnh sửa</a-button>
            <a-button style="width: 100px" type="danger" @click="handleDelete">Xóa</a-button>
            <a-modal v-model:visible="showModal" title="Chỉnh sửa số lượng" @ok="handleEdit">
                <p>Số lượng:</p>
                <a-input type="number" v-model:value="new_quantity" />
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
}
</style>