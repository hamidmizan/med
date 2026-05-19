import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import BookDetail from '../views/BookDetail.vue'

const routes = [
  { 
    path: '/', 
    alias: '/dashboard', 
    component: Dashboard, 
    name: 'dashboard',
    meta: { title: 'Dashboard' } 
  },
  { 
    path: '/login', 
    component: Login, 
    name: 'login',
    meta: { title: 'Login' }
  },
  { 
    path: '/register', 
    component: Register, 
    name: 'register',
    meta: { title: 'Register' }
  },
  { 
    path: '/books/:bookId', 
    component: BookDetail, 
    name: 'book-detail',
    meta: { title: 'Detail Buku' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token');

  document.title = to.meta.title || 'SmartLibrary';

  if (to.name !== 'login' && to.name !== 'register' && !isAuthenticated) {
    return { name: 'login' };
  }

  if (isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' };
  }
});

export default router;