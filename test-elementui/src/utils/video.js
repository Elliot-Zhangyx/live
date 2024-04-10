// import path from 'path';
// const { createCanvas } = require("canvas");
// const ffmepeg = require("fluent-ffmpeg");
// const moment = require("moment");
// const { spawn } = require("child_process");
// const width = 640;
// const height = 480;
// const fps = 15;
// const canvas = createCanvas(width, height);
// const ctx = canvas.getContext("2d");
export const createVideo = ({
    muted = true,
    autoplay = true,
    appendChild = false,
    show = false,
    controls = false,
    size = 100,
  }) => {
    const videoEl = document.createElement('video');
    videoEl.autoplay = autoplay;
    videoEl.muted = muted;
    videoEl.playsInline = true;
    videoEl.loop = true;
    videoEl.controls = controls;
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('x5-video-player-type', 'h5');
    videoEl.setAttribute('x5-video-player-fullscreen', 'true');
    videoEl.setAttribute('x5-video-orientation', 'portraint');
    videoEl.oncontextmenu = (e) => {
      e.preventDefault();
    };
    if (appendChild) {
      if (!show) {
        videoEl.style.width = `1px`;
        videoEl.style.height = `1px`;
        videoEl.style.opacity = '0';
        videoEl.style.pointerEvents = 'none';
      } else {
        videoEl.style.width = `${size}px`;
        videoEl.style.height = `${size}px`;
      }
      videoEl.style.position = 'fixed';
      videoEl.style.bottom = '0';
      videoEl.style.right = '0';
  
      document.body.appendChild(videoEl);
    }
    return videoEl;
  };
  export const handleDisplayMedia = async ({ video, audio }) =>{
    try {
      const event = await navigator.mediaDevices.getDisplayMedia({
        video:video,
        audio:audio,
      });
      return event;
    } catch (error) {
      console.log(error);
    }
  };
  export const handleUserMedia = async ({ video, audio })=>{
    try {
      const event = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });
      return event;
    } catch (error) {
      console.log(error);
    }
  };
// const appDir = process.cwd();
// export const resolveApp = (relativePath) => {
//   return path.join(appDir, relativePath);
// };
// export const timeToLive = async () => {
//   const cmd = ffmepeg()
//     .input('pipe:0')
//     .inputFPS(fps)
//     .videoCodec('libx264')
//     .size(`${width}x${height}`)
//     .format('image2pipe')
//     .output('rtmp://localhost/live/livestream')  // 可以使用 B 站直播姬获取第三方推流地址
//     .outputOptions([
//       '-f flv',
//       '-b:v 500k',
//       '-preset ultrafast',
//     ]);

//   cmd.run();

//   cmd.on('error', (err) => {
//     console.log(`An error occurred: ${err.message}`);
//   });

//   cmd.on('end', () => {
//     console.log('Processing finished !');
//   });

//   cmd.on('start', async (commandLine) => {
//     console.log(`Spawned Ffmpeg with command: ${commandLine}`);

//     const args = commandLine.split(' ').slice(1);
//     const process = spawn('ffmpeg', args, {
//       stdio: ['pipe', 'pipe', 'pipe'],
//       detached: true,
//     });
//     process.on("exit", (code, signal) => {
//       console.log(`child process exited with code ${code} and signal ${signal}`);
//       if (process.stdin) {
//         process.stdin.end();
//       }
//       if (process.stdout) {
//         process.stdout.destroy();
//       }
//       if (process.stderr) {
//         process.stderr.destroy();
//       }
//       if (!process.killed) {
//         process.kill();
//       }
//     });
    
//     process.stderr.on("data", (data) => {
//       console.log(`stderr: ${data}`);
//     });
    
//     const sendFrame = async () => {
//       generateFrame();
    
//       const stream = canvas.createPNGStream();
    
//       stream.pipe(process.stdin, { end: false });
    
//       await new Promise((resolve) => setTimeout(resolve, 1000 / (fps / 2)));
//       sendFrame();
//     };
//     sendFrame();
//   });
// }
// export const generateFrame = () => {
//   const time = moment().format("YYYY-MM-DD HH:mm:ss");
//   const text = `Live: ${time}`;
//   ctx.clearRect(0, 0, width, height);
//   ctx.fillStyle = "white";
//   ctx.font = "30px Arial";
//   ctx.fillText(text, 10, height / 2);
// };
// export const startLive = (data) => {
//   const msrDelay = 1000;
//   const msrMaxDelay = 5000; // 值越大，延迟越高，但抗网络抖动越强
//   if (msrDelay > 1000 * 5 || !Number.isInteger(msrDelay / 1000)) {
//     console.log(chalkERROR('msrDelay错误！'));
//     return;
//   }
//   // 假设每个webm是1秒钟，转码成mp4需要翻三倍时间，即3秒。因此msrMaxDelay不能小于这个翻倍间隔
//   if (
//     msrMaxDelay < msrDelay * 3 ||
//     !Number.isInteger(msrMaxDelay / 1000)
//   ) {
//     console.log(chalkERROR('msrMaxDelay错误！'));
//     return;
//   }
//   const roomDir = path.resolve(WEBM_DIR);
//   const fileDir = `${roomDir}/file`;
//   const fileResDir = `${fileDir}/res`;
//   const txtFile = `${roomDir}/list.txt`;
//   console.log('收到主播开始msr直播，删除直播间的webm目录');
//   if (fs.existsSync(roomDir)) {
//     rimrafSync(roomDir);
//   }
//   let str = '';
//   const allTime = 1000 * 60 * 60 * 24; // 24小时对应的毫秒数
//   for (let i = 1; i <= allTime / msrDelay; i += 1) {
//     str += `${i !== 1 ? '\n' : ''}file '${fileResDir}/${i}.mp4'`;
//   }
//   if (!fs.existsSync(WEBM_DIR)) {
//     fs.mkdirSync(WEBM_DIR);
//   }
//   if (!fs.existsSync(roomDir)) {
//     fs.mkdirSync(roomDir);
//   }
//   if (!fs.existsSync(fileDir)) {
//     fs.mkdirSync(fileDir);
//   }
//   if (!fs.existsSync(fileResDir)) {
//     fs.mkdirSync(fileResDir);
//   }

//   fs.writeFileSync(txtFile, str);
//   // const timer = setTimeout(() => {
//   //   startBlobIsExistSchedule({
//   //     roomId,
//   //     msrDelay: data.data.msrDelay,
//   //     msrMaxDelay: data.data.msrMaxDelay,
//   //   });
//   //   clearTimeout(timer);
//   // }, msrMaxDelay / 2);
//   const timer1 = setTimeout(() => {
//     mp4PushRtmp({
//       txt: txtFile,
//       rtmpUrl: 'rtmp://localhost/live/livestream'
//     });
//     clearTimeout(timer1);
//   }, msrMaxDelay);
// };