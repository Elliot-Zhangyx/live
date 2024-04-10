// // store.js  
// import Vue from 'vue';  
// import Vuex from 'vuex';  
  
// Vue.use(Vuex);  
  
// export default new Vuex.Store({  
//   state: {  
//     wsMap: new Map(),  
//     rtcMap: new Map(),  
//   },  
//   mutations: {  
//     UPDATE_WS_MAP(state, { roomId, arg }) {  
//       const val = state.wsMap.get(roomId);  
//       if (val) {  
//         state.wsMap.set(roomId, { ...val, ...arg });  
//       } else {  
//         state.wsMap.set(roomId, arg);  
//       }  
//     },  
//     REMOVE_WS(state, roomId) {  
//       const old = state.wsMap.get(roomId);  
//       if (old) {  
//         old.close();  
//       }  
//       state.wsMap.delete(roomId);  
//     },  
//     UPDATE_RTC_MAP(state, { socketId, arg }) {  
//       const val = state.rtcMap.get(socketId);  
//       if (val) {  
//         state.rtcMap.set(socketId, { ...val, ...arg });  
//       } else {  
//         state.rtcMap.set(socketId, arg);  
//       }  
//     },  
//     REMOVE_RTC(state, socketId) {  
//       const old = state.rtcMap.get(socketId);  
//       if (old) {  
//         old.close();  
//       }  
//       state.rtcMap.delete(socketId);  
//     },  
//   },  
//   actions: {  
//     updateWsMap({ commit }, { roomId, arg }) {  
//       commit('UPDATE_WS_MAP', { roomId, arg });  
//     },  
//     removeWs({ commit }, roomId) {  
//       commit('REMOVE_WS', roomId);  
//     },  
//     updateRtcMap({ commit }, { socketId, arg }) {  
//       commit('UPDATE_RTC_MAP', { socketId, arg });  
//     },  
//     removeRtc({ commit }, socketId) {  
//       commit('REMOVE_RTC', socketId);  
//     },  
//   },  
// });