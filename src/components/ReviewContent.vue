<script setup>
import axios from 'axios';
import { defineProps, ref, createVNode, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const props = defineProps(['detail']);

const detail = props.detail;

const book = ref({});
const rate = ref(0);
const comment = ref('');

onMounted(async () =>
{
    const response = await axios.get(`book/${detail.book_id}`);
    book.value = response.data;
})

const handleReview = async () =>
{
    Modal.confirm(
        {
            title: 'Đánh giá',
            icon: createVNode(ExclamationCircleOutlined),
            content: `Bạn có chắc muốn đánh giá quyển sách này ${rate.value} sao hay không?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.post('review/add_review', {
                    'book_id': detail.book_id,
                    'rating': rate.value,
                    'comment': comment.value
                });

                message.success(
                    'Đánh giá sách thành công!',
                    3,
                );

                location.reload();
            },
        });
}
</script>

<template>
    <main>
        <div class="content-container">
            <h4 style="font-weight: bold;">{{ book.title }}</h4>
            <a-rate style="margin-bottom: 5px;" v-model:value="rate" />
            <a-textarea v-model:value="comment" show-count :maxlength="5000" :auto-size="{ minRows: 5, maxRows: 5 }" />
            <a-button type="primary" @click="handleReview">Đánh giá</a-button>
        </div>
    </main>
</template>

<style scoped>
main
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.content-container
{
    display: flex;
    flex-direction: column;
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
</style>