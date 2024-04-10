const fs = require('fs');  
// const videoUtils = require('./utils/video');  
// const nodeSchedule = require('node-schedule');
const path = require('path');
const rimraf = require('rimraf');  
var app = require('express')();
var http = require('http').Server(app);
var child_process = require('child_process')
var io = require('socket.io')(http, {
    allowEIO3: true,
    cors: {
        origin: "http://localhost:8081",
        methods: ["GET", "POST"],
        credentials: true
    }
});
module.exports.io = io;
let blobId = 1;
// const server = http.createServer((req, res) => {
//     res.statusCode = 200; 
//     res.setHeader('Access-Control-Allow-Origin', '*') // 允许所有的地址跨域访问        
//     res.end('Hello World');
//   });
/* 接收在线人数，传给前端，保证在线人数是最新的 */
var userList=[{
    name:'默认群聊',
    img:'https://pic1.zhimg.com/50/v2-adfacac8307b48531d4e341a6090aa03_hd.jpg?source=1940ef5c'
}];

io.on('connection', function (socket) {
    /* 监听用户登录事件,并将数据放到socket实例的属性上 */
    socket.on('login',(data,callback)=>{
        /* 遍历服务器连接对象 */
        var islogin=true;
        io.sockets.sockets.forEach(iss => {
            if(iss.name==data.name){
                islogin=false;
            }
        });
        console.log(islogin)
        if(islogin){
            // console.log('用户登录成功：',data);
            userList.push(data);
            //console.log(socket)
            socket.name=data.name;
            callback(true);
            io.emit('login',userList);
        }else{
            console.log('用户登录失败！：',data);
            callback(false);
        }
    });

    /* 监听群聊事件 */
    socket.on('groupChat',data=>{
        // 发送给所有客户端，除了发送者
        /* 修改源数据的属性 */
       // data.type='user';

        socket.broadcast.emit('updateChatMessageList',data);
    });

    /* 监听私聊事件 */
    socket.on('privateChat',data=>{
        /* 找到对应的私聊对象 */
        console.log("rose guess like  ",io.sockets.sockets)
        io.sockets.sockets.forEach(iss=>{
            if(iss.name==data.receiver){
                data.type='user';
                io.to(iss.id).emit('updateChatMessageList',data);
            }
        });
    });
    // //let p = socket.ffmpeg_process= child_process.spawn("ffmpeg",["-fflags","nobuffer","-i","-","-vcodec","libx264","-f","flv","rtmp://localhost/live/livestream"]);
    // socket.on('publishStream',(data,callback)=>{
    //     callback(true);
    // });
    // socket.on("streamData",data=>{
    //     // console.log(data.blob)
    //      let p = socket.ffmpeg_process= child_process.spawn("ffmpeg",["-fflags","nobuffer","-i","-","-vcodec","libx264","-f","flv","rtmp://localhost/live/livestream"]);
    //     p.stdin.write(data);
    // });
    /* 用户掉线 */
    socket.on('disconnect',()=>{
        /* 删除用户 */
        let index=userList.findIndex(i=>i.name==socket.name);
        if(index!=-1){
            userList.splice(index,1);
            /* 通知前端 */
            io.emit('login',userList);
        }
    });
    /* 监听直播是否开启 */
    socket.on('LiveInfo',data=>{
        socket.broadcast.emit('updateLiveInfo',data);
    });
});
// function createPeerConnection(){

// 	//如果是多人的话，在这里要创建一个新的连接.
// 	//新创建好的要放到一个map表中。
// 	//key=userid, value=peerconnection
// 	console.log('create RTCPeerConnection!');
// 	if(!pc){
// 		pc = new RTCPeerConnection(pcConfig);

// 		pc.onicecandidate = (e)=>{

// 			if(e.candidate) {
// 				sendMessage(roomid, {
// 					type: 'candidate',
// 					label:event.candidate.sdpMLineIndex, 
// 					id:event.candidate.sdpMid, 
// 					candidate: event.candidate.candidate
// 				});
// 			}else{
// 				console.log('this is the end candidate');
// 			}
// 		}
// 		pc.ontrack = getRemoteStream;
// 	}else {
// 		console.log('the pc have be created!');
// 	}

// 	return;	
// }

// //绑定永远与 peerconnection在一起，
// //所以没必要再单独做成一个函数
// function bindTracks(){

// 	console.log('bind tracks into RTCPeerConnection!');

// 	if( pc === null || localStream === undefined) {
// 		console.error('pc is null or undefined!');
// 		return;
// 	}

// 	if(localStream === null || localStream === undefined) {
// 		console.error('localstream is null or undefined!');
// 		return;
// 	}

// 	//add all track into peer connection
// 	localStream.getTracks().forEach((track)=>{
// 		pc.addTrack(track, localStream);	
// 	});

// }
http.listen(3000, function () {
    console.log('listening on *:3000');
});
