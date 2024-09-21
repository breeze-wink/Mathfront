<template>
    <div class="container">
        <!-- 粒子背景容器 -->
        <div id="particles-js" class="particles-bg"></div>

        <div class="login-page">
            <h1>用户登录</h1>
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="username">账号：</label>
                    <input id="username" v-model="username" placeholder="请输入账号" type="text" required />
                </div>

                <div class="input-group">
                    <label for="password">密码：</label>
                    <input id="password" v-model="password" placeholder="请输入密码" type="password" required />
                </div>

                <div class="buttons">
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> 登录
                    </button>
                    <button type="button" class="btn-register" @click="goToRegister">
                        <i class="fas fa-user-plus"></i> 注册
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // 引入 SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // 引入 SweetAlert2 样式

// 使用 ref 创建响应式变量
const username = ref('');
const password = ref('');
const router = useRouter(); // 获取路由实例

// 登录方法
async function handleLogin() {
    try {
        const response = await axios.post('/api/user/login', {
            account: username.value,  // 改成 "account" 而不是 "username"
            password: password.value,
        });
        if (!response.data.success) {
            // 如果登录失败，显示返回的失败信息
            Swal.fire({
                icon: 'error',
                title: '登录失败',
                text: `登录失败：${response.data.message}`,
                confirmButtonText: '确定'
            });
        } else {
            // 向个人主页传输用户名和头像（假设后端返回头像URL）
            const userAvatar = response.data.userAvatar || '/avatars/default-avatar.png';
            Swal.fire({
                icon: 'success',
                title: '登录成功！',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                router.push({
                    name: 'PersonalHomePage',
                    params: {
                        userName: username.value,
                        userAvatar: userAvatar
                    }
                });
            });
        }
    } catch (e) {
        console.error('登录请求失败', e);
        Swal.fire({
            icon: 'error',
            title: '请求失败',
            text: '登录时发生错误，请稍后重试。',
            confirmButtonText: '确定'
        });
    }
}

// 注册跳转
function goToRegister() {
    router.push({ name: 'Register' });
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
.particles-bg { /* 修正类名为 .particles-bg */
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
}

/* 登录页样式 */
.login-page {
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
    margin-bottom: 30px;
    letter-spacing: 2px;
    color: #ffffff;
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
    width: 93%;
    padding: 10px 15px;
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

/* 按钮布局 */
.buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 10px;
}

/* 统一按钮的颜色和样式 */
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
    background: linear-gradient(135deg, #ff7e5f, #feb47b); /* 统一颜色 */
    box-shadow: 0 6px 15px rgba(255, 126, 95, 0.3);
}

button i {
    margin-right: 8px;
}

/* 按钮悬浮效果 */
button:hover {
    transform: scale(1.05); /* 悬浮时放大 */
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
    background: linear-gradient(135deg, #feb47b, #ff7e5f); /* 悬浮时颜色反转 */
}

button:active {
    transform: scale(0.95);
}

/* 登录按钮特定样式 */
.btn-login {
    background: linear-gradient(135deg, #6dd5ed, #2193b0); /* 蓝色渐变 */
    box-shadow: 0 6px 15px rgba(109, 213, 237, 0.3);
}

.btn-login:hover {
    background: linear-gradient(135deg, #2193b0, #6dd5ed);
    box-shadow: 0 8px 25px rgba(109, 213, 237, 0.5);
}

/* 注册按钮特定样式 */
.btn-register {
    background: linear-gradient(135deg, #28a745, #6dd5ed); /* 注册按钮特定颜色 */
    box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3);
}

.btn-register:hover {
    background: linear-gradient(135deg, #6dd5ed, #28a745);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
}

/* 响应式设计 */
@media (max-width: 600px) {
    .login-page {
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

    button {
        font-size: 14px;
        padding: 10px 15px;
    }
}
</style>
