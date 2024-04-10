<template>
  <div style="width: 100%;margin-top: 50px">
    <el-row type="flex" justify="center">
    <el-col :span="12" class="title">
      <div style="text-align: center;">
        <img style="width: 30px; height: 30px" src="../../public/img/beer.png">
      </div>
      <div style="text-align: center;">
        大啤酒
      </div>
    </el-col>
    <el-col :span="12">
      <div style="text-align: center;">
        <img style="width: 30px; height: 30px" src="../../public/img/hot_dog.png">
      </div>
      <div style="text-align: center;">
        大热狗
      </div>
    </el-col>
    <el-col :span="12">
      <div style="text-align: center;">
        <img style="width: 30px; height: 30px" src="../../public/img/rocket.png">
      </div>
      <div style="text-align: center;">
        大火箭
      </div>

    </el-col>
  </el-row>
  </div>
</template>

<script>
import store from '../store/index'
export default {
  data() {
    return {
      input:'',
    }
  },
  methods: {
    send(){
      var time = new Date();
      /* 发送消息 */
      /* 先判断是群聊还是私聊 */
      if(this.chatType=='group'){
         let data={
            type:'my',
            sender:this.myInfo.name,//发送者id
            senderimg:this.myInfo.img,//发送者的img
            receiver: '默认群聊',//接收方id
            time:time.toLocaleString( ),//发送时间
            msg: this.input,//消息内容
        }
        this.$socket.emit('groupChat',data);
        /* 自己的信息直接push到数组中 */
        store.commit('SOCKET_updateChatMessageList',data);
      }else{
         let data={
            type:'my',
            sender:this.myInfo.name,//发送者id
            senderimg:this.myInfo.img,//发送者的img
            receiver:this.userInfo.name,//接收方id
            time:time.toLocaleString( ),//发送时间
            msg: this.input,//消息内容
        }
        this.$socket.emit('privateChat',data);
        /* 自己的信息直接push到数组中 */
        store.commit('SOCKET_updateChatMessageList',data);
      }
      /* 清空输入框 */
      this.input='';
    },
  },
  computed:{
    myInfo(){
      return store.state.myInfo;
    },
    chatType(){
      return store.state.chatType;
    },
    userInfo(){
      return store.state.userInfo;
    },
  },
};
</script>

<style>
</style>