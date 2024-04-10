<template>
  <div class="index">
    <div style="position: absolute;top: 50%;  left: 50%;transform: translate(-50%, -50%);display: flex;">
      <el-card :body-style="{ padding: '0px'}" style="background-color: rgba(255,255,255,0.9);">
        <div slot="header" style="display:flex;align-items: center;">
          <img src="http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg" alt="" style="width: 50px;border-radius: 50%;"/>
          <div style="margin-left: 10px;">
            <div>Shopper</div>
            <div><span style="font-size: 14px;color: #909399">初来乍到，关注一下吧！</span></div>
          </div>
        </div>
        <div v-show="isLive" ref="containerRef" class="container">
          <video id="video" autoplay ref="video" controls controlslist="nodownload noremoteplayback noplaybackrate foobar"></video>
        </div>
        <div v-show="!isLive" :style="{width:wrapSize.width+'px',height:wrapSize.height+'px',backgroundColor:'black'}" style="display: flex;align-items: center;justify-content: center;">
          <span style="font-size: 20px;color: #C0C4CC;">主播正在打酱油.....</span>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
          <my-gift />
        </div>
      </el-card>
      <el-card  :body-style="{ padding: '0px'}" style="width: 25%;margin-left: 10px;">
        <el-container class="el-container">
          <el-container>
              <el-header style="display:flex;box-shadow:2px 0 6px rgba(0,21,41,0.15);border-bottom: 1px solid #ccc;text-align: center;align-items: center;justify-items: center;">
                <span v-if="userInfo.name=='默认群聊'">在线人数： {{userList.length-1}}</span>  
                <span v-else>{{userInfo.name}}</span>
              </el-header>
              <el-main class="el-main">
                <my-main />
              </el-main>
          </el-container>
          <el-footer class="el-footer">
            <my-footer />
          </el-footer>
        </el-container>
      </el-card> 
    </div>  
  </div>
</template>

<script>
  import store from '../store/index'
  import myAside from "../components/myAside.vue";
  import myMain from "../components/myMain.vue";
  import myFooter from "../components/myFooter.vue";
  import myGift from "../components/myGift.vue";
  import topLine from "../components/Header.vue";
