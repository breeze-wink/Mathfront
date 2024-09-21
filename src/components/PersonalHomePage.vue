<template>
    <div class="personal-home-page">
        <h1>个人主页</h1>
        <div class="welcome-message">
            <label>Hi~ o(*￣▽￣*)ブ {{ userName }}</label>
        </div>
        <div class="buttons">
            <button @click="startPractice">开始做题</button>
            <button @click="goToResetPassword">修改密码</button>
        </div>
    </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import {useRoute, useRouter} from 'vue-router';

// 假设从登录状态或全局状态中获取用户名

const route = useRoute();
const router = useRouter();
const userName = ref(route.params.userName);

// 开始做题方法
async function startPractice() {
    // 这里可以添加跳转到做题页面的逻辑

    //await router.push({name: '    ', params: {username: username.value}});
}

// 修改密码方法
async function goToResetPassword() {
    // 这里可以添加跳转到修改密码页面的逻辑

    await router.push({name: 'ResetPassword', params: {userName: userName.value}});

}
</script>

<style scoped>
.personal-home-page {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
}

.welcome-message {
    margin: 20px 0;
    text-align: center;
    font-size: 24px;
    color: #333;
}

.buttons {
    display: block; /* 修改为 block 使按钮上下排列 */
    margin: 10px 0; /* 根据需要调整上下边距 */
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%; /* 使按钮宽度充满容器宽度 */
    margin-bottom: 10px; /* 为按钮添加底部边距 */
}

button:hover {
    background-color: #0056b3;
}
</style>