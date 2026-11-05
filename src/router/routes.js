const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue') },
      { path: 'second', component: () => import('@/pages/SecondPage.vue') },
      { path: 'estadisticas', component: () => import('@/pages/EstadisticasPage.vue') },
      { path: 'nuevo', component: () => import('@/pages/NewProductPage.vue') },
      { path: 'producto/:id', component: () => import('@/pages/ProductDetailPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
