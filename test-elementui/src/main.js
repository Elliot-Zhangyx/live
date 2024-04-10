import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router'
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css';
import VueSocketIO from 'vue-socket.io'
import request from "@/utils/request";
import networkStore from './store/store';

Vue.config.productionTip = false
Vue.prototype.request=request
Vue.use(ElementUI).use(
  new VueSocketIO({
    debug: false, // debug调试，生产建议关闭
    connection: "http://localhost:3000",
    // connection: "http://101.43.196.8:3000",
    vuex: {
      store,
      networkStore,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    options: {     //Optional options, 
      autoConnect:false, //关闭自动连接，在用户登录后在连接。
    },
    extraHeaders: {"Access-Control-Allow-Origin": '*'},
  })
);
//
new Vue({
  request,
  store,
  router,
  render: h => h(App),
}).$mount('#app')

