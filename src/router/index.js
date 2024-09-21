import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from "@/components/RegisterPage.vue";
import ConfirmRegisterPage from "@/components/ConfirmRegisterPage.vue";
import ResetPasswordPage from "@/components/ResetPasswordPage.vue";
import PersonalHomePage from "@/components/PersonalHomePage.vue";

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
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
