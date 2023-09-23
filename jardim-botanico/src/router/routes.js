
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/hikingTrail/:hikingTrailId',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'HikingTrail',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/collectionItem/:collectionItemId',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'CollectionItem',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AboutPage.vue')
      }
    ]
  },
  {
    path: '/collection',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CollectionListPage.vue')
      }
    ]
  },
  {
    path: '/hikingTrails',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HikingTrailListPage.vue')
      }
    ]
  },
  {
    path: '/menu',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/MenuPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
