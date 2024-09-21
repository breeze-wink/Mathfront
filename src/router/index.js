import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from "@/components/RegisterPage.vue";
import ConfirmRegisterPage from "@/components/ConfirmRegisterPage.vue";
import ResetPasswordPage from "@/components/ResetPasswordPage.vue";
import PersonalHomePage from "@/components/PersonalHomePage.vue";
import SetQuestionPage from "@/components/SetQuestionPage.vue";
import SolveQuestionPage from "@/components/SolveQuestionPage.vue";
import ScorePage from "@/components/ScorePage.vue"
import ReviewPage from "@/components/ReviewPage.vue"; // 新增

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/Register',
        name: 'Register',
        component: RegisterPage
    },
    {
        path: '/ConfirmRegister/:email', //  定义动态路由，捕获邮箱作为参数
        name: 'ConfirmRegister',
        component: ConfirmRegisterPage
    },
    {
        path: '/ResetPassword/:userName',
        name: 'ResetPassword',
        component: ResetPasswordPage
    },
    {
        path: '/PersonalHomePage/:userName',
        name: 'PersonalHomePage',
        component: PersonalHomePage
    },
    {
        path: '/SetQuestion',
        name: 'SetQuestion',
        component: SetQuestionPage
    },
    {
        path: '/SolveQuestion',
        name: 'SolveQuestion',
        component: SolveQuestionPage
    },
    {
        path: '/ScorePage',
        name: 'ScorePage',
        component: ScorePage
    },
    {
        path: '/ReviewPage',
        name: 'ReviewPage',
        component: ReviewPage
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
