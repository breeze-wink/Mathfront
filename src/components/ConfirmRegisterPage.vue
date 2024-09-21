<template>
    <div class="confirm-register-page">
        <h1>用户注册</h1>
        <form @submit.prevent="handleConfirmRegister">
            <div class="input-group">
                <label for="username">用户名：</label>
                <input id="username" v-model="username" placeholder="请输入用户名" type="text" />
            </div>

            <div class="input-group">
                <label for="password">密码：</label>
                <input id="password" v-model="password" placeholder="包含大小写字母和数字（6-10位）" type="password" />
            </div>

            <div class="input-group">
                <label for="confirmPassword">确认密码：</label>
                <input id="confirmPassword" v-model="confirmPassword" placeholder="请再次输入密码" type="password" />
            </div>

            <div class="buttons">
                <button type="submit">确认注册</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import {useRoute} from "vue-router";

// 使用 ref 创建响应式变量
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const route = useRoute();
const email = ref(route.params.email);

// 确认注册方法
async function handleConfirmRegister() {

    try {
        const response = await axios.post('/api/user/confirmRegister', {
            username: username.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            email: email.value
        });
        if (response.data.legal) {
            alert('注册成功！');
        } else {
            alert(`注册失败：${response.data.message}`);
        }
    } catch (e) {
        console.error('注册请求失败', e);
        alert('注册时发生错误');
    }
}
</script>

<style scoped>
.confirm-register-page {
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

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

label {
    margin-bottom: 5px;
}

input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.buttons {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>