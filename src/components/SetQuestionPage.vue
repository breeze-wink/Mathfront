<template>
  <div class="container">
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
        />
      </div>

      <!-- 确认按钮 -->
      <div class="buttons">
        <button
            class="btn-confirm"
            @click="handleConfirm"
            :disabled="isLoading">
          <i class="fas fa-check" v-if="!isLoading"></i>
          <span v-if="!isLoading">确认</span>
          <span v-else>生成中...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";
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

// 延迟函数，用于在重试之间添加延迟（可选）
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 确认按钮点击处理函数
async function handleConfirm() {
  console.log('handleConfirm 被触发');

  // 前端验证
  if (!questionType.value) {
    Swal.fire({
      icon: 'warning',
      title: '信息不完整',
      text: '请完整选择题目类型和输入题目数量。',
      confirmButtonText: '确定'
    });
    console.log('验证失败：信息不完整');
    return;
  }

  if (questionAmount.value < 10 || questionAmount.value > 30) {
    Swal.fire({
      icon: 'warning',
      title: '题目数量错误',
      text: '题目数量应在10到30之间。',
      confirmButtonText: '确定'
    });
    console.log('验证失败：题目数量错误');
    return;
  }

  isLoading.value = true; // 开启加载状态

  const maxRetries = 3; // 最大重试次数
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    try {
      console.log(`发送请求到后端，尝试次数：${attempt + 1}`);
      const response = await axios.post('/api/question/generate', {
        type: questionType.value,
        number: questionAmount.value
      }, {timeout: 10000}); // 设置超时时间为10秒
      console.log('收到后端响应:', response.data);

      // 检查后端响应
      if (response.data && response.data.questions) {
        questions.value = response.data.questions;
        console.log('设置题目数据并导航');

        // 将数据存储到 sessionStorage
        sessionStorage.setItem('questions', JSON.stringify(questions.value));
        sessionStorage.setItem('number', questionAmount.value);

        // 关闭加载状态
        isLoading.value = false;

        // 导航到 SolveQuestion 页面，不再 await 以避免阻塞
        router.push({name: 'SolveQuestion'})
            .then(() => {
              console.log('成功导航到 SolveQuestion 页面');
            })
            .catch(error => {
              console.error('导航到 SolveQuestion 页面失败:', error);
              Swal.fire({
                icon: 'error',
                title: '导航失败',
                text: '无法进入下一页，请重试！',
                confirmButtonText: '确定'
              });
            });

        success = true;
      } else {
        console.log('后端未返回题目数据');
        throw new Error('后端未返回题目数据');
      }
    } catch (error) {
      attempt++;
      console.error(`题目生成失败，第 ${attempt} 次尝试:`, error);
      if (attempt >= maxRetries) {
        Swal.fire({
          icon: 'error',
          title: '题目生成失败',
          text: '无法生成题目，请重试！',
          confirmButtonText: '确定'
        });
      } else {
        console.log('将在 2 秒后进行重试...');
        await delay(2000); // 等待 2 秒后重试
      }
    }
  }

  // 如果未成功，确保关闭加载状态
  if (!success) {
    isLoading.value = false;
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
  background: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  box-shadow: none;
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
