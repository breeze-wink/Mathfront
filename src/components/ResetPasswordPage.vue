<template>
    <div class="reset-password-page">
        <h1>修改密码</h1>
        <form @submit.prevent="handleResetPassword">
            <div class="input-group">
                <label for="oldPassword">旧密码：</label>
                <input id="oldPassword" v-model="oldPassword" placeholder="请输入旧密码" type="password" />
            </div>

            <div class="input-group">
                <label for="newPassword">新密码：</label>
                <input id="newPassword" v-model="newPassword" placeholder="包含大小写字母和数字（6-10位）" type="password" />
            </div>

            <div class="input-group">
                <label for="confirmNewPassword">确认新密码：</label>
                <input id="confirmNewPassword" v-model="confirmNewPassword" placeholder="请再次输入新密码" type="password" />
            </div>

            <div class="buttons">
                <button type="submit">确认修改</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';


// 使用 ref 创建响应式变量
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const router = useRouter();
const userName = ref(router.currentRoute.value.params.userName);
//实时监听路由
watch(() => router.currentRoute.value.params.userName, (newUsername) => {
    userName.value = newUsername;
});

// 确认修改密码方法
async function handleResetPassword() {

    try {
        const response = await axios.post('/api/user/resetPassword', {

            userName:userName.value,
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmNewPassword.value
        });
        if (response.data.success) {
            alert('密码修改成功！');
        } else {
            alert(`密码修改失败：${response.data.message}`);
        }
    } catch (e) {
        console.error('修改密码请求失败', e);
        alert('修改密码时发生错误');
    }
}
</script>

<style scoped>
.reset-password-page {
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