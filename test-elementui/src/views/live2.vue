<template>
    <div>
        <!-- <el-button @click="pushStream">开始直播</el-button> -->
        <video id="video" class="videos" autoplay muted controls width="640" height="480" ref="videoRef"></video>
        <!-- <canvas ref="myCanvas" width="500" height="200"></canvas> -->
        <canvas id="canvas" ref="canvas" style="border: 1px solid yellow;"></canvas>

        <video id="video2" autoplay muted controls width="800" height="600" ref="video"></video>
        <video id="player" class="videos" autoplay muted controls width="640" height="360" ref="player"></video>
        <img id="img" ref="img" width="100" height="100" style="width:100px;height:100px" src="../../public/img/the_eras_tour.jpeg" alt="网络不好"/>
    </div>  
  </template>
  
  <script>
  import { fabric } from "fabric"
    export default {
      data() {
        return {
        }
      },
      mounted() {
        // this.pushStream();
        // this.drawText()
        this.initCanvas()
      },
      created() {

        // this.getVideoData()
      },
      methods: {
        async pushStream2(stream){
          /* 连接socket */
          this.$socket.connect();
          let that = this
           this.$socket.emit("publishStream",{},function(result){
              if(result){
                  let mr = new MediaRecorder(stream);
                  mr.ondataavailable = async function(e){
                    // p.stdin.write(NodeBuffer.from(await e.data.arrayBuffer()))
                    that.$socket.emit("streamData",e.data)
                  }
                  mr.start(40);
              }
           })
        },
        async initCanvas(){
          var videoplay = this.$refs.player;
            // 3. 设置画布参数
            const canvas = this.canvas = new fabric.Canvas('canvas', {
                width: '1920', // 画布宽度
                height: '1080', // 画布高度
                backgroundColor: '#eee' // 画布背景色
            })
            var videoEl = this.$refs.videoRef;
            var video1 = new fabric.Image(videoEl, {
              // width:'800',
              // height:'600',
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            });
            canvas.add(video1);

            video1.getElement().play().catch((err)=>{
              console.log(err)
            });

            var videoplayers = new fabric.Image(videoplay, {
              // width:'800',
              // height:'600',
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            });

            canvas.add(videoplayers);

            videoplayers.getElement().play().catch((err)=>{
              console.log(err)
            });




            //下面是摄像头相关内容
            if (navigator.mediaDevices === undefined) {
              navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
              navigator.mediaDevices.getUserMedia = function(constraints) {
                var getUserMedia =
                  navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia ||
                  navigator.msGetUserMedia;
                if (!getUserMedia) {
                  return Promise.reject(
                    new Error('getUserMedia is not implemented in this browser')
                  );
                }
                return new Promise(function(resolve, reject) {
                  getUserMedia.call(navigator, constraints, resolve, reject);
                });
              };
            }
            navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function getWebcamAllowed(localMediaStream) {
                videoEl.srcObject = localMediaStream;
                canvas.add(video1);
                video1.moveTo(0);
                video1.getElement().play();

            })
            .catch(function getWebcamAllowed(e) {});


            var text = new fabric.Text('Hello, Fabric.js!', {  
              left: 50,  
              top: 50,  
              fill: 'black',  
              fontSize: 30,  
              fontFamily: 'Arial'  
            });  
            canvas.add(text);
            // 引入图片，或者页面上已经渲染的图片
            const img = this.$refs.img
            let imgInstance = new fabric.Image(img,{
                  // left: 0,  
                  // top: 0,  
                  // angle: 0,  
                  // opacity: 1,  
                  // scaleX: 1,  
                  // scaleY: 1  
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            })
            canvas.add(imgInstance)





            if(!navigator.mediaDevices ||
              !navigator.mediaDevices.getDisplayMedia){
              console.log('getDisplayMedia is not supported!');
              return;
            }else{
              var constraints = {
                video : {
                  width: 640,	
                  height: 480,
                  frameRate:15
                }, 
                audio : false 
              }
              navigator.mediaDevices.getDisplayMedia(constraints)
                .then(function getWebcamAllowed(localMediaStream) {
                videoplay.srcObject = localMediaStream;
                canvas.add(videoplayers);
                videoplayers.moveTo(0);
                videoplayers.getElement().play();

            })
            .catch(function getWebcamAllowed(e) {});
            }
            fabric.util.requestAnimFrame(function render() {
              canvas.renderAll();
              fabric.util.requestAnimFrame(render);
            });
          

            const videoRef = this.$refs.video;
            if(!videoRef) return;
            videoRef.srcObject = this.$refs.canvas.captureStream();
            let that = this
            // this.$socket.connect();
            // this.$socket.emit("publishStream",{},function(result){
            //   if(result){
            //     let mr = new MediaRecorder(that.$refs.canvas.captureStream());
            //       mr.ondataavailable = async function(e){
            //         // p.stdin.write(NodeBuffer.from(await e.data.arrayBuffer()))
                    
            //         that.$socket.emit("streamData",e.data)
            //       }
            //       mr.start(40);
            //   }
            // })
            this.pushStream2(that.$refs.canvas.captureStream())
        },
        gotMediaStream(stream){
          var videoplay = this.$refs.player;
          window.stream = stream;
          videoplay.srcObject = stream;
        },
        start() {
        },
        handleError(err){
            console.log('getUserMedia error:', err);
        },
        async initCanvas(){
          var videoplay = this.$refs.player;
            // 3. 设置画布参数
            const canvas = this.canvas = new fabric.Canvas('canvas', {
                width: '1920', // 画布宽度
                height: '1080', // 画布高度
                backgroundColor: '#eee' // 画布背景色
            })
            var videoEl = this.$refs.videoRef;
            var video1 = new fabric.Image(videoEl, {
              // width:'800',
              // height:'600',
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            });
            canvas.add(video1);

            video1.getElement().play().catch((err)=>{
              console.log(err)
            });

            var videoplayers = new fabric.Image(videoplay, {
              // width:'800',
              // height:'600',
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            });

            canvas.add(videoplayers);

            videoplayers.getElement().play().catch((err)=>{
              console.log(err)
            });




            //下面是摄像头相关内容
            if (navigator.mediaDevices === undefined) {
              navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
              navigator.mediaDevices.getUserMedia = function(constraints) {
                var getUserMedia =
                  navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia ||
                  navigator.msGetUserMedia;
                if (!getUserMedia) {
                  return Promise.reject(
                    new Error('getUserMedia is not implemented in this browser')
                  );
                }
                return new Promise(function(resolve, reject) {
                  getUserMedia.call(navigator, constraints, resolve, reject);
                });
              };
            }
            navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function getWebcamAllowed(localMediaStream) {
                videoEl.srcObject = localMediaStream;
                canvas.add(video1);
                video1.moveTo(0);
                video1.getElement().play();

            })
            .catch(function getWebcamAllowed(e) {});


            var text = new fabric.Text('Hello, Fabric.js!', {  
              left: 50,  
              top: 50,  
              fill: 'black',  
              fontSize: 30,  
              fontFamily: 'Arial'  
            });  
            canvas.add(text);
            // 引入图片，或者页面上已经渲染的图片
            const img = this.$refs.img
            let imgInstance = new fabric.Image(img,{
                  // left: 0,  
                  // top: 0,  
                  // angle: 0,  
                  // opacity: 1,  
                  // scaleX: 1,  
                  // scaleY: 1  
              left: 200,
              top: 300,
              // angle: -15,
              originX: 'center',
              originY: 'center',
              objectCaching: false
            })
            canvas.add(imgInstance)





            if(!navigator.mediaDevices ||
              !navigator.mediaDevices.getDisplayMedia){
              console.log('getDisplayMedia is not supported!');
              return;
            }else{
              var constraints = {
                video : {
                  width: 640,	
                  height: 480,
                  frameRate:15
                }, 
                audio : false 
              }
              navigator.mediaDevices.getDisplayMedia(constraints)
                .then(function getWebcamAllowed(localMediaStream) {
                videoplay.srcObject = localMediaStream;
                canvas.add(videoplayers);
                videoplayers.moveTo(0);
                videoplayers.getElement().play();

            })
            .catch(function getWebcamAllowed(e) {});
            }
            fabric.util.requestAnimFrame(function render() {
              canvas.renderAll();
              fabric.util.requestAnimFrame(render);
            });
          

            const videoRef = this.$refs.video;
            if(!videoRef) return;
            videoRef.srcObject = this.$refs.canvas.captureStream();
            let that = this
            // this.$socket.connect();
            // this.$socket.emit("publishStream",{},function(result){
            //   if(result){
            //     let mr = new MediaRecorder(that.$refs.canvas.captureStream());
            //       mr.ondataavailable = async function(e){
            //         // p.stdin.write(NodeBuffer.from(await e.data.arrayBuffer()))
                    
            //         that.$socket.emit("streamData",e.data)
            //       }
            //       mr.start(40);
            //   }
            // })
            this.pushStream2(that.$refs.canvas.captureStream())






            // 圆角矩形
            // const rect = new fabric.Rect({
            //     top: 300, // 距离容器顶部 300px
            //     left: 300, // 距离容器左侧 300px
            //     fill: 'orange', // 填充 橙色
            //     width: 100, // 宽度 100px
            //     height: 100, // 高度 100px
            //     originX:'left', // 原点
            //     originY:'center', //原点
            //     lockScalingFlip: true, //锁定翻转，及可不可以拉到边的负值
            //     rx: 20, // x轴的半径
            //     ry: 20 // y轴的半径
            // })

            // // 将矩形添加到画布中
            // canvas.add(rect) 
            // fabric.Image.fromURL('http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg', (img) => {
            //   img.set({
            //       left: 100, // 图片相对画布的左侧距离
            //       top: 100, // 图片相对画布的顶部距离
            //       angle: 30, // 图片旋转角度
            //       opacity: 0.85, // 图片透明度
            //       // 这里可以通过scaleX和scaleY来设置图片绘制后的大小，这里为原来大小的一半
            //       scaleX: 0.5, 
            //       scaleY: 0.5
            //   });
            //   // 添加对象
            //   canvas.add(img);
            // });


            // 添加图片 import 或者 require 都行，但 '../../..' 引路径好像不行，在线的没试过
            // import logo from '@/assets/logo.png' // 引入图片      
            // fabric.Image.fromURL("http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg", oImg => {
            //     oImg.scale(0.5) // 缩放
            //     oImg.set({
            //     left:50,
            //     top:50
            //     })
            //     canvas.add(oImg) // 将图片加入到画布
            // })
             // 获取摄像头视频流  
          
            // 获取摄像头访问权限  
            // let that = this
            // navigator.mediaDevices.getUserMedia({ video: true })  
            // .then(function(stream) {  
            //   // 创建 video 元素并设置视频流  
            //   var video = document.getElementById('video');  
            //   video.srcObject = stream;  
            //   // 创建canvas
            //   const canvas = document.getElementById("canvas");
            //   const cvsWidth = canvas.width;
            //   const cvsHeight = canvas.height;
            //   const ctx = canvas.getContext("2d");

            //   // 使用requestAnimationFrame定时器实现canvas绘制video每一帧
            //   const videoRender = () => {
            //     window.requestAnimationFrame(videoRender);
            //     ctx.clearRect(0, 0, cvsWidth, cvsHeight);
            //     ctx.drawImage(video, 0, 0, cvsWidth, cvsHeight);
            //   };
            //   videoRender();
            // })  
            // .catch(function(err) {  
            //   console.error('Error accessing the camera: ', err);  
            // });  


            // // 监听鼠标滚轮事件
            // canvas.on('mouse:wheel', opt => {
            //     let delta = opt.e.deltaY // 滚轮向上滚一下是 -100，向下滚一下是 100
            //     let zoom = canvas.getZoom() // 获取画布当前缩放值

            //     // 控制缩放范围在 0.01~20 的区间内
            //     zoom *= 0.999 ** delta
            //     if (zoom > 20) zoom = 20
            //     if (zoom < 0.01) zoom = 0.01

            //     // 设置画布缩放比例
            //     canvas.setZoom(zoom)
            // })

            // // 监听鼠标滚轮事件
            // canvas.on('mouse:wheel', opt => {
            //     let delta = opt.e.deltaY // 滚轮向上滚一下是 -100，向下滚一下是 100
            //     let zoom = canvas.getZoom() // 获取画布当前缩放值

            //     // 控制缩放范围在 0.01~20 的区间内
            //     zoom *= 0.999 ** delta
            //     if (zoom > 20) zoom = 20
            //     if (zoom < 0.01) zoom = 0.01

            //     canvas.zoomToPoint(
            //     {
            //         x: opt.e.offsetX, // 鼠标x轴坐标
            //         y: opt.e.offsetY  // 鼠标y轴坐标
            //     },
            //     zoom // 最后要缩放的值
            //     )
            // })

            // canvas.on({
            //     "mouse:down": (e) => {
            //         this.panning = true;
            //         canvas.selection = false;
            //     },
            //     "mouse:up": (e) => {
            //         this.panning = false;
            //         canvas.selection = true;
            //     },
            //     "mouse:move": (e) => {
            //         if (this.panning && e && e.e) {
            //         let delta = new fabric.Point(e.e.movementX, e.e.movementY);// e.e.movementX 移动时画布的横向相对偏移量
            //         canvas.relativePan(delta);
            //         }
            //     }

            // })

        },
        drawText() {  
            const canvas = this.$refs.myCanvas;  
            const ctx = canvas.getContext('2d');  
        
            // 设置文字样式  
            ctx.font = '30px Arial';  
            ctx.fillStyle = 'black';  
            ctx.textAlign = 'center';  
            ctx.textBaseline = 'middle';  
        
            // 绘制文字  
            // ctx.fillText('Hello, Canvas!', canvas.width / 2, canvas.height / 2);  
            setInterval(()=>{
                this.clearCanvas();
                ctx.fillText(new Date(), canvas.width / 2, canvas.height / 2);  
            },500)

            const videoRef = this.$refs.videoRef;
            if(!videoRef) return;
            videoRef.srcObject = canvas.captureStream();
        },
        clearCanvas(){
            const canvas = this.$refs.myCanvas;  
            const ctx = canvas.getContext('2d'); 
            if(!ctx || !canvas) return; 
            ctx.clearRect(0,0,canvas.width,canvas.height);
        },
        async pushStream(){
          /* 连接socket */
          this.$socket.connect();
          let stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
          this.$refs.pushVideo.srcObject = stream
          let that = this
           this.$socket.emit("publishStream",{},function(result){
              if(result){
                  let mr = new MediaRecorder(stream);
                  mr.ondataavailable = async function(e){
                    // p.stdin.write(NodeBuffer.from(await e.data.arrayBuffer()))
                    that.$socket.emit("streamData",e.data)
                  }
                  mr.start(40);
              }
           })
        }
      }
    }
  </script>
  <style scoped>  
  canvas {  
    border: 1px solid #d3d3d3;  
  }  
  .videos {
    display: none;
    object-fit:fill;
  }
  </style>