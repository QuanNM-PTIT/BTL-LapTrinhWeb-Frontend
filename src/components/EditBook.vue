<script setup>
import { reactive, ref, onMounted, createVNode } from 'vue';
import { UploadOutlined, SaveOutlined, ExclamationCircleOutlined, FileAddOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';

const fileImage = ref(null);
const router = useRouter();
const route = useRoute();
const bookID = parseInt(route.params.id);
const isEdit = ref(false);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

if (bookID == -1)
{
    isEdit.value = true;
}

const bookInfo = reactive(
    {
        title: '',
        author: '',
        category: '',
        release_date: '',
        num_pages: 0,
        description: '',
        price: 0,
        image: '',
    })

onMounted(async () =>
{
    await userStore.getUser();

    if (bookID != -1)
    {
        await axios.get('book/' + bookID)
            .then(response =>
            {
                bookInfo.title = response.data.title;
                bookInfo.author = response.data.author;
                bookInfo.category = response.data.category;
                bookInfo.release_date = response.data.release_date;
                bookInfo.num_pages = response.data.num_pages;
                bookInfo.description = response.data.description;
                bookInfo.price = response.data.price;
                bookInfo.image = response.data.image;
            })
    }
})

const handleCustomRequest = (options) =>
{
    const { file, onProgress, onSuccess, onError } = options;
    if (file)
    {
        fileImage.value = file;
        const reader = new FileReader();

        reader.onload = () =>
        {
            bookInfo.image = reader.result;
        };

        reader.readAsDataURL(file);
    }
}

const addBook = async () =>
{
    Modal.confirm(
        {
            title: 'Thêm sách',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn thêm quyển sách này?',
            okText: 'Thêm',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.post('book/new_book',
                    {
                        'title': bookInfo.title,
                        'author': bookInfo.author,
                        'category': bookInfo.category,
                        'description': bookInfo.description,
                        'num_pages': bookInfo.num_pages,
                        'release_date': bookInfo.release_date,
                        'price': bookInfo.price,
                        'image': bookInfo.image
                    }
                ).then((response) =>
                {
                    message.success(
                        'Thêm thành công!',
                        3,
                    );

                    router.push('/all-book');
                })
                    .catch((error) =>
                    {
                        console.error(error);
                        message.error(
                            'Thêm sách thất bại, sách đã tồn tại!',
                            3,
                        );
                    });
            },
        });
}

const handleEdit = async () =>
{
    isEdit.value = true;
}

const saveBook = async () =>
{
    Modal.confirm(
        {
            title: 'Cập nhật thông tin sách',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn cập nhật lại thông tin của quyển sách này?',
            okText: 'Cập nhật',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                await axios.put(`book/update/${bookID}`,
                    {
                        'title': bookInfo.title,
                        'author': bookInfo.author,
                        'category': bookInfo.category,
                        'description': bookInfo.description,
                        'num_pages': bookInfo.num_pages,
                        'release_date': bookInfo.release_date,
                        'price': bookInfo.price,
                        'image': bookInfo.image
                    }
                ).then((response) =>
                {
                    message.success(
                        'Cập nhật thông tin sách thành công!',
                        3,
                    );

                    router.push('/all-book');
                })
                    .catch((error) =>
                    {
                        console.error(error);
                        message.error(
                            'Cập nhật thông tin thất bại, sách đã tồn tại!',
                            3,
                        );
                    });
            },
        });
}

const handleBackHome = () =>
{
    router.push('/');
}
</script>

