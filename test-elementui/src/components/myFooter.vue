<template>
  <div style="display: flex;align-items: center;justify-content: center;justify-items: center;">
    <el-input placeholder="和观众聊聊吧~" v-model="input" size="small" maxlength="20" show-word-limit @keyup.enter.native="send" style="width: 260px;flex:6"> </el-input>
    <el-button type="primary" size="small" @click="send" style="flex:1;margin-left:10px">发送</el-button>
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
      if(this.input === "" || this.input === undefined || this.input === null){
        this.$message({
          message: '输入的内容不能为空',
          type: 'warning'
        });
        return
      } 
      var time = new Date();
      /* 发送消息 */
      /* 先判断是群聊还是私聊 */
      //if(this.chatType=='group'){
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
      // }else{
      //    let data={
      //       type:'my',
      //       sender:this.myInfo.name,//发送者id
      //       senderimg:this.myInfo.img,//发送者的img
      //       receiver:this.userInfo.name,//接收方id
      //       time:time.toLocaleString( ),//发送时间
      //       msg: this.input,//消息内容
      //   }
      //   this.$socket.emit('privateChat',data);
      //   /* 自己的信息直接push到数组中 */
      //   store.commit('SOCKET_updateChatMessageList',data);
      // }
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

<style scoped>
</style>