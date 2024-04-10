<template>
  <div class="div1">
    <!--  msgList:[
      {
            type:'my',
            sender:this.myInfo.name,//发送者id
            senderimg:this.myInfo.img,//发送者的img
            receiver: '默认群聊',//接收方id
            time:time.toLocaleString( ),//发送时间
            msg: this.input,//消息内容
        }]  -->
    <!-- 先循环找到你想要聊天的那个人 -->
    <div v-for="(list, index) in msgList" :key="index">
      <!-- 有聊天记录：循环聊天记录 -->
      <div v-if="(list.receiver==userInfo.name)&&userInfo.name=='默认群聊'">
        <!-- 再循环显示聊天记录 --> 
          <!-- <el-avatar v-if="list.type=='user'" :src="list.senderimg"></el-avatar>
          <el-avatar v-if="list.type=='my'" :src="list.senderimg" style="float:right;"></el-avatar> -->
          <!-- <span>{{list.name}}</span>
          <span class="content">{{list.msg}}</span> -->
           <div v-if="list.type ==='enter'" style="margin-bottom: 10px;">
            <span class="content" style="font-size: 12px;color: #909399;">{{list.sender}}&emsp;</span>
            <span class="content" style="font-size: 12px;color: #909399;">{{list.msg}}</span>
           </div>
          <div v-else style="margin-bottom: 10px;">
            <span style="font-size: 15px;color: #606266;">{{list.sender}}：</span>
            <span class="content" style="font-size: 15px;color: #303133;">{{list.msg}}</span>
          </div>
      </div>
      <div v-else>
        <!-- 根据接收者和发送者定位聊天记录 -->
        <div v-if="((list.receiver==myInfo.name)&&(list.sender==userInfo.name))||((list.receiver==userInfo.name)&&(list.sender==myInfo.name))">
            <!-- 再循环显示聊天记录 --> 
              <span style="font-size: 15px;color: #606266;">{{myInfo.name}}:</span>
              <span class="content" style="font-size: 15px;color: #303133;">{{list.msg}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index";
export default {
  data() {
    return {
    };
  },
  computed:{
    msgList(){
      return store.state.chatMessageList;
    },
    myInfo(){
      return store.state.myInfo;
    },
    userInfo(){
      return store.state.userInfo;
    }
  },
};
</script>
<style scoped>
.div1 {
  width: 100%;
}
.div1 P{
  width: 100%;
  height: 50px;
}
/* .content{
background-color: antiquewhite;
padding: 10px;
border-radius: 10px;
font-weight: bold;
}
.right{
  text-align: right;
} */
</style>