<template>
    <div v-if="user && user.role == 'Admin'">
        <h1>Sách</h1>
        <div class="container">

            <a-form :model="bookInfo" class="form-container">
                <div class="left-content">
                    <div class="first-line">
                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Tiêu đề" :label-col="{ span: 7 }" name="title"
                                    :rules="[{ required: true, message: 'Hãy nhập tiêu đề!' }]">
                                    <a-input v-model:value="bookInfo.title" :disabled="!isEdit" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Tác giả" :label-col="{ span: 7 }" name="author"
                                    :rules="[{ required: true, message: 'Hãy nhập tác giả!' }]">
                                    <a-input v-model:value="bookInfo.author" :disabled="!isEdit" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>

                    <div class="second-line">
                        <a-row>
                            <a-col :span="19">
                                <a-form-item label="Mô tả về sách::" :label-col="{ span: 24 }" :labelAlign="'top'"
                                    name="description" :rules="[{ required: false }]">
                                    <a-textarea v-model:value="bookInfo.description" show-count :maxlength="5000"
                                        :auto-size="{ minRows: 10, maxRows: 10 }" :disabled="!isEdit" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>

                    <div class="first-line">
                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Ngày phát hành" :label-col="{ span: 11 }" name="release_date"
                                    :rules="[{ required: true, message: 'Hãy nhập ngày phát hành!' }]">
                                    <a-input type="date" v-model:value="bookInfo.release_date" :disabled="!isEdit" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="Số trang" :label-col="{ span: 9 }" name="num_pages"
                                    :rules="[{ required: false }]">
                                    <a-input v-model:value="bookInfo.num_pages" :disabled="!isEdit" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>

                    <div class="third-line">
                        <div class="book-category">
                            <a-row>
                                <a-col :span="24">
                                    <a-form-item label="Thể loại" :label-col="{ span: 10 }" name="category"
                                        :rules="[{ required: true, message: 'Hãy chọn thể loại!' }]">
                                        <a-select v-model:value="bookInfo.category" :disabled="!isEdit">
                                            <a-select-option value="Tiểu thuyết">Tiểu thuyết</a-select-option>
                                            <a-select-option value="Truyện tranh">Truyện tranh</a-select-option>
                                            <a-select-option value="Thơ">Thơ</a-select-option>
                                            <a-select-option value="Bút ký">Bút ký</a-select-option>
                                            <a-select-option value="Tình cảm">Tình cảm</a-select-option>
                                            <a-select-option value="Khoa học viễn tưởng">Khoa học viễn tưởng</a-select-option>
                                            <a-select-option value="Tiểu sử">Tiểu sử</a-select-option>
                                            <a-select-option value="Tâm lý">Tâm lý</a-select-option>
                                            <a-select-option value="Kinh dị">Kinh dị</a-select-option>
                                            <a-select-option value="Truyền cảm hứng">Truyền cảm hứng</a-select-option>
                                            <a-select-option value="Giáo dục - Gia đình">Giáo dục - Gia đình</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </div>

                        <div class="book-price">
                            <a-row>
                                <a-col :span="24">
                                    <a-form-item label="Giá tiền" :label-col="{ span: 8 }" name="price"
                                        :rules="[{ required: true, message: 'Hãy nhập giá tiền!' }]">
                                        <a-input suffix="đ" v-model:value="bookInfo.price" :disabled="!isEdit" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </div>

                <div class="right-content">
                    <div class="upload-image">
                        <a-upload type="file" :custom-request="handleCustomRequest" :show-upload-list="false">
                            <a-button :disabled="!isEdit">
                                <upload-outlined></upload-outlined>
                                Tải lên bìa sách
                            </a-button>
                        </a-upload>
                    </div>

                    <div class="book-image">
                        <img :src="bookInfo.image" alt="Bìa" v-if="bookInfo.image">
                    </div>
                </div>
            </a-form>
        </div>

        <footer>
            <a-button type="primary" style="font-size: 15px; margin-right: 20px;" @click="addBook" v-if="bookID == -1">
                <FileAddOutlined />
                Thêm sách
            </a-button>
            <div class="action-buttons" v-else>
                <a-button type="primary" style="font-size: 15px; margin-right: 20px;" @click="handleEdit" v-if="!isEdit">
                    <EditOutlined />
                    Chỉnh sửa
                </a-button>
                <a-button type="primary" style="font-size: 15px; margin-right: 20px;" @click="saveBook" v-else>
                    <SaveOutlined />
                    Lưu
                </a-button>
            </div>
        </footer>
    </div>

    <template v-else>
        <a-result status="404" title="404 Not found!" sub-title="Không tìm thấy trang.">
            <template #extra>
                <a-button type="primary" @click="handleBackHome">Trang chủ</a-button>
            </template>
        </a-result>
    </template>
</template>

<style scoped>
.container
{
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    padding-bottom: 2%;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 2%;
}

h1
{
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    padding-top: 10px;
    margin-bottom: 0px;
}

.form-container
{
    display: flex;
}

.left-content
{
    display: flex;
    flex-direction: column;
    width: 49%;
}

.first-line
{
    display: flex;
    padding-left: 40px;
    padding-top: 20px;
}

.second-line
{
    padding-left: 40px;
}

.third-line
{
    display: flex;
    align-items: center;
}

.book-category
{
    width: 47%;
    margin-left: 0px;
    margin-right: 0px;
}

.right-content
{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 49%;
    margin-top: 10px;
}

.book-image
{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    width: 90%;
    height: 90%;
}

.book-image img
{
    margin-top: 20px;
    width: 60%;
}

footer
{
    background-color: #e3e2e2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
}
</style>