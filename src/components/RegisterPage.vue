<template>
  <div class="register-page">
    <h1>用户注册</h1>


      <div class="input-group">
        <label for="email">邮箱：</label>
        <input id="email" v-model="email" placeholder="请输入邮箱" type="email" />
      </div>

      <div class="input-group">
        <label for="verification">验证码：</label>
        <input id="verification" v-model="verification" placeholder="请输入验证码" type="text" />
        <button type="submit" @click="sendVerification">发送</button>
      </div>

      <div class="buttons">
        <button type="button" @click="handleNextStep">下一步</button>
      </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// 使用 ref 创建响应式变量
const email = ref('');
const verification = ref('');
const serverVerification = ref(null);

// 注册方法


// 发送验证码方法
// 发送验证码方法
async function sendVerification() {
  try {
    //判断邮箱是否合法
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.value)) {
      alert('您输入的邮箱地址不合法，请重新输入');
      return; // 终止进一步执行
    }

    const response = await axios.post('/api/sendmail', {
      email: email.value,
    });
    if (response.data.success) {
      serverVerification.value = response.data.verifyCode; // 假设后端返回的验证码字段为 verifyCode
      alert('验证码已发送到您的邮箱');
    } else {
      alert(`发送失败：${response.data.message}`);
    }
  } catch (e) {
    console.error('发送验证码请求失败', e);
    alert('发送验证码时发生错误');
  }
}

// 下一步方法
// 下一步方法
async function handleNextStep() {
  if (verification.value !== serverVerification.value) {
    alert(`验证码错误`);
    return; // 终止进一步执行
  }
  console.log('注册信息', { email: email.value, verification: verification.value });
  alert('注册信息已提交，请等待验证');
  // 可以在这里添加更多的逻辑，例如跳转到其他页面或进一步处理
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