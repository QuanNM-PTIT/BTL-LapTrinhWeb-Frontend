<script setup>
import axios from 'axios'
import { reactive, onMounted, ref, watch, createVNode } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';
import Cart from "../components/Cart.vue";

const userStore = useUserStore();

const router = useRouter();
const isAdmin = ref(false);
const { user } = storeToRefs(userStore);
const bookList = ref([]);

const data = reactive(
    {
        books: [],
    });

const searchText = ref('')

onMounted(async () =>
{
    await axios.get('book/')
        .then(async (response) =>
        {
            console.log(response.data);
            for (let i = 0; i < response.data.length; ++i)
            {
                const responseCount = await axios.get(`book/count_books/${response.data[i].id}`);
                response.data[i].count = responseCount.data.count;
            }
            data.books = response.data;
            bookList.value = response.data;
        })
        .catch((error) =>
        {
            console.error(error);
        });

    await userStore.getUser();

    if (user.value)
        isAdmin.value = user.value.role == "Admin";
});

const getDate = (release_date) =>
{
    const parts = release_date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

watch(searchText, () =>
{
    data.books = bookList.value.filter(book => book.title.toLowerCase().includes(searchText.value.toLowerCase()));
})

const addBook = () =>
{
    router.push(`/edit-book/-1`);
}

const handleView = (id) =>
{
    router.push(`edit-book/${id}`);
}

const handleDelete = async (id) =>
{
    Modal.confirm(
        {
            title: 'Xóa sách',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn xóa quyển sách này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.delete(`book/delete/${id}`)
                message.success(
                    'Xóa sách thành công!',
                    3,
                );
            },
        });
}
</script>

<template>
    <div class="row, center-obj">
        <h1 style="margin-top: 1%;">Danh sách các quyển sách trong thư viện</h1>
    </div>

    <div class="book-list">
        <div class="container" v-if="data.books">
            <div style="margin-bottom: 20px; margin-top: 10px;">
                <a-input-search v-model:value="searchText" placeholder="Search..." enter-button />
            </div>

            <div class="add-book" v-if="isAdmin">
                <a class="btn btn-success col-lg-12 add-book" style="color: white; font-size: 22px;" @click="addBook">Thêm
                    sách mới</a>
            </div>

            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr style="text-align: center;">
                        <th style="text-align: center; vertical-align: middle;">Bìa</th>
                        <th style="text-align: center; vertical-align: middle;">Tiêu đề</th>
                        <th style="text-align: center; vertical-align: middle;">Tác giả</th>
                        <th style="text-align: center; vertical-align: middle;">Thể loại</th>
                        <th style="text-align: center; vertical-align: middle;">Ngày phát hành</th>
                        <th style="text-align: center; vertical-align: middle;">Số trang</th>
                        <th style="text-align: center; vertical-align: middle;">Số lượng đã bán</th>
                        <th style="text-align: center; vertical-align: middle;" v-if="isAdmin">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="book in data.books" :key="book.id" class="body-content">
                        <td>
                            <img :src="book.image" alt="Bìa" class="bookImg">
                        </td>
                        <td style="text-align: center; vertical-align: middle;">{{ book.title }}</td>
                        <td style="text-align: center; vertical-align: middle;">{{ book.author }}</td>
                        <td style="text-align: center; vertical-align: middle;">{{ book.category }}</td>
                        <td style="text-align: center; vertical-align: middle;">{{ getDate(book.release_date) }}</td>
                        <td style="text-align: center; vertical-align: middle;">{{ book.num_pages }}</td>
                        <td style="text-align: center; vertical-align: middle;">{{ book.count }}</td>
                        <td class="actionButton" v-if="isAdmin">
                            <a-button style="margin-right: 4px;" type="primary"
                                @click.prevent="handleView(book.id)">View</a-button>
                            <a-button type="danger" @click.prevent="handleDelete(book.id)">Delete</a-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Cart />
</template>

<style scoped>
@import "../assets/bootstrap.css";

.book-list
{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.container
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    width: 95%;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 2%;
}

.center-obj
{
    display: flex;
    align-items: center;
    justify-content: center;
}

.actionButton
{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 242px;
    border: 0px;
}

.add-book
{
    margin-bottom: 1%;
}

.bookImg
{
    width: 15vw;
}
</style>