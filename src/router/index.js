import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewNote from '@/components/NewNote'
import ViewNote from '@/components/ViewNote'
import EditNote from '@/components/EditNote'
import Login from '@/components/Login';
import Register from '@/components/Register';
import firebase from 'firebase';


Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/new',
      name: 'new-note',
      component: NewNote,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/edit/:note_id',
      name: 'edit-note',
      component: EditNote,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:note_id',
      name: 'view-note',
      component: ViewNote,
      meta: {
        requiresAuth: true
      }
    },
  ]
})
//user condition
router.beforeEach((to, from, next) => {
  //check required 
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //checking if user is not logged in
    if (!firebase.auth().currentUser) {
      //redirect to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      //You may pass
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //checking if user is logged in
    if (firebase.auth().currentUser) {
      //redirect to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      //You may pass
      next();
    }
  } else {
    //You may pass
    next();
  }
})

export default router;