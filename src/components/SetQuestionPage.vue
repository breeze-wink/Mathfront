<template>
    <div class="set-question-page">
        <h1>题目设置</h1>
        <div class="question-type">
            <label for="questionType">题目类型：</label>
            <div class="type-buttons">
                <button @click="selectType('小学')">小学</button>
                <button @click="selectType('初中')">初中</button>
                <button @click="selectType('高中')">高中</button>
            </div>
        </div>
        <div class="question-amount">
            <label for="questionAmount">题目数量：</label>
            <input type="number" v-model="questionAmount" placeholder="10-30" min="10" max="30" />
        </div>
        <div class="confirm-button">
            <button @click="confirm">确认</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";

const questionType = ref('');
const questionAmount = ref(10);
const questions = ref([]); // 定义响应式变量来存储题目数组
const router = useRouter();

function selectType(type) {
    questionType.value = type;
}
function sendQuestion() {
    // 将数据转换为字符串，因为路由参数不能直接传递数组
    const serializedQuestions = JSON.stringify(questions.value);
    router.push({ name: 'SolveQuestion', params: { questions: serializedQuestions } });
}
async function confirm() {
    if (questionType.value && questionAmount.value) {
        if (questionAmount.value < 10 || questionAmount.value > 30){
            alert('题目数量应在10~30')
        }else{
            try {
                const response = await axios.post('/api/question/generate', {
                    type: questionType.value,
                    number: questionAmount.value
                });
                //保存题目
                questions.value = response.data.questions;
                // 处理响应
                console.log(response.data);
                alert('题目生成成功！');
            } catch (error) {
                // 处理错误
                console.error('题目生成失败:', error);
                alert('题目生成失败，请重试！');
            }
        }
    } else {
        alert('请完整填写题目类型和题目数量！');
    }
}
</script>

<style scoped>
.set-question-page {
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

.question-type, .question-amount {
    margin: 20px 0;
    text-align: center;
}

.type-buttons button {
    margin: 0 10px;
}

input[type="number"] {
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

.confirm-button {
    margin-top: 20px;
    text-align: center;
}
</style>