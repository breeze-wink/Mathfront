<template>
  <div class="container">
    <!-- 粒子背景容器 -->
    <div id="particles-js" class="particles-bg"></div>

    <div class="personal-home-page">
      <h1>个人主页</h1>
      <div class="welcome-section">
        <img :src="userAvatar" alt="User Avatar" class="avatar">
        <label>亲爱的{{ userName }}</label>
      </div>
      <div class="buttons">
        <button class="btn-practice" @click="startPractice">
          <i class="fas fa-book"></i> 开始做题
        </button>
        <button class="btn-reset" @click="goToResetPassword">
          <i class="fas fa-key"></i> 修改密码
        </button>
        <button class="btn-logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> 退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const userName = ref(route.params.userName);
const userAvatar = ref(route.params.userAvatar || '/avatars/default-avatar.png');


async function startPractice() {
  await router.push({name: 'SetQuestion'});
}

async function goToResetPassword() {
  await router.push({name: 'ResetPassword', params: {userName: userName.value}});
}

function logout() {
  router.push({name: 'Login'});
}

// 初始化 particles.js
onMounted(() => {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
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
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
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

/* 全局字体 */
body {
  font-family: 'Roboto Slab', serif;
}

/* 容器和背景 */
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
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 粒子背景 */
.particles-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* 个人主页样式 */
.personal-home-page {
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
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  font-size: 22px;
  color: #fdfdfd;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
}

/* 按钮布局 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

/* 统一按钮的颜色 */
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
  width: 80%;
  margin: 0 auto;
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* 新的统一颜色 */
  box-shadow: 0 6px 15px rgba(255, 126, 95, 0.3);
}

button i {
  margin-right: 8px;
}

/* 悬浮时的放大效果 */
button:hover {
  transform: scale(1.05); /* 悬浮时放大 */
  box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
  background: linear-gradient(135deg, #feb47b, #ff7e5f); /* 悬浮时颜色反转 */
}

button:active {
  transform: scale(0.95);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .personal-home-page {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  .welcome-section {
    font-size: 18px;
  }

  button {
    width: 100%;
  }
}
</style>
