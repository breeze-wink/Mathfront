import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from "@/components/RegisterPage.vue";
import ConfirmRegisterPage from "@/components/ConfirmRegisterPage.vue";

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
        component: () => import('../components/ConfirmRegisterPage.vue')
    }
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
