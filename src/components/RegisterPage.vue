<template>
    <div class="register-page">
        <h1>用户注册</h1>

        <div class="input-group">
            <label for="email">邮箱：</label>
            <input id="email" v-model="email" placeholder="请输入邮箱" type="email" />
        </div>

        <div class="input-group verification-group">
            <label for="verification">验证码：</label>
            <input id="verification" v-model="verification" placeholder="请输入验证码" type="text" />
            <button
                type="button"
                @click="sendVerification"
                :disabled="countdown > 0"
                class="send-button"
            >
                {{ countdown > 0 ? `${countdown}s` : '发送' }}
            </button>
        </div>

        <div class="buttons">
            <button type="button" @click="handleNextStep">下一步</button>
        </div>
    </div>
</template>

<script setup>
import {ref, onBeforeUnmount} from 'vue';
import axios from 'axios';

const email = ref('');
const verification = ref('');
const serverVerification = ref(null);
const countdown = ref(0);
let timer = null;

// 发送验证码方法
async function sendVerification() {
    // Start countdown immediately
    if (countdown.value === 0) {
        countdown.value = 60;
        timer = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    try {
        // 判断邮箱是否合法
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value)) {
            alert('您输入的邮箱地址不合法，请重新输入');
            // Reset countdown if email is invalid
            clearInterval(timer);
            countdown.value = 0;
            return;
        }

        const response = await axios.post('/api/mail/send', {
            email: email.value,
        });
        serverVerification.value = response.data.verifyCode;
        // No alert on successful send
    } catch (e) {
        console.error('发送验证码请求失败', e);
        alert('发送验证码时发生错误');
        // Reset countdown on error
        clearInterval(timer);
        countdown.value = 0;
    }
}

// 下一步方法
async function handleNextStep() {
    if (verification.value !== serverVerification.value) {
        alert('验证码错误');
        return;
    }
    console.log('注册信息', {email: email.value, verification: verification.value});
    alert('注册信息已提交，请等待验证');
}

// 清理定时器，防止内存泄漏
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
});
</script>

<style scoped>
.register-page {
    max-width: 400px;
    margin: 50px auto;
    padding: 40px 50px;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 35px;
    color: #333;
    font-size: 24px;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
}

.input-group label {
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
}

.input-group input {
    padding: 12px 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: border-color 0.3s;
}

.input-group input:focus {
    border-color: #007bff;
    outline: none;
}

.verification-group {
    position: relative;
}

.verification-group input {
    width: 220px;
    padding-right: 100px; /* Space for the button */
}

.send-button {
    position: absolute;
    right: 0;
    top: 41%;
    height: 60%;
    width: 60px; /* 固定宽度 */
    padding: 0 12px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.send-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.send-button:not(:disabled):hover {
    background-color: #0056b3;
}

.buttons {
    margin-top: 35px;
}

.buttons button {
    width: 100%;
    padding: 14px 0;
    font-size: 18px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.buttons button:hover {
    background-color: #218838;
}
</style>
