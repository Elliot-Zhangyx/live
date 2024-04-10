<template>  
    <div style="height:100vh">
        <video id="video1" autoplay ref="video1" width="640" height="480"></video>
    <video id="video2" autoplay ref="video2" width="640" height="480"></video>
    </div>
  </template>  
    
  <script>  
  export default {  
    name: 'CanvasComponent',  
    data() {
        return {
         canvas:null,
         activeEl:null,
         amyRemoteMediaStream:new MediaStream(),
         bobRemoteMediaStream:new MediaStream(),
        }
      },
    mounted() {  
      console.log("asdasdasdasdsad")
      this.init()
    },  
    methods:{
        async init(){
            console.log("asdasdasdasdsad")
            if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
                console.log('getUserMedia is not supported')
            }
            else{
                var pcAmy = new RTCPeerConnection();
                var pcBob = new RTCPeerConnection();
                pcAmy.onicecandidate=(event)=>{
                    if(event.candidate){
                        pcBob.addIceCandidate(event.candidate);
                    }
                    console.log("pcAmy.onicecandidate",event.candidate)
                }

                // pcBob.onicecandidate=(event)=>{
                //     if(event.candidate){
                //         pcAmy.addIceCandidate(event.candidate);
                //     }
                //     console.log("pcBob.onicecandidate",event.candidate)
                // }
                pcAmy.ontrack=(event)=>{
                    this.amyRemoteMediaStream.addTrack(event.track)
                    this.$refs.video1.srcObject = this.amyRemoteMediaStream
                }
                pcBob.ontrack=(event)=>{
                    this.bobRemoteMediaStream.addTrack(event.track)
                    this.$refs.video2.srcObject = this.bobRemoteMediaStream
                }
                var contraints = {
                    audio:false,
                    video:true
                }
                var stream = await navigator.mediaDevices.getUserMedia(contraints);
                this.$refs.video1.srcObject = stream
                stream.getTracks().forEach(track=>{
                    pcAmy.addTrack(track);
                    pcBob.addTrack(track);
                })

                var offerSdp = await pcAmy.createOffer();
                await pcAmy.setLocalDescription(offerSdp);
                await pcBob.setRemoteDescription(offerSdp);

                
                var answerSdp = await pcBob.createAnswer();
                await pcBob.setLocalDescription(answerSdp);
                await pcAmy.setRemoteDescription(answerSdp);

                console.log(pcAmy.localDescription)
                console.log(pcAmy.remoteDescription)
                console.log(pcBob.localDescription)
                console.log(pcBob.remoteDescription)
            }
        }
    }
  };  
  </script>  
    
  <style scoped>  
  </style>