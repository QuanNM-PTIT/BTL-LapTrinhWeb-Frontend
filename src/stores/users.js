import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('users', () =>
{
    const user = ref(null);
    const token = ref(localStorage.getItem('token'));
    const errorMessage = ref('');
    const loading = ref(false);
    const router = useRouter();

    const validateEmail = (email) =>
    {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleLogin = async (credentials) =>
    {
        const { email, password } = credentials;

        if (!validateEmail(email))
        {
            return errorMessage.value = "Email không hợp lệ.";
        }

        loading.value = true;

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        await axios.post('login', formData)
            .then(async (response) =>
            {
                localStorage.setItem('token', response.data.access_token)
                token.value = response.data.access_token;

                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

                const userInfo = await axios.get('get_current_user');

                user.value =
                {
                    email: userInfo.data.email,
                    role: userInfo.data.role,
                    status: 'Đăng nhập'
                }

                loading.value = false;
                errorMessage.value = '';
            })
            .catch((error) =>
            {
                loading.value = false;
                return errorMessage.value = "Thông tin đăng nhập không đúng!";
            });
    }

    const handleLogout = async () =>
    {
        user.value = null;
        token.value = '';
        localStorage.removeItem('token');
    }

    const clearErrorMessage = () =>
    {
        errorMessage.value = '';
    }

    const handleSignup = async (credentials) =>
    {
        const { email, username, password, re_password } = credentials;

        if (!validateEmail(email))
        {
            return errorMessage.value = "Email không hợp lệ!";
        }

        if (password.length < 8)
        {
            return errorMessage.value = 'Mật khẩu cần có tối thiểu 8 ký tự!';
        }

        if (password != re_password)
        {
            return errorMessage.value = 'Mật khẩu không khớp!';
        }

        loading.value = true;

        errorMessage.value = '';

        // Thêm người dùng vào database
        try
        {
            const response = await axios.post('user/register',
                {
                    name: username,
                    email: email,
                    password: password
                });

            user.value =
            {
                data: response.data,
                status: 'Đăng ký'
            }

            loading.value = false;
        }
        catch (e)
        {
            loading.value = false;
            return errorMessage.value = e.response.data.detail;
        }
    }

    const getUser = async () =>
    {
        token.value = localStorage.getItem('token');

        const tokenJWT = localStorage.getItem('token');

        if (tokenJWT)
        {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

            const userInfo = await axios.get('get_current_user').catch(async (e) =>
            {
                message.error(
                    'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục!',
                    3,
                );
                await handleLogout();
                router.push('/');
            });

            user.value =
            {
                email: userInfo.data.email,
                role: userInfo.data.role
            }
        }
    }

    return { user, token, handleLogin, handleLogout, handleSignup, clearErrorMessage, getUser, errorMessage, loading }
})