import { watch } from 'vue';
  export default {
    components: {"my-aside":myAside, "my-main":myMain, "my-footer":myFooter,"my-gift":myGift,"top-line":topLine},
    data() {
      return {
        pc:null,
        ended:false,
        resolutionRatio :[
            {
              label: '360P',
              value: 360
            },
            {
              label: '540P',
              value: 540
            },
            {
              label: '720P',
              value: 720
            },
            {
              label: '1080P',
              value: 1080
            },
            {
              label: '1440P',
              value: 1440
            },
          ],
          wrapSize:{width:0,height:0},
          videoRatio:16/9
      }
    },
    async mounted() {
      this.initWrapSize()
      // this.initVideo();
      // this.play()
    },
    created() {
      //this.getVideoData()
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
      isLive(){
        if(store.state.isLive){
          this.initVideo();
          this.play();
        }
        return store.state.isLive;
      }
    },
    methods: {
      initVideo(){
            const resolutionHeight = this.resolutionRatio[3].value / window.devicePixelRatio;
            const resolutionWidth = (this.resolutionRatio[3].value / window.devicePixelRatio) * this.videoRatio;
            console.log(resolutionHeight,resolutionWidth)
            // const wrapWidth = this.$refs.containerRef.getBoundingClientRect().width;
            const wrapWidth = window.screen.width*0.7;
            console.log(wrapWidth)
            console.log(window.devicePixelRatio)
            // const wrapWidth = 1920;
            const ratio = wrapWidth / resolutionWidth;
            const wrapHeight = resolutionHeight * ratio;
            this.wrapSize.width = wrapWidth*0.9;
            this.wrapSize.height = wrapHeight*0.9;

            // let video = this.$refs.video
            // video.width = resolutionWidth;
            // video.height = resolutionHeight;
            this.changeCanvasStyle();
      },
      initWrapSize(){
        const resolutionHeight = this.resolutionRatio[3].value / window.devicePixelRatio;
        const resolutionWidth = (this.resolutionRatio[3].value / window.devicePixelRatio) * this.videoRatio;
        const wrapWidth = window.screen.width*0.7;
        // const wrapWidth = 1920;
        const ratio = wrapWidth / resolutionWidth;
        const wrapHeight = resolutionHeight * ratio;
        this.wrapSize.width = wrapWidth*0.9;
        this.wrapSize.height = wrapHeight*0.9;
      },
      changeCanvasStyle() {
          let video = this.$refs.video
          video.style.width = `${this.wrapSize.width}px`;
          video.style.height = `${this.wrapSize.height}px`;
      },
      async play(){
          let that = this
          var httpURL = "http://localhost:1985/rtc/v1/play/";
          var webRTCURL = "webrtc://localhost/live/1";
          // 创建RTCPeerConnection连接对象
          that.pc = new RTCPeerConnection();
          // 创建媒体流对象
          var stream = new MediaStream();
          // 获取播放流的容器video
          // 监听流

          that.pc.ontrack = (event)=>{
            console.log("asdasdyjgvjd"+event.track.readyState)
            stream.addTrack(event.track);
            that.$refs.video.srcObject = stream;
          }
          // RTCPeerConnection方法addTransceiver()创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection关联的收发器集中。
          // 每个收发器代表一个双向流，RTCRtpSender和RTCRtpReceiver都与之相关联。
          // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
          // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
          that.pc.addTransceiver("audio", {direction: "recvonly"});
          that.pc.addTransceiver("video", {direction: "recvonly"});

          var offer =await that.pc.createOffer();
          await that.pc.setLocalDescription(offer)
          var data = {
                  "api": httpURL,
                  "streamurl":webRTCURL,
                  "sdp":offer.sdp
          }
          // SDP交换，请求SRS自带的信令服务器
          that.httpApi(httpURL,data).then(async(data)=>{
            console.log("answer",data);
            // 设置远端描述，开始连接
            await that.pc.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: data.sdp}));
          }).catch((data)=>{
            if(data.code===400){
             console.log("SDP交换失败");
            }
          });
      },
      httpApi(httpURL,data){
        var promise = new Promise((resolve,reject)=>{
            var xhr = new XMLHttpRequest();
            xhr.open('POST', httpURL, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(data));
            xhr.onload = ()=>{
                    if (xhr.readyState !== xhr.DONE) reject(xhr);
                    if (xhr.status !== 200 && xhr.status !== 201) reject(xhr) ;
                    var data = JSON.parse(xhr.responseText);
                    if(data.code===0){
                        resolve(data);
                    }else{
                        reject(data)
                    }
                }
        });
        return promise;
      },
      httpApiGet(httpURL,data){
          var promise = new Promise((resolve,reject)=>{
              var xhr = new XMLHttpRequest();
              xhr.open('get', httpURL, true);
              xhr.setRequestHeader('Content-type', 'application/json');
              xhr.send(JSON.stringify(data));
              xhr.onload = ()=>{
                      if (xhr.readyState !== xhr.DONE) reject(xhr);
                      if (xhr.status !== 200 && xhr.status !== 201) reject(xhr) ;
                      var data = JSON.parse(xhr.responseText);
                      if(data.code===0){
                          resolve(data);
                      }else{
                          reject(data)
                      }
                  }
          });
          return promise;
      },
      gotolll(){
        this.$router.push('/lll');
      },
      getVideoData(){
        //1、调用后台接口获取视频vid,playAuth(鉴权地址),cover(视频封面)的逻辑
        // 2、将对应的值分别赋值
      },
      setUserInfo(){
        store.commit('changeChatType','group');
        store.commit('setUserInfo',{name:"默认群聊",img:"http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg"});
      },
      async getCameras() {
        // console.log("设备"+navigator.mediaDevices.enumerateDevices())
        //   navigator.mediaDevices.enumerateDevices().then((devices) => {
        //     devices.forEach(device => {
        //       // if (device.kind === 'videoinput') {
        //       //   this.cameraDevices.push({ id: device.deviceId, label: device.label });
        //       // }
        //       console.log(device)
        //     });
            
        //     // // 默认选择第一个摄像头设备作为当前选项
        //     // if (this.cameraDevices.length > 0) {
        //     //   this.selectedDeviceId = this.cameraDevices[0].id;
        //     // }
        //   }).catch((error) => {
        //     console.log('Error accessing media devices', error);
        //   });
          // 1. 获取到设备授权
        await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        // 2. 获取设备列表
        navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            devices.forEach(function(device) {
                console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
            });
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
        },
    }
  }
</script>
<style scoped>
.index {
  /* overflow-x: hidden;
  overflow-y: scroll; */
  background-image: url("../assets/liveroom_bg.png");
  height: 98vh;
  width: 100%; 
  background-repeat: repeat;
  overflow: hidden;
}
.el-container {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  background: #ffffff;
  overflow-x: hidden;
}
.el-footer {
  background-color: #670F67 ;
  width: 100%;
  min-height:10vh;
  height: auto;
  border: #670F67 solid 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-main{
  width: 100%;
  height: 60vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #F2F6FC;
}.el-footer-gift{
  background-color: #FFD9E4 ;
  width: 100%;
  border: #FFD9E4 solid 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  position: relative;
  overflow: hidden;
  height: 100%;
  line-height: 0;
}
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
</style>
 