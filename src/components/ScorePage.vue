<template>
    <div class="container">
        <!-- 粒子背景容器 -->
        <div id="particles-js" class="particles-bg"></div>

        <div class="score-page">
            <h1>考试结束</h1>
            <div class="score-display">
                <p>您的得分：</p>
                <h2>{{ score }} / 100</h2>
            </div>
            <div class="buttons">
                <button class="btn-continue" @click="goContinue">
                    <i class="fas fa-arrow-right"></i> 继续
                </button>
                <button class="btn-review" @click="goReview">
                    <i class="fas fa-eye"></i> 查看作答情况
                </button>
                <button class="btn-exit" @click="goExit">
                    <i class="fas fa-sign-out-alt"></i> 退出
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const score = ref(0);

onMounted(() => {
    // 尝试从路由参数获取分数
    if (route.params.score !== undefined) {
        score.value = parseFloat(route.params.score);
    } else {
        // 尝试从 sessionStorage 获取分数
        const storedScore = sessionStorage.getItem('score');
        if (storedScore) {
            score.value = parseFloat(storedScore);
        } else {
            alert('未接收到分数数据！');
            router.push({ name: 'SetQuestion' });
        }
    }
});

function goContinue() {
    // 清除 sessionStorage 中的分数和题目数据
    sessionStorage.removeItem('questions');
    sessionStorage.removeItem('number');
    sessionStorage.removeItem('score');
    router.push({ name: 'SetQuestion' });
}

function goReview() {
    router.push({ name: 'ReviewPage' });
}

function goExit() {
    // 清除 sessionStorage 中的分数和题目数据
    sessionStorage.removeItem('questions');
    sessionStorage.removeItem('number');
    sessionStorage.removeItem('score');
    router.push({ name: 'Login' });
}
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

/* 评分页面样式 */
.score-page {
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

.score-display {
    background: rgba(255, 255, 255, 0.2);
    padding: 20px 15px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-size: 20px;
}

.score-display h2 {
    margin-top: 10px;
    font-size: 28px;
    color: #34c759;
}

.buttons {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.btn-continue, .btn-review, .btn-exit {
    flex: 1;
    padding: 12px 20px;
    background: linear-gradient(135deg, #ff7e5f, #feb47b);
    border: none;
    border-radius: 30px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
}

.btn-review {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
}

.btn-continue:hover, .btn-exit:hover, .btn-review:hover {
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
}

.btn-review:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
    box-shadow: 0 8px 25px rgba(37, 117, 252, 0.5);
}

.btn-continue:active, .btn-exit:active, .btn-review:active {
    transform: scale(0.95);
}

.btn-exit {
    background: linear-gradient(135deg, #ff7e5f, #feb47b);
}

@media (max-width: 600px) {
    .score-page {
        padding: 30px 20px;
    }

    h1 {
        font-size: 28px;
    }

    .score-display {
        font-size: 18px;
    }

    .score-display h2 {
        font-size: 24px;
    }

    .btn-continue, .btn-review, .btn-exit {
        font-size: 14px;
        padding: 10px 15px;
    }
}
</style>
