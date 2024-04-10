import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Video from '../views/video.vue'
import LiveHouse from '../views/liveHouse.vue'
import Live from '../views/live.vue'
import Live2 from '../views/live2.vue'
import WebRTC from '../views/webrtc.vue'
import Index2 from '../views/index2.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
  {
    path: '/live_house',
    name: 'live_house',
    component: LiveHouse
  },{
    path: '/live',
    name: 'live',
    component: Live
  },{
    path: '/live2',
    name: 'live2',
    component: Live2
  }
  ,{
    path: '/webrtc',
    name: 'webrtc',
    component: WebRTC
  }
  ,{
    path: '/index2',
    name: 'index2',
    component: Index2
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
