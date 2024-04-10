// import { getRandomString } from 'billd-utils';
// import { ref } from 'vue';

// import { fetchRtcV1Publish } from '@/api/srs';
// import { SRS_CB_URL_PARAMS } from '@/constant';
// import { useRTCParams } from '@/hooks/use-rtcParams';
// import { useNetworkStore } from '@/store/network';
// import { useUserStore } from '@/store/user';
// import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
// import { WebRTCClass } from './webRTC';

// export const useWebRtcSrs = () => {
//   const userStore = useUserStore();
//   const networkStore = useNetworkStore();

//   const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
//   const currentMaxBitrate = ref(maxBitrate.value[3].value);
//   const currentMaxFramerate = ref(maxFramerate.value[2].value);
//   const currentResolutionRatio = ref(resolutionRatio.value[3].value);
//   const isPk = false;
//   const roomId = '';
//   const canvasVideoStream = null;

//   function updateWebRtcSrsConfig(data) {
//     isPk = data.isPk;
//     roomId = data.roomId;
//     canvasVideoStream.value = data.canvasVideoStream;
//   }

//   const webRtcSrs = {
//     newWebRtc: (data) => {
//       return new WebRTCClass({
//         maxBitrate: currentMaxBitrate.value,
//         maxFramerate: currentMaxFramerate.value,
//         resolutionRatio: currentResolutionRatio.value,
//         isSRS: true,
//         roomId: roomId.value,
//         videoEl: data.videoEl,
//         sender: data.sender,
//         receiver: data.receiver,
//       });
//     },
//     /**
//      * 主播发offer给观众
//      */
//     sendOffer: async ({
//       sender,
//       receiver,
//     }) => {
//       console.log('开始webRtcSrs的sendOffer', {
//         sender,
//         receiver,
//       });
//       try {
//         const ws = networkStore.wsMap.get(roomId.value);
//         if (!ws) return;
//         const rtc = networkStore.rtcMap.get(receiver);
//         if (rtc) {
//           canvasVideoStream.value.getTracks().forEach((track) => {
//             if (canvasVideoStream.value) {
//               console.log(
//                 'webRtcSrs的canvasVideoStream插入track',
//                 track.kind,
//                 track
//               );
//               rtc.peerConnection?.addTrack(track, canvasVideoStream.value);
//             }
//           });
//           const offerSdp = await rtc.createOffer();
//           if (!offerSdp) {
//             console.error('webRtcSrs的offerSdp为空');
//             window.$message.error('webRtcSrs的offerSdp为空');
//             return;
//           }
//           await rtc.setLocalDescription(offerSdp);
//           const liveRooms = userStore.userInfo.live_rooms;
//           const myLiveRoom = liveRooms[0];
//           if (!myLiveRoom) {
//             window.$message.error('你没有开通直播间');
//             return;
//           }
//           const answerRes = await fetchRtcV1Publish({
//             api: `/rtc/v1/publish/`,
//             clientip: null,
//             sdp: offerSdp.sdp,
//             streamurl: `${myLiveRoom.rtmp_url}?${
//               SRS_CB_URL_PARAMS.publishKey
//             }=${myLiveRoom.key}&${SRS_CB_URL_PARAMS.publishType}=${
//               isPk.value ? LiveRoomTypeEnum.pk : LiveRoomTypeEnum.srs
//             }`,
//             tid: getRandomString(10),
//           });
//           if (answerRes.data.code !== 0) {
//             console.error('/rtc/v1/publish/拿不到sdp');
//             window.$message.error('/rtc/v1/publish/拿不到sdp');
//             return;
//           }
//           await rtc.setRemoteDescription(
//             new RTCSessionDescription({
//               type: 'answer',
//               sdp: answerRes.data.sdp,
//             })
//           );
//         } else {
//           console.error('rtc不存在');
//         }
//       } catch (error) {
//         console.error('webRtcSrs的sendOffer错误');
//       }
//     },
//   };

//   return { updateWebRtcSrsConfig, webRtcSrs };
// };
