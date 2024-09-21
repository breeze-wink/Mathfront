<template>
    <div class="container">
        <!-- 粒子背景容器 -->
        <div id="particles-js" class="particles-bg"></div>

        <div class="set-question-page">
            <h1>题目设置</h1>

            <!-- 题目类型选择 -->
            <div class="question-type">
                <div class="type-buttons">
                    <button
                        :class="{ active: questionType === '小学' }"
                        @click="selectType('小学')">
                        小学
                    </button>
                    <button
                        :class="{ active: questionType === '初中' }"
                        @click="selectType('初中')">
                        初中
                    </button>
                    <button
                        :class="{ active: questionType === '高中' }"
                        @click="selectType('高中')">
                        高中
                    </button>
                </div>
            </div>

            <!-- 题目数量输入 -->
            <div class="question-amount">
                <label for="questionAmount">数量：</label>
                <input
                    type="number"
                    id="questionAmount"
                    v-model.number="questionAmount"
                    placeholder="10-30"
                    min="10"
                    max="30"
                    :disabled="isLoading"
                />
            </div>

            <!-- 确认按钮 -->
            <div class="buttons">
                <button class="btn-confirm" @click="handleConfirm" :disabled="isLoading">
                    <i class="fas fa-check"></i> 确认
                </button>
            </div>
        </div>

        <!-- 提交加载遮罩层 -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-container">
                <div class="spinner"></div>
                <p>生成题目中，请稍候...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2'; // 引入 SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // 引入 SweetAlert2 样式

const questionType = ref('');
const questionAmount = ref(10);
const questions = ref([]); // 定义响应式变量来存储题目数组
const router = useRouter();
const isLoading = ref(false); // 定义加载状态

// 题目类型选择函数
function selectType(type) {
    questionType.value = type;
}

// 将题目数据存储到 sessionStorage 并导航到下一个页面
function sendQuestion() {
    sessionStorage.setItem('questions', JSON.stringify(questions.value));
    sessionStorage.setItem('number', questionAmount.value);
    router.push({ name: 'SolveQuestion' });
}

// 确认按钮点击处理函数
async function handleConfirm() {
    // 前端验证
    if (!questionType.value || !questionAmount.value) {
        Swal.fire({
            icon: 'warning',
            title: '信息不完整',
            text: '请完整选择题目类型和输入题目数量。',
            confirmButtonText: '确定'
        });
        return;
    }

    if (questionAmount.value < 10 || questionAmount.value > 30){
        Swal.fire({
            icon: 'warning',
            title: '题目数量错误',
            text: '题目数量应在10到30之间。',
            confirmButtonText: '确定'
        });
        return;
    }

    try {
        isLoading.value = true; // 开启加载状态

        const response = await axios.post('/api/question/generate', {
            type: questionType.value,
            number: questionAmount.value
        });

        // 检查后端响应
        if (response.data && response.data.questions) {
            questions.value = response.data.questions;
            sendQuestion();
        } else {
            throw new Error('后端未返回题目数据');
        }
    } catch (error) {
        console.error('题目生成失败:', error);
        Swal.fire({
            icon: 'error',
            title: '题目生成失败',
            text: '无法生成题目，请重试！',
            confirmButtonText: '确定'
        });
    } finally {
        isLoading.value = false; // 关闭加载状态
    }
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
    min-height: 100vh;
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

/* 题目设置页面样式 */
.set-question-page {
    max-width: 500px;
    width: 90%;
    padding: 40px 30px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    text-align: center;
    color: white;
    opacity: 0;
    animation: fadeIn 1s forwards;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

h1 {
    font-size: 36px;
    margin-bottom: 10px;
    letter-spacing: 2px;
    color: #ffffff;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

/* 题目类型按钮 */
.question-type {
    display: flex;
    justify-content: center;
}

.type-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    width: 100%;
}

.type-buttons button {
    flex: 1;
    padding: 12px 0;
    background: linear-gradient(135deg, #ff7e5f, #feb47b);
    border: none;
    border-radius: 30px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
    position: relative;
    overflow: hidden;
}

.type-buttons button.active {
    background: linear-gradient(135deg, #34c759, #28a745);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
}

.type-buttons button:hover:not(.active) {
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 6px 15px rgba(255, 126, 95, 0.3);
}

.type-buttons button:active {
    transform: scale(0.95);
}

/* 题目数量输入 */
.question-amount {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    font-size: 28px;
}

.question-amount label {
    flex: 0 0 auto;
}

.question-amount input[type="number"] {
    flex: 0 0 100px;
    padding: 8px 12px;
    border: none;
    border-radius: 10px;
    font-size: 26px;
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background 0.3s, transform 0.3s;
}

.question-amount input[type="number"]:focus {
    outline: none;
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

/* 确认按钮 */
.buttons {
    display: flex;
    justify-content: center;
}

.btn-confirm {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 25px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
    background: linear-gradient(135deg, #28a745, #34c759);
    box-shadow: 0 6px 15px rgba(40, 167, 69, 0.3);
}

.btn-confirm i {
    margin-right: 8px;
}

.btn-confirm:hover {
    background: linear-gradient(135deg, #34c759, #28a745);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
}

.btn-confirm:active {
    transform: scale(0.95);
}

.btn-confirm:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    box-shadow: none;
}

/* 提交加载遮罩层 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-container {
    text-align: center;
    color: white;
}

.spinner {
    border: 8px solid rgba(255, 255, 255, 0.2);
    border-top: 8px solid #34c759;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 600px) {
    .set-question-page {
        padding: 30px 20px;
    }

    h1 {
        font-size: 28px;
    }

    .type-buttons {
        gap: 10px;
    }

    .question-amount {
        flex-direction: column;
        gap: 10px;
    }

    .question-amount input[type="number"] {
        flex: 0 0 80%;
    }

    .buttons {
        gap: 10px;
    }

    .btn-confirm {
        width: 100%;
    }
}
</style>
