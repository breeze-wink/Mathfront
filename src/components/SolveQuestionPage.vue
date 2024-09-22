<template>
    <div class="container">
        <!-- 粒子背景容器 -->
        <div id="particles-js" class="particles-bg"></div>

        <!-- 解答题目页面 -->
        <div class="solve-question-page" v-if="questions.length > 0">
            <!-- 顶部信息栏 -->
            <div class="top-bar">
                <div class="question-number">
                    第 {{ currentQuestionIndex + 1 }} 题
                </div>
                <div class="progress">
                    {{ answeredCount }}/{{ totalQuestions }}
                </div>
            </div>

            <!-- 题目内容 -->
            <div class="question-content">
                <p>{{ currentQuestion.content }}</p>
            </div>

            <!-- 选项列表 -->
            <div class="choices">
                <button
                    v-for="(choice, index) in currentQuestion.choices"
                    :key="index"
                    :class="['choice-button', selectedChoices[currentQuestion.number] === choice ? 'selected' : '']"
                    @click="selectChoice(choice)"
                >
                    {{ String.fromCharCode(65 + index) }}. {{ choice }}
                </button>
            </div>

            <!-- 底部导航栏 -->
            <div class="bottom-bar">
                <button
                    class="nav-button"
                    :disabled="currentQuestionIndex === 0"
                    @click="prevQuestion"
                >
                    上一题
                </button>
                <button
                    class="nav-button"
                    v-if="!isLastQuestion"
                    @click="nextQuestion"
                >
                    下一题
                </button>
                <button
                    class="nav-button submit-button"
                    v-else
                    @click="submitAnswers"
                >
                    提交
                </button>
            </div>
        </div>

        <!-- 当没有题目数据时显示的内容 -->
        <div class="no-questions" v-else>
            <p>正在加载题目，请稍候...</p>
        </div>

        <!-- 提交进度条遮罩层 -->
        <div v-if="isSubmitting" class="progress-overlay">
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p>提交中，请稍候...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // 引入 SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // 引入 SweetAlert2 样式

const router = useRouter();

// 题目数据
const questions = ref([]);
const totalQuestions = ref(0);
const currentQuestionIndex = ref(0);
const selectedChoices = reactive({});
const answeredCount = computed(() => Object.keys(selectedChoices).length);

// 提交状态
const isSubmitting = ref(false);

// 获取题目数据
onMounted(() => {
    const storedQuestions = sessionStorage.getItem('questions');
    const storedNumber = sessionStorage.getItem('number');
    if (storedQuestions && storedNumber) {
        try {
            const parsedQuestions = JSON.parse(storedQuestions);
            // 确保题目数组按照题号排序
            questions.value = parsedQuestions.sort((a, b) => a.number - b.number);
            totalQuestions.value = parseInt(storedNumber, 10);
        } catch (e) {
            console.error('解析题目数据失败:', e);
            Swal.fire({
                icon: 'error',
                title: '题目数据加载失败',
                text: '无法加载题目数据，请重试！',
                confirmButtonText: '确定'
            });
            router.push({ name: 'SetQuestion' });
        }
    } else {
        console.error('未接收到题目数据');
        Swal.fire({
            icon: 'error',
            title: '题目数据缺失',
            text: '未接收到题目数据，请重新设置题目！',
            confirmButtonText: '确定'
        });
        router.push({ name: 'SetQuestion' });
    }
});

// 当前题目
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

// 选择选项
function selectChoice(choice) {
    const questionNumber = currentQuestion.value.number;
    if (selectedChoices[questionNumber] === choice) {
        // 取消选择
        delete selectedChoices[questionNumber];
    } else {
        // 选择新的选项
        selectedChoices[questionNumber] = choice;
    }
}

// 导航函数
function prevQuestion() {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value -= 1;
    }
}

function nextQuestion() {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value += 1;
    }
}

const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1);

