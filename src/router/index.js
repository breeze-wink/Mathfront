import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from "@/components/RegisterPage.vue";

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
