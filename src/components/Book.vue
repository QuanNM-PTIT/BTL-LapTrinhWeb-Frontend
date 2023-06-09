<script setup>
import { useRouter } from 'vue-router';
import { onMounted, defineProps, ref } from 'vue';
import axios from 'axios';

const router = useRouter();

const props = defineProps(['book']);

const book = props.book;

const bookImage = ref('');

const getBookDetail = () =>
{
    router.push(`book/${book.id}`);
}
</script>

<template>
    <a-card hoverable class="card" @click.prevent="getBookDetail">
        <template #cover>
            <img alt="Book" :src="book.image" />
        </template>

        <p class="bookTitle">{{ book.title }}</p>
        <p class="bookAuthor">Tác giả: {{ book.author }}</p>
        <p class="bookPrice">Giá bán: {{ book.price.toLocaleString() }}đ</p>
    </a-card>
</template>

<style scoped>
.card
{
    margin-right: 2%;
    width: 14%;
    border-color: rgb(227, 227, 227);
    border-radius: 3%;
    margin-bottom: 2%;
}

.bookTitle
{
    font-size: 110%;
    font-weight: bold;
    text-align: center;
    margin: 0 0 0;
}

.bookAuthor
{
    font-size: 100%;
    text-align: center;
    margin: 0 0 0;
}

.bookPrice
{
    font-size: 105%;
    text-align: center;
    font-weight: bold;
    margin: 0 0 0;
    color: rgb(255, 95, 95);
}
</style>