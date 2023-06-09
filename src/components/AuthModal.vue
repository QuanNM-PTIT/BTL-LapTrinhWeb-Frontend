<script setup>
import { ref, defineProps, reactive } from 'vue'
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, IdcardOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons-vue';

const visible = ref(false);

const props = defineProps(['isLogin']);

const userStore = useUserStore();

const { errorMessage, loading, user } = storeToRefs(userStore);

const userCredentials = reactive(
    {
        email: '',
        username: '',
        password: '',
        re_password: '',
    })

const showModal = () =>
{
    visible.value = true;
};

const clearUserCredentialsInput = () =>
{
    userCredentials.email = '';
    userCredentials.username = '';
    userCredentials.password = '';
    userStore.clearErrorMessage();
}

const handleOk = async (e) =>
{
    if (props.isLogin)
    {
        await userStore.handleLogin(
            {
                password: userCredentials.password,
                email: userCredentials.email
            }
        )
    }
    else
    {
        await userStore.handleSignup(userCredentials);
    }

    if (user.value)
    {
        clearUserCredentialsInput();
        visible.value = false;
        message.success(
            user.value.status + ' thành công!',
            3,
        );
    }
};

const handleCancel = () =>
{
    clearUserCredentialsInput();
    visible.value = false;
}

const title = props.isLogin ? 'Đăng nhập' : 'Đăng ký';
</script>

<template>
    <div>
        <a-button type="primary" @click.prevent="showModal" class="bttn">
            <UserAddOutlined v-if="!isLogin" />
            <LoginOutlined v-else />
            {{ title }}
        </a-button>
        <a-modal class="modal" v-model:visible="visible" :title="title" @ok.prevent="handleOk">
            <template #footer>
                <a-button key="back" @click.prevent="handleCancel">Thoát</a-button>
                <a-button :disabled="loading" key="submit" type="primary" :loading="loading" @click.prevent="handleOk">
                    {{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}
                </a-button>
            </template>
            <div v-if="!loading" class="input-container">
                <a-form :model="userCredentials">
                    <a-row v-if="!isLogin">
                        <a-col :span="24">
                            <a-form-item label="Họ và tên" :label-col="{ span: 5 }" name="username"
                                :rules="[{ required: true, message: 'Hãy nhập họ và tên!' }]">
                                <a-input v-model:value="userCredentials.username">
                                    <template #prefix>
                                        <IdcardOutlined class="site-form-item-icon" />
                                    </template>
                                </a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="Email" :label-col="{ span: 5 }" name="email"
                                :rules="[{ required: true, message: 'Hãy nhập email!' }]">
                                <a-input v-model:value="userCredentials.email">
                                    <template #prefix>
                                        <UserOutlined class="site-form-item-icon" />
                                    </template>
                                </a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="Mật khẩu" :label-col="{ span: 5 }" name="password"
                                :rules="[{ required: true, message: 'Hãy nhập mật khẩu!' }]">
                                <a-input-password v-model:value="userCredentials.password">
                                    <template #prefix>
                                        <LockOutlined class="site-form-item-icon" />
                                    </template>
                                </a-input-password>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row v-if="!isLogin">
                        <a-col :span="24">
                            <a-form-item label="Xác nhận" :label-col="{ span: 5 }" name="re_password"
                                :rules="[{ required: true, message: 'Hãy nhập mật khẩu!' }]">
                                <a-input-password v-model:value="userCredentials.re_password">
                                    <template #prefix>
                                        <LockOutlined class="site-form-item-icon" />
                                    </template>
                                </a-input-password>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row>
                        <a-typography-text style="width: 100%;" v-if="errorMessage" :style="{ textAlign: 'center' }"
                            type="danger">{{ errorMessage }}</a-typography-text>
                    </a-row>
                </a-form>
            </div>
            <div v-else class="spinner">
                <a-spin />
            </div>
        </a-modal>
    </div>
</template>

<style scoped>
.bttn
{
    margin-left: 10px;
}

.input-container
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 30vh;
}

.spinner
{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15vh;
}
</style>