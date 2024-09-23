<template>
  <div class="container">
    <!-- 粒子背景 -->
    <div id="particles-js" class="particles-bg"></div>

    <div class="register-page">
      <!-- 返回按钮 -->
      <button class="back-button" @click="goBack" aria-label="返回">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1>用户注册</h1>
      <form @submit.prevent="handleNextStep">
        <div class="input-group">
          <label for="email">邮箱：</label>
          <input id="email" v-model="email" placeholder="请输入邮箱" type="email" required />
        </div>

        <div class="input-group">
          <label for="verification">验证码：</label>
          <div class="verification-group">
            <input id="verification" v-model="verification" placeholder="请输入验证码" type="text" required />
            <button
                type="button"
                @click="sendVerification"
                :disabled="countdown > 0"
                class="send-button"
            >
              <i class="fas fa-paper-plane"></i>
              {{ countdown > 0 ? `${countdown}s` : '发送' }}
            </button>
          </div>
        </div>

        <div class="buttons">
          <button type="submit" class="btn-next">
            <i class="fas fa-arrow-right"></i> 下一步
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const email = ref('');
const verification = ref('');
const serverVerification = ref(null);
const countdown = ref(0);
const router = useRouter();
let timer = null;

async function sendVerification() {
  if (countdown.value > 0) return;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email.value)) {
    Swal.fire({
      icon: 'error',
      title: '无效的邮箱',
      text: '您输入的邮箱地址不合法，请重新输入。',
      confirmButtonText: '确定'
    });
    return;
  }

  startCountdown();

  try {
    const response = await axios.post('/api/mail/send', { email: email.value });
    serverVerification.value = response.data.verifyCode;
  } catch (e) {
    console.error('发送验证码请求失败', e);
    Swal.fire({
      icon: 'error',
      title: '发送失败',
      text: '发送验证码时发生错误，请稍后重试。',
      confirmButtonText: '确定'
    });
  }
}

function startCountdown() {
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
}

async function handleNextStep() {
  if (verification.value !== serverVerification.value) {
    Swal.fire({
      icon: 'error',
      title: '验证码错误',
      text: '您输入的验证码不正确，请重新输入。',
      confirmButtonText: '确定'
    });
    return;
  }
  await router.push({ name: 'ConfirmRegister', params: { email: email.value } });
  console.log('注册信息', { email: email.value, verification: verification.value });
}

function goBack() {
  router.push({ name: 'Login' });
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

onMounted(() => {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": {
          "type": "circle",
          "stroke": { "width": 0, "color": "#000000" },
          "polygon": { "nb_sides": 5 }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "repulse" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 400, "line_linked": { "opacity": 1 } },
          "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
          "repulse": { "distance": 200, "duration": 0.4 },
          "push": { "particles_nb": 4 },
          "remove": { "particles_nb": 2 }
        }
      },
      "retina_detect": true
    });
  } else {
    console.error('particlesJS 未加载');
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';

body {
  font-family: 'Roboto Slab', serif;
}

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1f4037, #99f2c8);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  overflow: hidden;
  color: white;
  transition: background 1s ease;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.particles-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  z-index: 1;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.register-page {
  max-width: 450px;
  width: 100%;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: white;
  opacity: 0;
  animation: fadeIn 1s forwards;
  position: relative;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-group label {
  margin-bottom: 5px;
  font-size: 18px;
}

.input-group input {
  width: 95%;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

.input-group input::placeholder {
  color: #999;
}

.verification-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.verification-group input {
  flex: 3;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  padding-right: 10px;
}

.send-button {
  flex: 1;
  height: 100%;
  font-size: 16px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: white;
  border: none;
  border-radius: 10px;
  margin-left: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
  box-shadow: 0 6px 15px rgba(255, 126, 95, 0.3);
}

.send-button i {
  margin-right: 5px;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
  background: linear-gradient(135deg, #feb47b, #ff7e5f);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
  width: 100%;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  box-shadow: 0 6px 15px rgba(109, 213, 237, 0.3);
}

button i {
  margin-right: 8px;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(109, 213, 237, 0.5);
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
}

button:active {
  transform: scale(0.95);
}

.btn-next {
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
}

.btn-next:hover {
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
  box-shadow: 0 8px 25px rgba(109, 213, 237, 0.5);
}

@media (max-width: 600px) {
  .register-page {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  .input-group label {
    font-size: 16px;
  }

  .input-group input {
    font-size: 14px;
  }

  .send-button {
    font-size: 14px;
  }

  button {
    font-size: 14px;
    padding: 10px 15px;
  }

  .back-button {
    top: 10px;
    left: 10px;
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
}
</style>
