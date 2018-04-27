import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/auth'
import Shops from '@/components/shops'
import Shop from '@/components/shop'
import ShopGoods from '@/components/shop/goods'
import ShopInfo from '@/components/shop/info'
import My from '@/components/my'
import Orders from '@/components/orders'
import Order from '@/components/order'
import OrderPay from '@/components/pay/order-pay'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/shops'
    },
    {
      path: '*',
      redirect: '/shops'
    },
    {
      path: '/auth',
      component: Auth
    },
    {
      path: '/shops',
      component: Shops
    },
    {
      path: '/shop/:shopId',
      component: Shop,
      redirect: '/shop/:shopId/goods',
      children: [
        {
          name: 'goods',
          path: 'goods',
          component: ShopGoods
        },
        {
          path: 'info',
          component: ShopInfo
        }
      ]
    },
    {
      path: '/my',
      component: My
    },
    {
      path: '/orders',
      component: Orders
    },
    {
      path: '/order/:orderId',
      component: Order
    },
    {
      path: '/pay/order-pay',
      component: OrderPay
    }
  ]
})
