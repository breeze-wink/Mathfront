<template>
  <div class="register-page">
    <h1>用户注册</h1>
    <form @submit.prevent="handleNextStep">
      <div class="input-group">
        <label for="email">邮箱：</label>
        <input id="email" v-model="email" placeholder="请输入邮箱" type="email" />
      </div>

      <div class="input-group">
        <label for="verification">验证码：</label>
        <input id="verification" v-model="verification" placeholder="请输入验证码" type="text" />
        <button type="button" @click="sendVerification">发送</button>
      </div>

      <div class="buttons">
        <button type="submit">下一步</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 使用 ref 创建响应式变量
const email = ref('');
const verification = ref('');

// 注册方法
async function handleRegister() {
  try {
    const response = await axios.post('/api/sendemail', {
      email: email.value,
    });
    if (response.data.vefifyCode === verification.value) {
      // 如果登录失败，显示返回的失败信息
      alert(`注册成功！`);
    }else{
      //注册失败
    }
  } catch (e) {
    console.error('登录请求失败', e);
    alert('登录时发生错误');
  }
}

// 发送验证码方法
function sendVerification() {
  // 这里可以添加发送验证码的逻辑
  console.log('发送验证码到', email.value);
  alert('验证码已发送到您的邮箱');
}

// 下一步方法
function handleNextStep() {
  // 这里可以添加下一步的逻辑
  console.log('注册信息', { email: email.value, verification: verification.value });
  alert('注册信息已提交，请等待验证');
}
</script>

<style scoped>
.register-page {
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
  justify-content: space-between;
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

button[type="button"] {
  background-color: #28a745;
  margin-top: 5px;
}
</style>