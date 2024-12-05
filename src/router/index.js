import About from '@/views/About.vue';
import AppList from '@/views/AppList.vue';
import NotFound from '@/views/NotFound.vue';
import PasswordManagement from '@/views/PasswordManagement.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppList,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/app/:appId/passwords',
      name: 'passwords',
      component: PasswordManagement
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'invalid',
      component: NotFound
    }
  ],
});

export default router;