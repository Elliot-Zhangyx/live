<template>
    <!-- <div class="index">
        <el-container style="height: 100vh;">
            <el-header>
                    <div class="header-div-class"> -->
                      <!-- <header/> -->
<!--                       
                       <el-button @click="gotoLive">我要直播</el-button>
                    </div>
            </el-header>
            <el-main>
              <el-dialog
                title="请选择设备"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <span> -->
                  
                  <!-- <el-button v-for="(item, index) in cameras" :key="index">{{item}}</el-button> -->
                  <!-- <el-radio  v-for="(item, index) in cameras" :key="index" label="1" border>{{item}}</el-radio> -->
                  <!-- <el-radio-group style="width: 100%;" v-model="camera" >
                    <el-radio style="width: 100%;margin: auto 0;" v-for="(item, index) in cameras" :key="index" :label="item" border>{{item}}</el-radio>
                  </el-radio-group>
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="liveCamera">确 定</el-button>
                </span>
              </el-dialog>
              <el-button type="text" @click="getCameras">点击打开 Dialog</el-button>
              <el-button @click="getCameras" style="z-index: 1;position: absolute;top: 50%;left: 50%;">查看设备</el-button> -->
              <!-- <div style="display: flex;height:100%">
                <div style="flex: 1;height: 100%;padding: 20px;">
                  <ali-player
                        :useFlashPrism="false" 
                        :autoplay="true" 
                        :isLive="true" 
                        :rePlay="false"
                        :showBuffer="true"
                        showBarTime="5000"
                        width="100%" 
                        height="100%" 
                        controlBarVisibility="always"
                        :rtmpBufferTime="0"
                        source="http://localhost:8080/live/livestream.flv" >
                      </ali-player>

                </div>
                <div style="flex: 1;height: 100%;padding: 20px;">
                  <ali-player
                        :useFlashPrism="false" 
                        :autoplay="true" 
                        :isLive="true" 
                        :rePlay="false"
                        :showBuffer="true"
                        showBarTime="5000"
                        width="100%" 
                        height="100%" 
                        controlBarVisibility="always"
                        :rtmpBufferTime="0"
                        source="http://localhost:8080/live/livestream.flv" >
                      </ali-player>
                </div>
                        

              </div> -->
            <!-- <el-row style="width:100%;height:100%">
                <el-col v-for="item in liveRoomList" :span="6">
                    <el-card v-if="item.publish.active" :body-style="{ padding: '0px' }" style="height: 100%;width: 70%;text-align: center;">
                      <ali-player
                        :options="options"
                        :source="'http://localhost:8080'+item.url+'.flv'"
                        >
                      </ali-player>
                      <p>the_eras_tour</p>
                    </el-card>
                    
                </el-col> -->
                <!-- <el-col :span="6">
                    <el-card :body-style="{ padding: '0px' }" style="height: 100%;width: 70%;text-align: center;">
                      <ali-player
                        :useFlashPrism="false" 
                        :autoplay="true" 
                        :isLive="true" 
                        :rePlay="false"
                        :showBuffer="true"
                        showBarTime="5000"
                        width="100%" 
                        height="100%" 
                        controlBarVisibility="always"
                        :rtmpBufferTime="0"
                        source="http://localhost:8080/live/livestream.flv" >
                      </ali-player>
                      <p>the_eras_tour</p>
                    </el-card>
                    
                </el-col> -->
            <!-- </el-row>
            </el-main>
            <el-footer>
                    <div class="el-footer">
                      <span class="footer-span">&copy; Darcy</span>
                    </div>
            </el-footer>
        </el-container>     -->
  
      <!-- </div>   -->
  </template>
  
  <script>
    export default {
      data() {
        return {
          camera: '',
          liveRoomList:[],
          dialogVisible:false,
          cameras:[],
            /**
          *  对aliplayer进行配置
          * **/
          vid:'pc_jPrismPlayer',
          source:"http://localhost:8080/live/livestream.flv",
          //vue-aliplayer-v2提供配置器为options， 所有配置项必须在options，否则无法正常显示
          options:{
              //  width: '100%',                //播放器宽度
              //  height: '100%',              //播放器高度
              //  useFlashPrism:false,
              //  isLive: true,                //播放内容是否为直播，直播时会禁止用户拖动进度条。
              // //  playsinline:true,             //H5 是否内置播放
              // //  useH5Prism:true,              //指定使用 H5 播放器。
              // //  rePlay:true,                 //播放器自动循环播放.
              // //  preload:true,                 //播放器自动加载，目前仅 h5 可用。
              //  controlBarVisibility:'click', //控制面板的实现，默认为‘hover’。可选的值为：‘click’、‘hover’、‘always’。
              //  autoplay:true,               //播放器是否自动播放，在移动端 autoplay 属性会失效。Safari11 不会自动开启自动播放如何开启。
              //  enableSystemMenu:true,        //是否允许系统右键菜单显示，默认为 false。
              //  loadDataTimeout:5,            //缓冲多长时间后，提示用户切换低清晰度，默认：20 秒。
              //  showBarTime:'10000',          //控制栏自动隐藏时间（ms）。
              //  cover:'../../public/img/the_eras_tour.jpeg',         //播放器默认封面图片，请填写正确的图片 url 地址。需要 autoplay 为’false’时，才生效。Flash 播放器封面也需要开启允许跨域访问。
              //  disableSeek:true,            //禁用进度条的 Seek，默认为 false，仅 Flash 支持。
              // source:"http://localhost:8080/live/livestream.flv",
              // rtmpBufferTime:0,
              // showBuffer:true,
              cover: 'http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg',
              /* To set an album art, you must set 'autoplay' and 'preload' to 'false' */
              autoplay: true,
              preload: true,
              isLive: true,
              rePlay: false,
              playsinline: true,
              controlBarVisibility: "hover",
              useH5Prism: true,
              "skinLayout": [
                {
                  "name": "bigPlayButton",
                  "align": "blabs",
                  "x": 30,
                  "y": 80
                },
                {
                  "name": "errorDisplay",
                  "align": "tlabs",
                  "x": 0,
                  "y": 0
                },
                {
                  "name": "infoDisplay"
                },
                {
                  "name": "controlBar",
                  "align": "blabs",
                  "x": 0,
                  "y": 0,
                  "children": [
                    {
                      "name": "liveDisplay",
                      "align": "tlabs",
                      "x": 15,
                      "y": 6
                    },
                    {
                      "name": "fullScreenButton",
                      "align": "tr",
                      "x": 10,
                      "y": 10
                    },
                    {
                      "name": "subtitle",
                      "align": "tr",
                      "x": 15,
                      "y": 12
                    },
                    {
                      "name": "volume",
                      "align": "tr",
                      "x": 5,
                      "y": 10
                    }
                  ]
                }
              ]
             }
       }
      },
      created() {
        this.getVideoData()
      },
      computed:{
        playsinline () {
          // 播放之后关闭静音
          return this.isIos();
        },
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
      methods: {
        gotoLive(){
          this.$router.push('/live'); 
        },
        liveCamera(){
          console.log(this.camera)
           
          // this.dialogVisible = false
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
        },
        //播放回调
        onPlayerPlay (player) {
            console.log("player play!", player);
            this.title = false
        },
        gotolll(){
          this.$router.push('/lll');
        },
        getVideoData(){
          //1、调用后台接口获取视频vid,playAuth(鉴权地址),cover(视频封面)的逻辑
          // 2、将对应的值分别赋值
          //请求分页查询数据
          this.request.get("http://localhost:1985/api/v1/streams").then(res=>{
              console.log(res.streams)
              this.liveRoomList = res.streams
              // this.total = res.data.total
          })
        },
        async getCameras() {
          let that = this
          let cameraList = []
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
              if(device.kind==="videoinput"){
                cameraList.push(device.label)
              }
                // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                console.log(device);
            });
            that.cameras = cameraList
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
        that.dialogVisible = true
        },
      }
    }
  </script>
  <style scoped>
  .index {
    height:100vh ;/*height可以根据你要创建的页面进行修改*/
    /* overflow-x: hidden;
    overflow-y: scroll; */
  }
  ::v-deep .el-radio__input {
    display: none;
  }
  </style>
   