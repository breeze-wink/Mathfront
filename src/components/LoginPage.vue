<template>
    <div class="login-page">
        <h1>用户登录</h1>
        <form @submit.prevent="handleLogin">
            <label for="username">账号：</label>
            <input id="username" v-model="username" placeholder="请输入账号" type="text" />

            <label for="password">密码：</label>
            <input id="password" v-model="password" placeholder="请输入密码" type="password" />

            <div class="buttons">
                <button type="submit">登录</button>
                <button type="button" @click="goToRegister">注册</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from 'axios';
import {useRouter} from "vue-router";

// 使用 ref 创建响应式变量
const username = ref('');
const password = ref('');
const router = useRouter();//获取路由实例

// 登录方法
async function handleLogin() {
    try {
        const response = await axios.post('/api/user/login', {
            account: username.value,  // 改成 "account" 而不是 "username"
            password: password.value,
        });
        if (!response.data.success) {
            // 如果登录失败，显示返回的失败信息
            alert(`登录失败：${response.data.message}`);
        }
    } catch (e) {
        console.error('登录请求失败', e);
        alert('登录时发生错误');
    }
}


// 注册跳转
function goToRegister() {
    router.push('/Register');
}
</script>

<style scoped>
.login-page {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 5px;
}

input {
    margin-bottom: 15px;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.buttons {
    display: flex;
    justify-content: space-between;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button[type="button"] {
    background-color: #28a745;
}
</style>
