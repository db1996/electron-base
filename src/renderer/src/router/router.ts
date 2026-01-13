import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import HomePage from '@renderer/pages/HomePage.vue'
import SettingsPage from '@renderer/pages/SettingsPage.vue'
import SetupPage from '@renderer/pages/SetupPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'entry',
        redirect: 'home'
    },
    {
        path: '/home',
        name: 'home',
        component: HomePage
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage
    },
    {
        path: '/setup',
        name: 'setup',
        component: SetupPage
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'border-indigo-500',
    linkExactActiveClass: 'border-indigo-700'
})

export default router