// 提交答案
async function submitAnswers() {
    if (answeredCount.value < totalQuestions.value) {
        const result = await Swal.fire({
            title: '您有未完成的题目',
            text: '您还有未回答的题目，是否要提交?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '提交',
            cancelButtonText: '取消',
        });

        if (!result.isConfirmed) {
            return; // 用户选择取消
        }
    }

    isSubmitting.value = true;

    // 显示进度条动画
    try {
        // 计算正确答案数量
        let correctCount = 0;
        questions.value.forEach(q => {
            if (selectedChoices[q.number] === q.answer) {
                correctCount += 1;
            }
        });

        // 计算分数并保留两位小数
        const calculatedScore = (correctCount / totalQuestions.value) * 100;
        const finalScore = Math.round(calculatedScore * 100) / 100;

        // 存储分数和选择到 sessionStorage
        sessionStorage.setItem('score', finalScore);
        sessionStorage.setItem('selectedChoices', JSON.stringify(selectedChoices));

        // 模拟延迟以显示进度条效果
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 跳转到成绩页面
        router.push({ name: 'ScorePage' });
    } catch (e) {
        console.error('提交答案失败', e);
        Swal.fire({
            icon: 'error',
            title: '提交失败',
            text: '提交答案时发生错误，请稍后重试。',
            confirmButtonText: '确定'
        });
    } finally {
        isSubmitting.value = false;
    }
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

/* 解答题目页面样式 */
.solve-question-page {
    max-width: 700px;
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

/* 顶部信息栏 */
.top-bar {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: bold;
    padding: 0 10px;
}

/* 题目内容 */
.question-content {
    background: rgba(255, 255, 255, 0.2);
    padding: 20px 15px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    text-align: left;
}

/* 选项列表 */
.choices {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.choice-button {
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid transparent;
    border-radius: 10px;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s, border 0.3s, transform 0.3s;
    text-align: left;
    position: relative;
    overflow: hidden;
}

.choice-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
}

.choice-button.selected {
    background: linear-gradient(135deg, #34c759, #28a745);
    border: 2px solid #fff;
}

/* 底部导航栏 */
.bottom-bar {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.nav-button {
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
    position: relative;
    overflow: hidden;
}

.nav-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
    transform: scale(1.02);
}

.nav-button:active {
    transform: scale(0.95);
}

.nav-button:disabled {
    background: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    box-shadow: none;
}

/* 提交按钮 */
.submit-button {
    background: linear-gradient(135deg, #28a745, #34c759);
}

.submit-button:hover {
    background: linear-gradient(135deg, #34c759, #28a745);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
    transform: scale(1.02);
}

/* 当没有题目数据时显示的内容 */
.no-questions {
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
    font-size: 20px;
    opacity: 0;
    animation: fadeIn 1s forwards;
}

/* 提交进度条遮罩层 */
.progress-overlay {
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

.progress-container {
    text-align: center;
    color: white;
}

.progress-bar {
    width: 300px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;
    position: relative;
}

.progress-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(270deg, #6dd5ed, #2193b0, #6dd5ed);
    animation: fillProgress 1.5s forwards;
    position: absolute;
    top: 0;
    left: 0;
}

.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    right: -50px;
    width: 50px;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    animation: shimmer 1.5s infinite;
}

/* 新增的动画 */
@keyframes fillProgress {
    from {
        width: 0%;
    }
    to {
        width: 100%;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(100%);
    }
}

/* 响应式设计 */
@media (max-width: 600px) {
    .solve-question-page {
        padding: 30px 20px;
    }

    .top-bar {
        font-size: 16px;
    }

    .question-content {
        font-size: 18px;
    }

    .choice-button {
        font-size: 16px;
        padding: 12px 15px;
    }

    .nav-button {
        font-size: 14px;
        padding: 10px 15px;
    }

    .progress-bar {
        width: 80%;
    }
}
</style>
