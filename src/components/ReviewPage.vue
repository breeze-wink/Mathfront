<template>
  <div class="container">
    <!-- 粒子背景容器 -->
    <div id="particles-js" class="particles-bg"></div>

    <div class="review-page" v-if="questions.length > 0">
      <h1>作答情况</h1>
      <div class="questions-list">
        <div v-for="(question, index) in questions" :key="question.number" class="question-item">
          <div class="question-header">
            <span class="question-number">第 {{ index + 1 }} 题</span>
            <span class="question-progress">{{ index + 1 }}/{{ totalQuestions }}</span>
          </div>
          <div class="question-content">
            <p>{{ question.content }}</p>
          </div>
          <div class="choices">
            <button
                v-for="(choice, cIndex) in question.choices"
                :key="cIndex"
                :class="getChoiceClass(question, choice)"
                :disabled="true"
            >
              {{ String.fromCharCode(65 + cIndex) }}. {{ choice }}
            </button>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="btn-continue" @click="goContinue">
          <i class="fas fa-arrow-right"></i> 继续
        </button>
        <button class="btn-exit" @click="goExit">
          <i class="fas fa-sign-out-alt"></i> 退出
        </button>
      </div>
    </div>

    <!-- 当没有题目数据时显示的内容 -->
    <div class="no-questions" v-else>
      <p>正在加载作答情况，请稍候...</p>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const questions = ref([]);
const totalQuestions = ref(0);
const selectedChoices = ref({});

onMounted(() => {
  const storedQuestions = sessionStorage.getItem('questions');
  const storedNumber = sessionStorage.getItem('number');
  const storedScore = sessionStorage.getItem('score');
  const storedSelectedChoices = sessionStorage.getItem('selectedChoices');

  if (storedQuestions && storedNumber) {
    try {
      const parsedQuestions = JSON.parse(storedQuestions);
      questions.value = parsedQuestions.sort((a, b) => a.number - b.number);
      totalQuestions.value = parseInt(storedNumber, 10);
    } catch (e) {
      console.error('解析题目数据失败:', e);
      alert('题目数据加载失败，请重试！');
      router.push({name: 'SetQuestion'});
    }
  } else {
    console.error('未接收到题目数据');
    alert('未接收到题目数据，请重新设置题目！');
    router.push({name: 'SetQuestion'});
  }

  // 获取用户的选择
  selectedChoices.value = JSON.parse(sessionStorage.getItem('selectedChoices') || '{}');
});

// 函数：获取每个选项的样式
function getChoiceClass(question, choice) {
  const classes = ['choice-button'];
  if (choice === question.answer) {
    classes.push('correct-answer');
  }
  if (selectedChoices.value[question.number] === choice) {
    if (choice === question.answer) {
      classes.push('selected-correct');
    } else {
      classes.push('selected-incorrect');
    }
  }
  return classes;
}

// 按钮功能
function goContinue() {
  // 清除 sessionStorage 中的分数和题目数据
  sessionStorage.removeItem('questions');
  sessionStorage.removeItem('number');
  sessionStorage.removeItem('score');
  sessionStorage.removeItem('selectedChoices');
  router.push({name: 'SetQuestion'});
}

function goExit() {
  // 清除 sessionStorage 中的分数和题目数据
  sessionStorage.removeItem('questions');
  sessionStorage.removeItem('number');
  sessionStorage.removeItem('score');
  sessionStorage.removeItem('selectedChoices');
  router.push({name: 'Login'});
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

/* 作答情况页面样式 */
.review-page {
  max-width: 800px;
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
  margin-bottom: 20px;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
  max-height: 60vh;
}

.question-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 20px 15px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.question-header {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.question-content {
  margin-bottom: 15px;
  font-size: 20px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-button {
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 18px;
  color: #fff;
  cursor: not-allowed;
  transition: background 0.3s, border 0.3s;
  text-align: left;
}

.choice-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 样式类：正确答案 */
.correct-answer {
  background: linear-gradient(135deg, #28a745, #34c759);
  border: 2px solid #fff;
}

/* 样式类：用户选择的正确答案 */
.selected-correct {
  background: linear-gradient(135deg, #28a745, #34c759);
  border: 2px solid #fff;
}

/* 样式类：用户选择的错误答案 */
.selected-incorrect {
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  border: 2px solid #fff;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.btn-continue, .btn-exit {
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

.btn-continue:hover, .btn-exit:hover {
  background: linear-gradient(135deg, #feb47b, #ff7e5f);
  box-shadow: 0 8px 25px rgba(255, 126, 95, 0.5);
}

.btn-continue:active, .btn-exit:active {
  transform: scale(0.95);
}

@media (max-width: 600px) {
  .review-page {
    padding: 30px 20px;
  }

  h1 {
    font-size: 28px;
  }

  .question-content {
    font-size: 18px;
  }

  .choice-button {
    font-size: 16px;
    padding: 10px 12px;
  }

  .btn-continue, .btn-exit {
    font-size: 14px;
    padding: 10px 15px;
  }
}

/* 样式类：正确答案 */
.correct-answer {
  background: linear-gradient(135deg, #28a745, #34c759);
  border: 2px solid #fff;
}

/* 样式类：用户选择的正确答案 */
.selected-correct {
  background: linear-gradient(135deg, #28a745, #34c759);
  border: 2px solid #fff;
}

/* 样式类：用户选择的错误答案 */
.selected-incorrect {
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  border: 2px solid #fff;
}
</style>
