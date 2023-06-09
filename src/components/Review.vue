<script setup>
import { useRouter } from 'vue-router';
import { onMounted, defineProps, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const props = defineProps(['review']);

const review = props.review;

</script>

<template>
    <div class="comment-content">
        <a-comment>
            <template #author>
                <a style="font-size: 18px;">{{ review.user }}</a>
                <a-rate style="margin-left: 10px; margin-bottom: 10px;" :value="review.rating" disabled />
            </template>
            <template #avatar>
                <UserOutlined />
            </template>

            <template #content>
                <p style="font-size: 16px;">{{ review.comment }}</p>
            </template>
        </a-comment>
    </div>
</template>

<style scoped>
.comment-content
{
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 2%;
    width: 95%;
}
</style>