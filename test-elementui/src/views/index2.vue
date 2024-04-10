<template>
    <div class="common">
      <!-- 登录 -->
      <div v-if="!isLogin" class="login">
        <el-tabs v-model="activeName">
          <el-tab-pane label="欢迎登录" name="first">
            <!-- 用户名输入 -->
              <el-input v-model="username" placeholder="请输入用户名">
                <el-button slot="append" @click="login">登录</el-button>
                
              </el-input>
              <!-- 头像选择 -->
              <div class="avatar">
                <span @click="avatar(src)" v-for="(src,index) in avatarList" :key="index">
                  <el-avatar :src="src" :class="{'choosed':src==choosed}"></el-avatar>
                </span>
              </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 聊天 -->
      <el-container v-else>
        <el-aside width="350px">
          <my-aside />
        </el-aside>
        <el-container>
          <el-header> 
            <span v-if="userInfo.name=='默认群聊'">{{userInfo.name}}： {{userList.length-1}}</span>  
            <span v-else>{{userInfo.name}}</span>
            </el-header>
          <el-main>
            <my-main />
          </el-main>
          <el-footer>
            <my-footer />
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </template>
  
  <script>
  import store from '../store/index'
  import myAside from "../components/myAside.vue";
  import myMain from "../components/myMain.vue";
  import myFooter from "../components/myFooter.vue";
  export default {
    name: "App",
    components: { myAside, myMain, myFooter },
    data() {
      return {
        activeName:'first',
        username:'',
        choosed:'',
        is_login:false,
        avatarList:[
          'http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg',
          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        ],
      }
    },
  
    methods: {
      avatar(src){
        this.choosed=src
      },
      login(){
        if(this.username&&this.choosed){
          /* 连接socket */
          this.$socket.connect();

          this.$socket.emit('login',{name:this.username,img:this.choosed},(result)=>{
            // if(this.is_login){
            if(result){
              /* 登录成功的情况下，才修改vuex的数据 */
              this.$message.success('登录成功！');
              /* 告诉vuex修改个人信息 */
              store.commit('setMyInfo',{
                img:this.choosed,
                name:this.username,
              });
              store.commit('changeChatType','group');
              store.commit('setUserInfo',{name:"默认群聊",img:"http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg"});
              var time = new Date();
                let data={
                    type:'enter',
                    sender:this.username,//发送者id
                    senderimg:this.choosed,//发送者的img
                    receiver: '默认群聊',//接收方id
                    time:time.toLocaleString( ),//发送时间
                    msg: "进入了直播间",//消息内容
                }
                this.$socket.emit('groupChat',data);
                /* 自己的信息直接push到数组中 */
                store.commit('SOCKET_updateChatMessageList',data);
              this.$router.push({
                name: 'live',
              })
            }else{
              /* 失败，给出提示！ */
              this.$message.error('用户名重复！');
            }
          });
        }
      },
    },
    computed:{
      isLogin(){
        return store.state.isLogin;
      },
      userInfo(){
        return store.state.userInfo;
      },
      userList(){
        return store.state.userList;
      },
    },
    sockets:{
      connect(){
        //向客户端发送用户信息
        this.$socket.emit("userInfo",this.username);
        console.log("连接成功");
        // console.log("我擦")
        // this.socketIoClient = SocketIo.connect('http://localhost:9092?userId=45')
        // //监听与服务器的连接状态
        // this.socketIoClient.on("connect",function(){
        //   console.log("连接了服务器")
        // })
      },
      connecting(){
        console.log("正在连接");
      },
      disconnect(){
        console.log("断开连接");
      },
      connect_error() {
        console.log("Socket 连接失败");
      },
      //监听用户信息的返回
      userInfo(data){
        console.log(data);
      },
      //监听私聊消息
      //这种方法无法使用this.***
      //发送消息后自己的监听
      privateSent(data){
        console.log(data);
      },
      //对方接收的消息
      privateReceive(data){
        console.log(data);
      },
      //监听群聊消息
      groupMessage:function (data){
        console.log(data);
      },
      login(data){
        this.is_login = true
      }
    }
  }
  </script>
  <style scoped>
  .choosed{
    border:  solid 2px red;
  }
  .login{
    width: 50%;
    margin-left: 25%;
    border: solid 1px rgb(228, 231, 237);
    padding: 30px;
  }
  .login .avatar{
    margin-top: 20px;
  }
  .login .avatar .el-avatar{
    cursor: pointer;
    margin-left: 5px;
  }
  .common {
  
    margin-top: 100px;
    width:100%;
    height: 200px;
  }
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    height: 500px;
  }
  
  .el-main {
    background-color: #e9eef3;
    color: #333;
    height: 280px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  </style>
  