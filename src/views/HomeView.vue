<script setup>
import { onMounted, reactive, watch, ref } from 'vue';
import Book from '../components/Book.vue';
import axios from 'axios';
import Cart from "../components/Cart.vue";

const searchText = ref('');
const bookList = ref([]);

const data = reactive(
    {
        books: []
    }
)

onMounted(async () =>
{
    await axios.get('book/')
        .then((response) =>
        {
            data.books = response.data;
            bookList.value = response.data;
        })
        .catch((error) =>
        {
            console.error(error);
        });
})

watch(searchText, () =>
{
    data.books = bookList.value.filter(book => book.title.toLowerCase().includes(searchText.value.toLowerCase()));
})
</script>

<template>
    <div class="search-book">
        <div style="width: 90%;">
            <a-input-search v-model:value="searchText" placeholder="Search..." enter-button/>
        </div>
    </div>
    <main>
        <div class="book-container">
            <Book v-for="book in data.books" :key="book.id" :book="book" />
        </div>
        <Cart />
    </main>
</template>

<style scoped>
.book-container
{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 2%;
    margin-left: 2%;
    padding-left: 3%;
    padding-right: 3%;
}

.search-book
{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: auto;
    margin-top: 20px;
}
</style>