<template>
    <div class="page">
      <div style="position: absolute;top: 50%;  left: 50%;transform: translate(-50%, -50%);display: flex;">
        <el-card :body-style="{ padding: '0px'}" style="background-color: rgba(255,255,255,0.9);">
                <div slot="header" style="display:flex;align-items: center;">
                        <div style="flex:8">
                          <span>素材添加</span>
                          <el-button style="margin-left: 20px;" @click="dialogVisibleCamera = true">摄像头</el-button>
                          <el-button @click="dialogVisibleMicrophone = true">麦克风</el-button>
                          <el-button @click="dialogVisibleImg = true">图片</el-button>
                          <el-button @click="dialogVisibleText = true">文字</el-button>
                          <el-button @click="dialogVisibleScreen = true">共享屏幕</el-button>
                          <el-button @click="dialogVisibleMedia = true">多媒体</el-button>
                        </div>
                        <div style="flex:1">
                          <el-button v-if="!isRecord" type="danger" @click="handleRecordMedia" style="float: right;margin-right: 5%;align-items:center;align-content:center;justify-items:center;">
                              <div style="display:flex;align-items:center;align-content:center;justify-items:center;">
                                <img src="../assets/screen_record.png" style="width:16px;flex:1" />
                                <span style="flex:1;color:white;margin-left:5px">我要录屏</span>
                              </div>
                            </el-button>
                            <el-button v-else type="danger" @click="closeRecordMedia" style="float: right;margin-right: 5%;align-items:center;align-content:center;justify-items:center;">
                              <div style="display:flex;align-items:center;align-content:center;justify-items:center;">
                                <img src="../assets/screen_record.png" style="width:16px;flex:1" />
                                <span style="flex:1;color:white;margin-left:5px">结束录制</span>
                              </div>
                            </el-button>
                        </div>
                </div>
                        <div ref="containerRef" class="container">
                          
                          <canvas id="canvas" ref="canvas"></canvas>
                        </div>
                        <div style="display:flex;align-items: center;padding:10px;">
                          <div style="flex:2;font-size: 14px;float: left;">
                            <div style="display: flex;align-items: center;justify-items: center;align-content: center;">
                              <img src="http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg" alt="" style="width: 50px;border-radius: 50%;"/>
                              <div v-if="!editTitle" style="margin-left: 10px;">
                                <span style="font-size: 15px;">{{ liveRoomTitle }}</span>
                                <i style="color: #f69;cursor:pointer;margin-left: 10px;" class="el-icon-edit" @click="editTitle = true"></i>
                              </div>
                              <div v-else style="margin-left: 10px;font-size: 0px;">
                                <el-input style="width: 60%;"  size="small" maxlength="20" show-word-limit placeholder="请输入内容" v-model="liveRoomTitle"></el-input>
                                <el-button size="small" style="background-color: #f69;color: white;margin:0;">确定</el-button>
                                <el-button size="small" @click="editTitle = false;" style="margin:0;">取消</el-button>
                              </div>
                            </div>
                          </div>
                          <div style="flex:1;font-size: 14px;">
                            <span>码率设置:</span>
                            <el-select size="small" style="font-size: 14px;margin-left: 10px;width: 50%;" v-model="codeRateValue" placeholder="请选择">
                              <el-option
                                v-for="item in fontTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div style="flex:1;font-size: 14px;">
                            <span>帧率设置:</span>
                            <el-select size="small" style="font-size: 14px;margin-left: 10px;width: 50%;" v-model="frameRateValue" placeholder="请选择">
                              <el-option
                                v-for="item in fontTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div style="flex:1;font-size: 14px;">
                            <span>分辨率设置:</span>
                            <el-select size="small" style="font-size: 14px;margin-left: 10px;width: 50%;" v-model="resolutionValue" placeholder="请选择">
                              <el-option
                                v-for="item in fontTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </div>
                          <div style="flex:1;">
                            <el-button v-if="!isLive" @click="pushStream" style="float: right;margin-right: 5%;" type="primary">开始直播</el-button>
                            <el-button v-else type="primary" @click="endLive" style="float: right;margin-right: 5%;text-align: center;align-items: center;justify-self: center;align-content:center;justify-items:center">
                              <div style="display:flex;">
                                <i class="el-icon-switch-button" style="width: 14px;flex:1"></i>
                                <span style="flex:1;margin-left:5px">结束直播&emsp;{{minutes>9?minutes:minutes.toString().padStart(2, '0')}}:{{seconds>9?seconds:'0'+seconds.toString()}}</span>
                              </div>
                            </el-button>
                          </div>
                        </div>
                        <!-- 右键菜单（绝对定位，且默认是隐藏的） -->
                        <div
                          ref="menu"
                          id="menu"
                          class="menu-x"
                        >
                          <div class="menu-li">还原</div>
                          <div class="menu-li" @click="rollEl(90)">旋转90度</div>
                          <div class="menu-li" @click="rollEl(180)">旋转180度</div>
                          <div class="menu-li" @click="rollEl(360)">旋转360度</div>
                          <div class="menu-li" @click="delEl">删除</div>
                        </div>
              </el-card>
              <div :style="{width:'20%',height:wrapSize.height+125+'px',width:'350px',margin:'0 0 0 10px'}">
                <el-card :body-style="{ padding: '0px'}" style="width: 100%;;height: 50%;background-color: rgba(255,255,255,0.9);">
                  <div slot="header" class="clearfix">
                    <span>素材列表</span>
                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                  </div>
                  <!-- <span v-for="item in allTrack" style="margin: 5px 0;"> -->
                    <!-- <el-row style="cursor:pointer;margin: 5px 0;" @click.native="displayElement(item)">
                      <el-col :span="4" style="text-align: center;">
                        <i class="el-icon-view"></i>
                      </el-col>
                      <el-col :span="14">
                        <span>{{item.mediaName }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span @click="editCanvas(item)" style="padding: 5px;"><i class="el-icon-edit"></i></span>
                        <span @click="removeCanvas(item)" style="padding: 5px;"><i class="el-icon-delete"></i></span>
                      </el-col>
                    </el-row> -->
                    <el-table
                      :row-key="row => { return row.id }"
                      :style="{cursor:'pointer'}"
                      height="307"
                      :show-header="false"
                      @current-change="handleCurrentChange"
                      ref="singleTable"

                      :data="allTrack"
                      highlight-current-row
                      class="my-table"
                      >
                      <el-table-column 
                        width="50"
                        align="center"
                      >
                      <template slot-scope="scope" style="float: right;">
                        <span v-if="scope.row.type ==='Microphone'" style="padding: 5px;">
                          <i style="color: red;" class="el-icon-view"></i>
                        </span>
                        <span v-else @click="isVisibleEl(scope.row)" style="padding: 5px;">
                          <i v-if="!scope.row.hidden" class="el-icon-view"></i>
                          <i v-else style="color: red;" class="el-icon-view"></i>
                        </span>
                      </template> 

                      </el-table-column>
                      <el-table-column 
                        align="left"
                        prop="mediaName"
                       >
                      </el-table-column>
                      <el-table-column width="100"  align="center">
                        <template slot-scope="scope" style="float: right;">
                          <el-popover
                          v-if="scope.row.type==='Screen'||scope.row.type==='Media'||scope.row.type==='Microphone'"
                          placement="top"
                          width="100"
                          :disabled="scope.row.muted"
                          trigger="hover">
                            <div class="block">
                              <el-slider @input = "changeVolume(scope.row)" v-model="scope.row.volume"></el-slider>
                            </div>
                            <span slot="reference" @click="closeAudio(scope.row)" style="padding: 5px;">
                              <i v-if="!scope.row.muted" class="el-icon-phone-outline"></i>
                              <i v-else class="el-icon-phone-outline" style="color: red;"></i>
                          </span>
                          </el-popover>
  
                         <span @click="editCanvas(scope.row)" style="padding: 5px;"><i class="el-icon-edit"></i></span>
                          <span @click="removeCanvas(scope.row)" style="padding: 5px;"><i class="el-icon-delete"></i></span>
                        </template>
                      </el-table-column>
                    </el-table>
                  <!-- </span> -->
                  <!-- <el-table>
                    <el-table
                      :data="allTrack"
                      border
                      style="width: 100%">
                      <el-table-column
                        prop="mediaName"
                        label="日期"
                        width="180">
                      </el-table-column>
                    </el-table>
                  </el-table> -->
                </el-card>
                <el-card  :body-style="{ padding: '0px'}" style="width: 100%;height: 50%;margin-top: 20px;background-color: rgba(255,255,255,0.9);">
                  <!-- <div slot="header" style="align-items: center;">
                      <span v-if="userInfo.name=='默认群聊'">在线人数： {{userList.length-1}}</span>  
                      <span v-else>{{userInfo.name}}</span>
                  </div> -->
                  <div slot="header" class="clearfix">
                    <span>弹幕互动区</span>
                    <el-button style="float: right; padding: 3px 0" type="text">在线人数:{{userList.length}}</el-button>
                  </div>
                  <div style="height:250px;padding:0 10px;overflow-y: auto">
                    <my-main/>
                  </div>
                  <div style="position: absolute;bottom: 0;width:350px;height:60px;display: flex; justify-content: center; align-items: center;">
                    <my-footer/>
                  </div>
              </el-card>
              </div>
      </div>  
      <el-dialog
                          title="摄像头"
                          :visible.sync="dialogVisibleCamera"
                          width="30%"
                          >
                          <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change.native="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：摄像头-1"></el-input>
                            </el-col>
                          </el-row>
                           <!--上传视频 -->
                          <el-row>
                            <el-col :span="24">
                              <el-select v-model="cameraPush"  :disabled="disabledCamera" placeholder="请选择" style="width: 100%;">
                                <el-option
                                  v-for="(item,index) in cameraList"
                                  :key="item.deviceId"
                                  :label="item.deviceName"
                                  :value="item.deviceId">
                                  {{item.deviceName}}
                                </el-option>
                              </el-select>
                            </el-col>
                          </el-row>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleCamera = false">取 消</el-button>
                            <el-button type="primary" @click="pushCameraStream">发 送</el-button>
                          </span>
                        </el-dialog>
                        <el-dialog
                          title="音频"
                          :visible.sync="dialogVisibleMicrophone"
                          width="30%"
                          >
                          <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change.native="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：音频-1"></el-input>
                            </el-col>
                          </el-row>
                           <!--上传视频 -->
                          <el-row>
                            <el-col :span="24">
                              <el-select v-model="microphonePush"  :disabled="disabledMicrophone" placeholder="请选择"  style="width: 100%;">
                                <el-option
                                  v-for="(item,index) in microphoneList"
                                  :key="item.deviceId"
                                  :label="item.deviceName"
                                  :value="item.deviceId">
                                  {{item.deviceName}}
                                </el-option>
                              </el-select>
                            </el-col>
                          </el-row>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleMicrophone = false">取 消</el-button>
                            <el-button type="primary" @click="pushMicrophoneStream">发 送</el-button>
                          </span>
                        </el-dialog>
                        <el-dialog
                          title="图片"
                          :visible.sync="dialogVisibleImg"
                          width="30%"
                          >
                           <!--上传图片 -->
                           <span style="padding: 20px 0;">名称</span>
                           <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：图片-1"></el-input>
                            </el-col>
                          </el-row>
                          <span style="padding: 20px 0;">图片</span>
                          <el-row style="margin: 10px 0;width:100%">
                            <el-col :span="20">
                              <el-input v-model="imageUrl" disabled placeholder="请输入内容"></el-input>
                            </el-col>
                            <el-col :span="4">
                              <el-upload
                                style="width: 100%;float: right;" v-show="!editImg"
                                ref="uploadImg"
                                action=""
                                :limit="2"
                                :on-change="handleChange"
                                :auto-upload="false"
                                :show-file-list="false"
                                accept=".jpg,.png,.jpeg"
                                >
                                <el-button  ref="chooseImg" >浏览</el-button>
                                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                              </el-upload>
                            </el-col>
                          
                          </el-row>
                         
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleImg = false">取 消</el-button>
                            <el-button type="primary" @click="pushImgStream">发 送</el-button>
                          </span>
                        </el-dialog>




                        <el-dialog
                          title="多媒体"
                          :visible.sync="dialogVisibleMedia"
                          width="30%"
                          :before-close="handleClose">
                           <!--上传视频 -->
                           <span style="padding: 20px 0;">名称</span>
                           <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change.native="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：多媒体-1"></el-input>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="18">
                              <el-input v-model="mediaUrl" disabled></el-input>
                            </el-col>
                            <el-col :span="6">
                              <el-upload
                                action=""
                                v-show="!editMedia"
                                :limit="2"
                                ref="uploadMedia"
                                :on-change="handleChangeMedia"
                                :auto-upload="false"
                                :show-file-list="false"
                                accept=".mp4"
                                >
                                <el-button style="width: 100%;">浏览</el-button>
                                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                              </el-upload>
                            </el-col>
                          
                          </el-row>
                         
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleMedia = false">取 消</el-button>
                            <el-button type="primary" @click="pushMediaStream">发 送</el-button>
                          </span>
                        </el-dialog>
                       

                        <el-dialog
                          title="文字"
                          :visible.sync="dialogVisibleText"
                          width="30%"
                          :before-close="handleClose">
                          <span style="padding: 20px 0;">名称</span>
                          <!--上传文字 -->
                          <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：文字-1"></el-input>
                            </el-col>
                          </el-row>
                          <span style="padding: 20px 0;">文字内容</span>
                          <el-input style="margin: 10px 0;" id="text" ref="text" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
                          <span style="">字体格式</span>
                          <el-row style="margin-top: 10px;">
                            <el-col :span="7">
                              <el-select v-model="textFont.fontFamily" placeholder="请选择">
                                <el-option
                                  v-for="item in fontFamily"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">{{item.label}}
                                </el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="7">
                              <el-select v-model="textFont.fontSize" placeholder="请选择">
                                <el-option
                                  v-for="item in fontNumbers"
                                  :key="item"
                                  :label="item+'px'"
                                  :value="item">
                                </el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="8">
                              <el-select v-model="fontType" placeholder="请选择">
                                <el-option
                                  v-for="item in fontTypes"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">{{item.label}}
                                </el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="1">
                              <el-color-picker v-model="textFont.fill"></el-color-picker>
                            </el-col>
                          </el-row>
                          
                         
                 
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleText = false">取 消</el-button>
                            <el-button type="primary" @click="pushTextStream">发 送</el-button>
                          </span>
                        </el-dialog>

                        <el-dialog
                          title="窗口"
                          :visible.sync="dialogVisibleScreen"
                          width="30%"
                          >
                           <!--上传共享屏幕 -->
                           <span style="padding: 20px 0;">名称</span>
                           <el-row style="margin: 10px 0;">
                            <el-col>
                              <el-input @change="changeMediaName" v-model="mediaName" placeholder="请输入名称,例如：窗口-1"></el-input>
                            </el-col>
                          </el-row>

                          <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisibleScreen = false">取 消</el-button>
                            <el-button type="primary" @click="pushScreenStream">发 送</el-button>
                          </span>
                        </el-dialog>
                        <el-dialog
                           style="text-align:center"
                          :visible.sync="dialogVisibleEndLive"
                          width="30%"
                          :before-close="handleClose">
                          <template slot="title">
                            <span style="font-size:20px">直播已结束</span>
                          </template>
                          <span>太棒了，努力就会有收获！</span>
                          <div style="display:flex;margin-top:20px">
                            <div style="flex:1">
                              <div><span v-if="minutes>0"><span style="font-size:18px">{{minutes}}</span>分</span><span style="font-size:18px;margin-left:5px">{{seconds}}</span>秒</div>
                              <div style="margin-top:5px">直播时长</div>
                            </div>
                            <div style="flex:1">
                              <div><span v-if="minutes>0"><span style="font-size:18px">{{minutes}}</span>分</span><span style="font-size:18px;margin-left:5px">{{seconds}}</span>秒</div>
                              <div style="margin-top:5px">累计观看</div>
                            </div>
                            <div style="flex:1">
                              <div><span v-if="minutes>0"><span style="font-size:18px">{{minutes}}</span>分</span><span style="font-size:18px;margin-left:5px">{{seconds}}</span>秒</div>
                              <div style="margin-top:5px">弹幕数</div>
                            </div>
                          </div>
                        </el-dialog>
    </div>
  
  </template>
  
  <script>
    // import { useWebRtcSrs } from '../utils/srs';
    import { fabric } from 'fabric';
    import store from '../store/index'
    import myAside from "../components/myAside.vue";
    import myMain from "../components/myMain.vue";
    import myFooter from "../components/myFooter.vue";
    import myGift from "../components/myGift.vue";
    import topLine from "../components/Header.vue";
    import * as workerTimers from 'worker-timers';
    import {createVideo,handleDisplayMedia,handleUserMedia,resolveApp} from '../utils/video';
    import fs from 'fs';
    import path from 'path';
    import moment from 'moment';
    import Worker from 'worker-loader!./canvas.worker.js'
    // const { updateWebRtcSrsConfig, webRtcSrs } = useWebRtcSrs();
    export default {
      components: {"my-aside":myAside, "my-main":myMain, "my-footer":myFooter,"my-gift":myGift,"top-line":topLine},
      data() {
        return {
          mediaName:"",
          disabledCamera:false,
          disabledMicrophone:false,
          allTrack:[],
          editTitle:false,
          track:null,
          workerTimerId:-1,
          videoRatio:16/9,
          wrapSize:{width:0,height:0},
          currentMaxFramerate:0,
          showOpenMicophoneTipCpt:false,
          resolutionRatio :[
            {
              label: '360P',
              value: 360,
            },
            {
              label: '540P',
              value: 540,
            },
            {
              label: '720P',
              value: 720,
            },
            {
              label: '1080P',
              value: 1080,
            },
            {
              label: '1440P',
              value: 1440,
              // disabled: true,
            },
          ],
          maxFramerate :[
            {
              label: '1帧',
              value: 1,
            },
            {
              label: '10帧',
              value: 10,
            },
            {
              label: '20帧',
              value: 20,
            },
            {
              label: '30帧',
              value: 30,
            },
            {
              label: '60帧',
              value: 60,
              disabled: true,
            },
            {
              label: '120帧',
              value: 120,
              disabled: true,
            },
          ],
          cameraPush:"",
          cameraList:[],
          microphonePush:"",
          microphoneList:[],
          buffer:[],
          audioTracks:[],
          textFont:{
              left: 50,  
              top: 50,  
              fill: '#E6A23C',  
              fontSize: 30,  
              fontFamily:'Arial',
              fontWeight:'normal',
              fontStyle:'normal' 
          },
          fontType:'normal',
          fontTypes:[
            {
              value:"normal",
              label:"默认"
            },
            {
              value:"italic",
              label:"斜体"
            },
            {
              value:"bold",
              label:"粗体"
            },
            {
              value:"boldAndItalic",
              label:"粗斜体"
            }
          ],
          fontFamily:[{
            value:"Arial",
            label:"默认字体"
          }],
          recorder:null,
          fontNumbers: Array.from({ length: 50 - 5 + 1 }, (_, index) => index + 5) ,
          mediaWidth:null,
          mediaHeight:null,
          imageBlob:"",
          imageUrl:"",
          mediaBlob:"",
          mediaUrl:"",
          dialogVisibleText:false,
          dialogVisibleCamera:false,
          dialogVisibleScreen:false,
          dialogVisibleMicrophone:false,
          dialogVisibleEndLive:false,//结束直播数据详情是否弹出
          textarea:"",
          textColor:"#E6A23C",
          dialogVisibleImg:false,
          dialogVisibleMedia:false,
          editText:false,
          editCamera:false,
          editScreen:false,
          editImg:false,
          editMedia:false,
          editMicrophone:false,

          canvas:new fabric.Canvas('canvas'),
          
          cover: '../../public/img/the_eras_tour.jpeg', //视频封面
          vid: '', //视频vid
          playAuth: '', //鉴权地址
          source:'http://localhost:8080/live/livestream.flv',
          playerOptions: {
            // 视频 url
            sources: [{
              // src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
              src:'http://localhost/live/livestream.flv',
              type: 'application/x-mpegURL'
            }],
            // 其他设置项
            autoplay: true,
            controls: true,
            poster: 'http://path/to/poster.jpg',
          },
          isDeleting:false,
          bodyAppendChildElArr:[],
          blobId:0,
          bobRemoteMediaStream:new MediaStream(),
          pc:null,
          worker:null,
          isLive:false,//直播是否开启
          isRunning:false,//定时是否开启
          liveTimer:null,//直播定时器
          minutes:0,//定时分钟
          seconds:0,//定时秒钟
          isRecord:false,//是否录屏
          mediaTimer:false,//canvas重新渲染定时器
          liveRoomTitle:"初来乍到，请多多关照~",//直播间标题
          codeRateValue:"",
          frameRateValue:"",
          resolutionValue:""
        }
      },

      mounted() {
        this.worker = new Worker();
        this.currentMaxFramerate = this.maxFramerate[2].value
        setTimeout(() => {
          scrollTo(0,0);
        }, 100);
        //this.initUserMedia();
        this.initCanvas();
      },
      created() {
        this.getUserMedia()
      },
      unmounted() {
        this.recorder.stop();
        // bodyAppendChildElArr.value.forEach((el) => {
        //   el.remove();
        // });
        this.clearFrame();
      },
      computed:{
        isLogin(){
          return store.state.isLogin;

        },
        userInfo(){
          console.log("asdasdasdasd")
          return store.state.userInfo;
          this.$socket.connect();
          this.$socket.emit('LiveInfo',this.isLive);
          store.commit('SOCKET_updateLiveInfo',this.isLive);
        },
        userList(){
          console.log("asdasdasdasd")
          this.$socket.connect();
          this.$socket.emit('LiveInfo',this.isLive);
          store.commit('SOCKET_updateLiveInfo',this.isLive);
          return store.state.userList;
        },
      },
      destroyed(){
        this.endLive()
        this.stopTimer()
        this.closeRecordMedia()
      },
      watch:{
        // 监听 currentMaxFramerate 的变化  
        currentMaxFramerate(newVal, oldVal) {  
          // 当 currentMaxFramerate 变化时，清除工作线程定时器并渲染帧  
          workerTimers.clearInterval(this.workerTimerId);  
          this.renderFrame();
        },
        allTrack(newVal, oldVal) {  
          console.log(newVal,oldVal)
        },
        wrapSize(newVal) {  
          console.log(newVal,oldVal)
        },
      },
      methods: {
        handleVisibilityChange() {
          let that = this
          if (document.visibilityState === 'hidden') { 
            console.log('页面被覆盖或不在前台');  
            that.mediaTimer = setInterval(function() {
              that.canvas.renderAll()
              console.log("那么再加一条又慢")
            }, 20);
          } else if (document.visibilityState === 'visible') { 
            clearInterval(that.mediaTimer);
          }  
        },
        handleRecordMedia(){
          this.buffer=[]
          let stream = this.$refs.canvas.captureStream()
          this.recorder = new MediaRecorder(stream,{mimeType:"video/webm;codecs=h264"});
          this.recorder.ondataavailable = this.handleDataAvailable.bind(this)
          this.recorder.start();

          if(!this.isLive) document.addEventListener('visibilitychange',this.handleVisibilityChange);

          this.isRecord = true
          this.recorder.onstop = () => {
            const blob = new Blob(this.buffer, {type : 'video/webm;codecs=h264'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "screen.webm";
            a.click();
          }
        },
        closeRecordMedia(){
          if(!this.isLive) document.removeEventListener('visibilitychange',this.handleVisibilityChange);
          this.isRecord = false
          this.recorder.stop();

        },
        async endLive(){
          this.pc.close()
          this.pc = null;
          this.stopTimer()
          if(!this.isRecord) document.removeEventListener('visibilitychange',this.handleVisibilityChange);
          this.$socket.emit('LiveInfo',false);
          store.commit('SOCKET_updateLiveInfo',false);
          this.isMediaTimer=false
          this.isLive = false
          this.dialogVisibleEndLive = true
        },
        startTimer() {  
          if (this.isRunning) return;  
          this.isRunning = true;  
          this.liveTimer = setInterval(() => {  
            this.seconds++;  
            if (this.seconds >= 60) {  
              this.seconds = 0;  
              this.minutes++;  
            }
          }, 1000);  
        },  
        stopTimer() {  
          clearInterval(this.liveTimer);  
          this.isRunning = false;  
        },  
        closeAudio(row){
          row.muted = !row.muted
          if(row.muted){
            row.volume = 0
          }
          else{
            // row.volume = 50
          }
          console.log(row.muted)
          // if(row.stream !== undefined){
              
          //   const audioTracks = row.stream.getAudioTracks()
          //   if (audioTracks.length > 0) {  
          //     audioTracks.forEach(track => {  
          //       track.muted = row.muted
          //     });
          //   }
          // }else{

          // }
        },
        rollEl(angle){
          for(let i=0;i<this.canvas.getObjects().length;i++){
                if(this.canvas.getObjects()[i] === this.track.canvasDom){
                  this.canvas.getObjects()[i].set("originX",'center')
                  this.canvas.getObjects()[i].set("originY",'center')
                  this.canvas.getObjects()[i].set("angle",angle)
                  break
                }
          }
          this.canvas.renderAll()
        },
        changeVolume(row){
          row.videoEl.volume = row.volume/100
        },
        changeMediaName(value){
          // console.log(value)
          // this.mediaName = value
        },
          getRowKey(row) {  
            // 返回行的唯一键值，通常是一个 ID 或其他唯一标识  
            console.log(row.id)
            return row.id;  
          },  
        isVisibleEl(row){
          row.hidden = !row.hidden
          if(row.hidden) {
            for(let i=0;i<this.canvas.getObjects().length;i++){
              if(this.canvas.getObjects()[i] === row.canvasDom){
                this.canvas.getObjects()[i].visible = false
                  break
              }
            }
            this.canvas.renderAll();
          }
          else {
            for(let i=0;i<this.canvas.getObjects().length;i++){
              if(this.canvas.getObjects()[i] === row.canvasDom){
                this.canvas.getObjects()[i].visible = true
                  break
              }
            }
            this.canvas.renderAll();
          }
        },
        editCanvas(track){
          console.log(track.type)
          this.track = track
          let showDialog = 'dialogVisible'+track.type
          let isEdit = 'edit'+track.type
          this.mediaName = track.mediaName
          if(track.type==='Camera'){
            this.cameraPush = track.deviceId?track.deviceId:""
            this.disabledCamera = true
            // this[showDialog] = true;
            // this[isEdit] = true
          }
          else if(track.type==='Microphone'){
            this.microphonePush = track.deviceId?track.deviceId:""
            this.disabledMicrophone = true
          }
          else if(track.type==='Img'){
            this.imageUrl = track.imageUrl?track.imageUrl:""
          }
          else if(track.type==='Text'){
            this.textarea = track.canvasDom.text 
          }
          else if(track.type==='Screen'){
          }
          else if(track.type==='Media'){
            this.mediaUrl = track.mediaUrl?track.mediaUrl:""
            this.disabledMicrophone = true
          }
          this[showDialog] = true;
            this[isEdit] = true
        },
        removeCanvas(track){
          // 暂时禁止处理 current-change 事件  
          this.isDeleting = true;
          // if(track.type==="Screen" || track.type === "Camera"){
          //   // 获取流中的所有轨道并停止它们  
          //   const tracks = track.stream.getTracks();  
          //   tracks.forEach(track => {  
          //     track.stop();
          //   });
          // }
          if (track.canvasDom !== undefined) {
            this.canvas.remove(track.canvasDom);
            if( track.videoEl !== undefined){
              track.videoEl.remove();
            }
            if(track.stream !== undefined){
              track.stream.getTracks().forEach((item) => {
                item.stop();
                track.stream.removeTrack(item);
              });
            }
          }
          this.bodyAppendChildElArr.forEach((el) => {
            const videoid = el.getAttribute('videoid');
            if (track.id === videoid) {
              el.remove();
            }
          });
          // this.canvas.remove(track.canvasDom)
          this.allTrack = this.allTrack.filter(item => {
            return item.id!==track.id
          });
        },
        handleDataAvailable(e){
          if(e && e.data && e.data.size > 0){
            this.buffer.push(e.data);			
          }
          // console.log(e.data)
          // that.buffer.push(e.data)
          // let blob = new Blob(this.buffer, {type:'video/x-matroska;codecs=avc1'})
          // console.log(typeof e.data)
          // var blob = new Blob(buffer, {type : 'video/webm'});
          // var url = window.URL.createObjectURL(blob);
          // var a = document.createElement('a');
          // a.href = url;
          // a.style.display = 'none';
          // a.download = 'video.webm';
          // a.click();
        },
        async pushStream2(stream){
          let that = this
            this.buffer = [];
            var options = {
              mimeType: 'video/x-matroska;codecs=avc1'
            }
            // const types = [
            //   'video/webm',
            //   'audio/webm',
            //   'video/mpeg',
            //   'video/webm;codecs=vp8',
            //   'video/webm;codecs=vp9',
            //   'video/webm;codecs=daala',
            //   'video/webm;codecs=h264',
            //   'audio/webm;codecs=opus',
            //   'audio/webm;codecs=aac',
            //   'audio/webm;codecs=h264,opus',
            //   'video/webm;codecs=avc1.64001f,opus',
            //   'video/webm;codecs=avc1.4d002a,opus',
            // ];
            // if(!MediaRecorder.isTypeSupported(options.mimeType)){
            //   console.error(`${options.mimeType} is not supported!`);
            //   return;	
            // }

            if(this.pc!==null&& this.pc!==undefined){
                console.log("已开始推流");
                return;
            }
            var httpURL = "http://localhost:1985/rtc/v1/publish/";
            var webRTCURL = "webrtc://localhost/live/1";
            var constraints = {
                    audio: {
                        echoCancellation : true,    // 回声消除
                        noiseSuppression : true,    // 降噪
                        autoGainControl  : true     // 自动增益
                    },
                    video: {
                        frameRate   : { min : 30 },                // 最小帧率
                        width       : { min : 640, ideal : 1080}, // 宽度   
                        height      : { min : 360, ideal : 720},  // 高度  
                        aspectRadio : 16/9                        // 宽高比
                    }
    }
            // 通过摄像头、麦克风获取音视频流
            this.videoStream = stream;
            // 获取video元素
            // this.videoElement = document.querySelector("#video")
            //video播放流数据
            // this.videoElement.srcObject = this.videoStream;
            // 静音
            // this.videoElement.volume=0;
            // 创建RTC连接对象
            this.pc = new RTCPeerConnection();
            // var videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            // RTCPeerConnection方法addTransceiver()创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection关联的收发器集中。
            // 每个收发器代表一个双向流，RTCRtpSender和RTCRtpReceiver都与之相关联。
            // 注意添加顺序为audio、video,后续RTCPeerConnection创建offer时SDP的m线顺序遵循此顺序创建，SRS自带的信令服务器响应的SDP中m线总是先audio后video。
            // 若本端SDP和远端SDP中的m线顺序不一直，则设置远端描述时会异常，显示offer中的m线与answer中的m线顺序不匹配
            this.pc.addTransceiver("audio", {direction: "recvonly"});
            this.pc.addTransceiver("video", {direction: "recvonly"});
            // 遍历getUserMedia（）获取到的流数据，拿到其中的音频轨道和视频轨道，加入到RTCPeerConnection连接的音频轨道和视频轨道中


            const audioContext = new (window.AudioContext || window.webkitAudioContext)();  
  
            // 创建一个 MediaStreamAudioDestinationNode  
            const destination = audioContext.createMediaStreamDestination();  
              
            // 获取空的音频轨道  
            const emptyAudioTrack = destination.stream.getAudioTracks()[0];  
            
              
            // 将空的音频轨道添加到现有的 MediaStream 中  
            if(this.audioTracks.length<=0) stream.addTrack(emptyAudioTrack);
            else {
              this.audioTracks.forEach((track)=>{
                stream.addTrack(track)
              });
            }
            stream.getTracks().forEach((track)=>{
               console.log(1)
                this.pc.addTrack(track);
            });
            
            // 创建本端offer
            var offer = await this.pc.createOffer();
            // 设置本端
            await that.pc.setLocalDescription(offer);
            var data = {
                "api": httpURL,
                "streamurl":webRTCURL,
                "sdp":offer.sdp
            }
            // SDP交换，请求SRS自带的信令服务器
            this.httpApi(httpURL,data).then(async(data)=>{
                console.log("answer",data);
                // 设置远端描述，开始连接
                await that.pc.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: data.sdp}));

            }).catch((data)=>{
                if(data.code===400){
                    console.log("SDP交换失败");
                }
            });
            if(!this.isRecord) {document.addEventListener('visibilitychange',this.handleVisibilityChange);}
            this.isMediaTimer = true
            this.$socket.connect();
            this.$socket.emit('LiveInfo',true);
            store.commit('SOCKET_updateLiveInfo',true);
            // document.addEventListener('visibilitychange', function() {  
            //   if (document.visibilityState === 'hidden') {  
            //     console.log('页面被覆盖或不在前台');  
            //     timer = setInterval(function() {
            //       that.canvas.renderAll()
            //     }, 20);
            //     //that.worker = new Worker();
            //     // that.worker.postMessage("blur");
            //     // 停止或降低canvas的渲染频率  
            //   } else if (document.visibilityState === 'visible') {  
            //     clearInterval(timer);
            //     // that.worker.close();
            //     // 恢复canvas的正常渲染  
            //   }  
            //});
            // that.worker.addEventListener('message', e => { // 接收消息
            //     console.log(e.data); // Greeting from Worker.js，worker线程发送的消息
            //     this.canvas.renderAll()
            // });
            
            // window.addEventListener("blur",function() {
            //   console.log("不见了")
            //   that.worker.postMessage("blur");
            // })
            this.startTimer()
            this.isLive = true
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
      httpApiDelete(httpURL,data){
          var promise = new Promise((resolve,reject)=>{
          var xhr = new XMLHttpRequest();
          xhr.open('delete', httpURL, true);
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
        async pushStream(){
          /* 连接socket */
          // this.$socket.connect();
          // let stream = this.$refs.canvas.captureStream()
          // // this.$refs.pushVideo.srcObject = stream
          // let that = this
          //  this.$socket.emit("publishStream",{},function(result){
          //     if(result){
          //         let mr = new MediaRecorder(stream);
          //         mr.ondataavailable = async function(e){
          //           // p.stdin.write(NodeBuffer.from(await e.data.arrayBuffer()))
          //           that.$socket.emit("streamData",e.data)
          //         }
          //         mr.start(40);
          //     }
          // //  })
          // window.srcObject = this.$refs.canvas.captureStream(25)
          this.minutes = 0
          this.seconds = 0
            this.pushStream2(this.$refs.canvas.captureStream())
        },
        handleChange(file, fileLists) {
          if(this.$refs.uploadImg.uploadFiles.length>1){
            this.$refs.uploadImg.uploadFiles.shift();
          }
          this.imageBlob = URL.createObjectURL(file.raw)
          this.imageUrl = document.getElementsByClassName("el-upload__input")[0].value
        },
        handleChangeMedia(file, fileLists){
          if(this.$refs.uploadMedia.uploadFiles.length>1){
            this.$refs.uploadMedia.uploadFiles.shift();
          }
          this.mediaBlob = URL.createObjectURL(file.raw)
          this.mediaUrl = document.getElementsByClassName("el-upload__input")[0].value
        },
        configSocketIo(){
        },
        gotolll(){
          this.$router.push('/lll');
        },
        displayElement(row){
          if(row !== null){
            this.canvas.setActiveObject(row.canvasDom);  
            this.canvas.renderAll();  
          }
        },
        async pushMediaStream(){
          try{
            if(this.mediaName === "" || this.mediaName === undefined){
              this.$message.error('请入正确的名称');
              return
            }
            if(this.mediaUrl === "" || this.mediaUrl === undefined){
              this.$message.error('请至少上传一个视频');
              return
            }
            if(this.editMedia){
                  for(let i=0;i<this.allTrack.length;i++){
                    if(this.allTrack[i].id === this.track.id){
                      this.allTrack[i].mediaName = this.mediaName
                      break
                    }
                  }
                  this.mediaName = ""
                  this.mediaUrl = ""
                  this.editMedia = false
                  this.dialogVisibleMedia = false
                  return
            }
            this.dialogVisibleMedia = false
            this.editMedia = false
            let that = this
            const videoEl = createVideo({
              muted: false,
              appendChild: true,
            });
            this.bodyAppendChildElArr.push(videoEl);
            let id = this.generateRandomString()
            videoEl.setAttribute('videoid', id);
            videoEl.volume = 0.8
            // if (obj.volume !== undefined) {
            //   videoEl.volume = obj.volume / 100;
            // }
            console.log("this.mediaBlob",this.mediaBlob)
            videoEl.src = this.mediaBlob;
            await new Promise((resolve) => {
              videoEl.onloadedmetadata = () => {
                const stream = videoEl.captureStream();
                if(stream.getAudioTracks()[0]!==undefined && stream.getAudioTracks()[0] !== null) that.audioTracks.push(stream.getAudioTracks()[0])
                const width = stream.getVideoTracks()[0].getSettings().width;
                const height = stream.getVideoTracks()[0].getSettings().height;
                videoEl.width = width;
                videoEl.height = height;
                videoEl.play()
                const canvasDom = 
                  new fabric.Image(videoEl, {
                    top: 0,
                    left: 0,
                    width,
                    height,
                    objectCaching: false
                  });
                canvasDom.scale(that.handleScale(width,height));
                that.canvas.add(canvasDom);
                const mediaVideoTrack = {
                  id: id,
                  audio: 1,
                  video: 1,
                  mediaName: that.mediaName,
                  type: 'Media',
                  mediaUrl:that.mediaUrl,
                  track: undefined,
                  trackid: undefined,
                  stream: undefined,
                  streamid: undefined,
                  canvasDom:canvasDom,
                  videoEl:videoEl,
                  volume:80,
                  hidden: false,
                  muted: false,
                  scaleInfo: {},
                };
                that.allTrack.push(mediaVideoTrack)
                fabric.util.requestAnimFrame(function render() {
                  that.canvas.renderAll();
                  fabric.util.requestAnimFrame(render);
                });
                this.mediaName = ""
                this.mediaUrl = ""
                resolve({ videoEl, canvasDom });
              };
            });
          }catch(error){
            console.log(error)
          }
          
        },
        pushTextStream(){
          let that = this
          try{
            if(this.mediaName === "" || this.mediaName === undefined){
              this.$message.error('请入正确的名称');
              return
            }
            if(this.textarea === "" || this.textarea === undefined){
              this.$message.error('请输入内容');
              return
            }
            if(this.fontType === ''||this.fontType===undefined) return;
            if(this.fontType === 'bold') this.textFont.fontWeight = 'bold'
            else if(this.fontType === 'italic') this.textFont.fontStyle = 'italic'
            else if(this.fontType === 'boldAndItalic'){
              this.textFont.fontWeight = 'bold';
              this.textFont.fontStyle = 'italic'
            }
            else { 
              this.textFont.fontWeight = 'normal'
              this.textFont.fontStyle = 'normal'
            }
            if(this.editText){
              for(let i=0;i<this.canvas.getObjects().length;i++){
                if(this.canvas.getObjects()[i] === this.track.canvasDom){
                  this.canvas.getObjects()[i].set("fontWeight",this.textFont.fontWeight)
                  this.canvas.getObjects()[i].set("fontStyle",this.textFont.fontStyle)
                  this.canvas.getObjects()[i].set("fontSize",this.textFont.fontSize)
                  this.canvas.getObjects()[i].set("fill",this.textFont.fill)
                  this.canvas.getObjects()[i].set("text",this.textarea)
                  break
                }
              }
              for(let i=0;i<this.allTrack.length;i++){
                if(this.allTrack[i].id === this.track.id){
                  this.allTrack[i].mediaName = this.mediaName
                  break
                }
              }
              // this.canvas.renderAll();
            }
            else{
              var text = new fabric.Text(this.textarea, this.textFont);  
              this.canvas.add(text);
              const textTrack = {
                id: this.generateRandomString(),
                audio: 0,
                video: 1,
                mediaName: this.mediaName,
                type: 'Text',
                track: undefined,
                trackid: undefined,
                stream: undefined,
                streamid: undefined,
                canvasDom:text,
                hidden: false,
                muted: false,
                scaleInfo: {},
              };
              this.allTrack.push(textTrack)
              // this.canvas.renderAll();
            }
            fabric.util.requestAnimFrame(function render() {
                   that.canvas.renderAll();
                  fabric.util.requestAnimFrame(render);
            });
            this.dialogVisibleText = false
            this.mediaName = ""
            this.textarea = ""
            this.editText = false
          }
          catch(error){
            console.log(error)
          }
        },
        async pushCameraStream(){
          try{
            if(this.mediaName === ""||this.mediaName === undefined){
              this.$message.error('请输入正确的设备名称');
              return
            }
            this.dialogVisibleCamera = false
            if(this.editCamera){
                for(let i=0;i<this.allTrack.length;i++){
                  if(this.allTrack[i].id === this.track.id){
                    this.allTrack[i].mediaName = this.mediaName
                    break
                  }
                }
                this.mediaName = ""
                return
              }
              this.disabledCamera = false
              var that = this
              const event = await navigator.mediaDevices.getUserMedia({
                video: { deviceId:this.cameraPush },
                audio: false,
              });
              if (!event) return;
              let id = that.generateRandomString();
              const videoEl = createVideo({ appendChild: true });
              this.bodyAppendChildElArr.push(videoEl);
              videoEl.setAttribute('videoid',id);
              videoEl.srcObject = event;
              await new Promise((resolve) => {
                videoEl.onloadedmetadata = () => {
                  console.log("沃茨执行到这里了")
                  const stream = videoEl.captureStream();
                  const width = stream.getVideoTracks()[0].getSettings().width;
                  const height = stream.getVideoTracks()[0].getSettings().height;
                  videoEl.width = width;
                  videoEl.height = height;
                  var canvasDom = new fabric.Image(videoEl, {
                    top: 0,
                    left: 0,
                    width,
                    height, 
                    objectCaching: false
                  });
                  canvasDom.scale(that.handleScale(width,height));
                  const videoTrack = {
                    id:id,
                    deviceId: that.cameraPush,
                    audio: 2,
                    video: 1,
                    mediaName: that.mediaName,
                    type: 'Camera',
                    track: stream.getVideoTracks()[0],
                    trackid: stream.getVideoTracks()[0].id,
                    stream: stream,
                    streamid: stream.id,
                    canvasDom:canvasDom,
                    videoEl:videoEl,
                    hidden: false,
                    muted: true,
                    scaleInfo: that.handleScale(width,height),
                  };
                  that.canvas.add(canvasDom);
                  that.allTrack.push(videoTrack)
                  fabric.util.requestAnimFrame(function render() {
                    that.canvas.renderAll();
                    fabric.util.requestAnimFrame(render);
                  });
                  that.editCamera = false
                  that.mediaName = ""
                  resolve({ videoEl, canvasDom,videoTrack});
                }
              });
          }catch (error) {
            console.error(error);
          }
            
        },
        async pushScreenStream(){
          try {
            if(this.mediaName === ""||this.mediaName === undefined){
              this.$message.error('请输入正确的设备名称');
              return
            }
            if(this.editScreen){
              for(let i=0;i<this.allTrack.length;i++){
                if(this.allTrack[i].id === this.track.id){
                  this.allTrack[i].mediaName = this.mediaName
                  break
                }
              }
              this.editScreen = false
              this.dialogVisibleScreen = false
              this.mediaName = ""
              return
            }
            let that = this
            const videoEl = createVideo({ appendChild: true });
            let event = await handleDisplayMedia({
                video: true,
                audio: true,
            })
            if (!event) return;
            let id = that.generateRandomString();
            this.bodyAppendChildElArr.push(videoEl);
            videoEl.setAttribute('videoid',id);
            videoEl.srcObject = event;
            videoEl.volume = 0.8
            // videoEl.setAttribute('videoid', obj.id);
            await new Promise((resolve) => {
              videoEl.onloadedmetadata = () => {
                const stream = videoEl.captureStream();
                if(stream.getAudioTracks()[0]!==undefined && stream.getAudioTracks()[0] !== null) that.audioTracks.push(stream.getAudioTracks()[0])
                const width = stream.getVideoTracks()[0].getSettings().width;
                const height = stream.getVideoTracks()[0].getSettings().height;
                videoEl.width = width;
                videoEl.height = height;
                const canvasDom = new fabric.Image(videoEl, 
                  {
                    top: 0,
                    left:0,
                    width,
                    height,
                    objectCaching: false
                  }
                )
                console.log(canvasDom)
                //缓存使用
                //this.handleMoving({ canvasDom, id: item.id });
                //缓存使用
                //this.handleScaling({ canvasDom, id: item.id });
                canvasDom.scale(
                  that.handleScale(width,height)
                );
                that.canvas.add(canvasDom);
                videoEl.play();
                fabric.util.requestAnimFrame(function render() {
                  that.canvas.renderAll();
                    fabric.util.requestAnimFrame(render);
                });
                const videoTrack = {
                  id: id,
                  audio: 0,
                  video: 1,
                  videoEl:videoEl,
                  mediaName:that.mediaName,
                  type: 'Screen',
                  track: stream.getVideoTracks()[0],
                  trackid: stream.getVideoTracks()[0].id,
                  stream: stream,
                  streamid: stream.id,
                  hidden: false,
                  muted: false,
                  volume:80,
                  canvasDom:canvasDom,
                  scaleInfo: that.handleScale(width,height),
                };
                that.allTrack.push(videoTrack)
                that.dialogVisibleScreen = false
                that.mediaName = ""
       
                resolve({ videoEl, canvasDom,videoTrack});
              };
            });
          } catch (error) {
            console.error(error);
          } 
        },
        async pushMicrophoneStream() {
          try{
            if(this.mediaName === ""||this.mediaName === undefined){
              this.$message.error('请输入正确的名称');
              return
            }
            if(this.editMicrophone){
              for(let i=0;i<this.allTrack.length;i++){
                if(this.allTrack[i].id === this.track.id){
                  this.allTrack[i].mediaName = this.mediaName
                  break
                }
              }
              this.editMicrophone = false
              this.dialogVisibleMicrophone = false
              this.mediaName = ""
              return
            }
            this.dialogVisibleMicrophone = false
            let that = this
            const event = await handleUserMedia({
              video: false,
              audio: { deviceId: this.microphonePush },
            });
            if (!event) return;
            const videoEl = createVideo({ appendChild: true, muted: false });
            let id = that.generateRandomString();
            this.bodyAppendChildElArr.push(videoEl);
            videoEl.setAttribute('videoid',id);
            videoEl.srcObject = event;
            videoEl.volume = 0.8
            // if (obj.volume !== undefined) {
            //   videoEl.volume = obj.muted ? 0 : obj.volume / 100;
            // }
            const microphoneTrack = {
                    id:id,
                    audio: 1,
                    video: 0,
                    deviceId: that.microphonePush,
                    mediaName: this.mediaName,
                    type: 'Microphone',
                    track: event.getAudioTracks()[0],
                    trackid: event.getAudioTracks()[0].id,
                    canvasDom:undefined,
                    stream: event,
                    streamid: event.id,
                    videoEl:videoEl,
                    hidden: false,
                    muted: false,
                    scaleInfo: {},
                    volume:80,
            };
            this.allTrack.push(microphoneTrack)
            this.editMicrophone = false
            this.mediaName = ""
          }
          catch(error){
            console.error(error);
          }
        },
        async pushImgStream(){
          if(this.mediaName === ""||this.mediaName === undefined){
              this.$message.error('请输入正确的名称');
              return
          }
          if(this.imageUrl === "" || this.imageUrl === undefined){
              this.$message.error('请上传图片');
              return
          }
          if(this.editImg){
            for(let i=0;i<this.allTrack.length;i++){
              if(this.allTrack[i].id === this.track.id){
                this.allTrack[i].mediaName = this.mediaName
                break
              }
            }
            this.dialogVisibleImg = false
            this.mediaName = ""
            this.imageUrl = ""
            this.editImg = false
            return
          }
          this.dialogVisibleImg = false
          let that = this
          const imgEl = await this.loadImageFromURL(this.imageBlob); 
          imgEl.set({
              top: 0,
              left: 0,
              width: imgEl.width,
              height: imgEl.height,
              objectCaching: false
            });
            imgEl.scale(this.handleScale(imgEl.width,imgEl.height))
            const imgTrack = {
                  id:this.generateRandomString(),
                  audio: 0,
                  video: 0,
                  mediaName: this.mediaName,
                  type: 'Img',
                  track: undefined,
                  imageUrl:this.imageUrl,
                  canvasDom:imgEl,
                  trackid: undefined,
                  stream: undefined,
                  streamid: undefined,
                  hidden: false,
                  muted: false,
                  scaleInfo: {},
          };
          imgEl.scale(this.handleScale(imgEl.width,imgEl.height));
          that.canvas.add(imgEl)
          this.allTrack.push(imgTrack)
          fabric.util.requestAnimFrame(function render() {
                that.canvas.renderAll();
                fabric.util.requestAnimFrame(render);
          });
          this.editImg = false
          this.mediaName = ""
          this.imageUrl = ""
        },
        loadImageFromURL(url) {  
          return new Promise((resolve, reject) => {  
            fabric.Image.fromURL(url, (img) => {  
              resolve(img);  
            }, (error) => {  
              reject(error);  
            });  
          });  
        }, 
        async initCanvas(){
            this.$refs.menu.oncontextmenu = function () {
              return false;
            }
            const resolutionHeight = this.resolutionRatio[3].value / window.devicePixelRatio;
            const resolutionWidth = (this.resolutionRatio[3].value / window.devicePixelRatio) * this.videoRatio;
            console.log(resolutionHeight,resolutionWidth)
            // const wrapWidth = this.$refs.containerRef.getBoundingClientRect().width;
            const wrapWidth = window.screen.width*0.7;
            console.log(wrapWidth)
            console.log(window.devicePixelRatio)
            // const wrapWidth = 1920;
            const ratio = wrapWidth / resolutionWidth;
            console.log(ratio)
            const wrapHeight = resolutionHeight * ratio;
            console.log(wrapHeight)
            // const wrapHeight = 1080;
            // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
            // upper-canvas: 操作时候的canvas
            const canvas = new fabric.Canvas('canvas',{
                fireRightClick: true, // 启用右键，button的数字为3
                stopContextMenu: true, // 禁止默认右键菜单
              }
            );
            canvas.setWidth(resolutionWidth);
            canvas.setHeight(resolutionHeight);
            canvas.setBackgroundColor('black', () => {
              console.log('setBackgroundColor回调');
            });
  
            this.wrapSize.width = wrapWidth*0.9;
            this.wrapSize.height = wrapHeight*0.9;
            console.log("this.wrapSize",this.wrapSize);
            // 按下鼠标
            canvas.on('mouse:down', this.canvasOnMouseDown)
            console.log()
            this.canvas = canvas;
            this.renderFrame();
            this.changeCanvasStyle();

        },
        // 鼠标在画布上的点击事件
        canvasOnMouseDown(opt) {
          let menu = this.$refs.menu
          // 判断：右键，且在元素上右键
          // opt.button: 1-左键；2-中键；3-右键
          // 在画布上点击：opt.target 为 null
          if (opt.button === 1 && opt.target) {
            // 获取当前元素
            this.track = opt.target
            for(let i=0;i<this.allTrack.length;i++){
                if(this.allTrack[i].canvasDom === opt.target){
                  this.track = this.allTrack[i]
                  this.$refs.singleTable.setCurrentRow(this.allTrack[i]);
                  break
                }
            }
           
          }
          if (opt.button === 3 && opt.target) {
            // 获取当前元素
            for(let i=0;i<this.allTrack.length;i++){
                if(this.allTrack[i].canvasDom === opt.target){
                  this.track = this.allTrack[i]
                  break
                }
            }
            menu.domReady = function() {
              console.log(123)
            }

            // 显示菜单，设置右键菜单位置
            // 获取菜单组件的宽高
            const menuWidth = menu.offsetWidth
            const menuHeight = menu.offsetHeight

            // 当前鼠标位置
            let pointX = opt.pointer.x
            let pointY = opt.pointer.y

            // 计算菜单出现的位置
            // 如果鼠标靠近画布右侧，菜单就出现在鼠标指针左侧
            if (this.canvas.width - pointX <= menuWidth) {
              pointX -= menuWidth
            }
            // 如果鼠标靠近画布底部，菜单就出现在鼠标指针上方
            if (this.canvas.height - pointY <= menuHeight) {
              pointY -= menuHeight
            }

            // 将菜单展示出来
            menu.style = `
              visibility: visible;
              left: ${pointX}px;
              top: ${pointY}px;
              // z-index: 100;
            `
          } else {
            this.hiddenMenu()
          }
        },
        // 隐藏菜单
        hiddenMenu() {
          let menu = this.$refs.menu
          menu.style = `
            visibility: hidden;
            left: 0;
            top: 0;
            z-index: -100;
          `
          this.track = null
        },

        // 删除元素
        delEl() {
          this.canvas.remove(this.track.canvasDom)
          // for(let i=0;i<this.allTrack.length;i++){
          //     if(this.allTrack[i].id === this.track.id){
          //       this.allTrack.splice(i,1,imgTrack)
          //       break
          //     }
          // }
          console.log(this.track)
          this.allTrack = this.allTrack.filter(item => {
            return item.id!==this.track.id
          });
          console.log("这里删除了")
          this.hiddenMenu()
        },
        handleCurrentChange(newVal, oldVal){
          console.log(this.isDeleting)
          if (!this.isDeleting) {  
            // 处理 current-change 事件的逻辑  
            this.canvas.setActiveObject(newVal.canvasDom);  
            this.canvas.renderAll(); 
          }   
          this.isDeleting = false;

        },
        // handleRowClick(row, column, event){
        //   console.log(row,column,event)
        //   this.canvas.setActiveObject(row.canvasDom);  
        //     this.canvas.renderAll(); 
        // },
        changeCanvasStyle() {
          // let main = this.$refs.main
          let fabricCanvas = this.canvas
          // @ts-ignore
          fabricCanvas.wrapperEl.style.width = `${this.wrapSize.width}px`;
          // @ts-ignore
          fabricCanvas.wrapperEl.style.height = `${this.wrapSize.height}px`;
          // @ts-ignore
          fabricCanvas.lowerCanvasEl.style.width = `${this.wrapSize.width}px`;
          // @ts-ignore
          fabricCanvas.lowerCanvasEl.style.height = `${this.wrapSize.height}px`;
          // @ts-ignore
          fabricCanvas.upperCanvasEl.style.width = `${this.wrapSize.width}px`;
          // @ts-ignore
          fabricCanvas.upperCanvasEl.style.height = `${this.wrapSize.height}px`;

          // main.width = `${this.wrapSize.width}px`;
          // main.height = `${this.wrapSize.height}px`;
          // main.wrapperEl.style.width = `${this.wrapSize.width}px`;
          // // @ts-ignore
          // main.wrapperEl.style.height = `${this.wrapSize.height}px`;
          // // @ts-ignore
          // main.lowerCanvasEl.style.width = `${this.wrapSize.width}px`;
          // // @ts-ignore
          // main.lowerCanvasEl.style.height = `${this.wrapSize.height}px`;
          // // @ts-ignore
          // main.upperCanvasEl.style.width = `${this.wrapSize.width}px`;
          // // @ts-ignore
          // main.upperCanvasEl.style.height = `${this.wrapSize.height}px`;
        },
        renderFrame() {
          /**
           * 理论情况：
           * currentMaxFramerate等于20，即每秒20帧，即1000 / 20 = 50毫秒轮询一次
           * currentMaxFramerate等于30，即每秒30帧，即1000 / 30 = 33.333毫秒轮询一次
           * currentMaxFramerate等于30，即每秒60帧，即1000 / 60 = 16.666毫秒轮询一次
           * 实际情况：
           * currentMaxFramerate等于20，即50毫秒轮询一次，实际fps是18
           * currentMaxFramerate等于20，希望fps是20，即需要(18/20) * 50 = 45毫秒轮询一次
           */
          let currentMaxFramerate  = this.maxFramerate[2].value
          let delay = 1000 / currentMaxFramerate.value;
          delay = (18 / 20) * delay;
          this.workerTimerId = workerTimers.setInterval(() => {
            renderAll();
          }, delay);
        },
        renderAll() {
          let that = this
          // timeCanvasDom.value.forEach((item) => {
          //   item.text = new Date().toLocaleString();
          // });
          // stopwatchCanvasDom.value.forEach((item) => {
          //   item.text = formatDownTime({
          //     endTime: +new Date(),
          //     startTime: startTime.value,
          //     showMs: true,
          //   });
          // });
          // this.canvas.renderAll();
          fabric.util.requestAnimFrame(function render() {
              that.canvas.renderAll();
              fabric.util.requestAnimFrame(render);
          });
        },

        clearFrame(){
          if (this.workerTimerId !== -1) {
            workerTimers.clearInterval(this.workerTimerId);
          }
        },
        handleError(err){
              console.log('getUserMedia error:', err);
        },
        setUserInfo(){
          store.commit('changeChatType','group');
          store.commit('setUserInfo',{name:"默认群聊",img:"http://img.mp.itc.cn/upload/20170808/5861bc790e654d56bc9289c567b44875_th.jpg"});
        },
        handleScale(width,height) {
          let currentResolutionRatio = 720
          let videoRatio = 16/9
          const resolutionHeight = currentResolutionRatio;
          const resolutionWidth = currentResolutionRatio * videoRatio;
          let ratio = 1;
          if (width > resolutionWidth) {
            const r1 = resolutionWidth / width;
            ratio = r1;
          }
          if (height > resolutionHeight) {
            const r1 = resolutionHeight / height;
            if (ratio > r1) {
              ratio = r1;
            }
          }
          return ratio;
        },
        async getUserMedia() {
          let that = this
          // 1. 获取到设备授权
          await navigator.mediaDevices.getUserMedia({video: true, audio: true})
          .then(function(stream) {  
            // 停止媒体流中的所有轨道  
            stream.getTracks().forEach(track => track.stop());  
          })
          .catch(function(error) {  
            // 获取媒体流失败，可能是因为摄像头未授权或无法访问  
            console.error('Error accessing the camera:', error);  
          });
          // 2. 获取设备列表
          let devices = await navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            return devices
          })
          .catch(function(err) {
              console.log(err.name + ": " + err.message);
          });
          console.log("这是devices",devices)

          devices.forEach(function(device) {
              if(device.kind === "videoinput" && device.deviceId !== 'default'){
                that.cameraList.push({"deviceId":device.deviceId,"deviceName":device.label})
              }
              else if(device.kind === "audioinput" && device.deviceId !== 'default'){
                that.microphoneList.push({"deviceId":device.deviceId,"deviceName":device.label})
              }
              
          });
          that.cameraPush = that.cameraList[0].deviceId
          that.microphonePush = that.microphoneList[0].deviceId
        },
        // 容器宽高，1280*720，即720p
        // canvas容器宽高，2560*1440，即1440p

        // ======
        // 容器宽高，960*540，即540p
        // dom宽高，640*480
        // canvas容器宽高，960*540，即540p
        // 将dom绘制到容器里，此时dom的大小就是640*480
        // 需求，不管切换多少分辨率，我要看到的dom都是一样大小，即
        // 960*540时，dom是640*480
        // 1280*720时，dom不能是640*480了，因为这样他就会对比上一个分辨率的dom看起来小了，960/1280=0.75,540/720=0.75，
        // 其实就是分辨率变大了，我们就要将图片也变大，即图片的宽是640/0.75=853.4，高是480/0.75=640
        // 坐标变化，960*540时，dom坐标是100,100
        // 1280*720时，dom的坐标不能再是100，100了，否则对比上一个分辨率看起来偏

        // changeCanvasAttr({newHeight,oldHeight}) {
        //     let currentResolutionRatio = this.resolutionRatio[3].value
        //     if (this.canvas) {
        //       const resolutionHeight =
        //         currentResolutionRatio.value / window.devicePixelRatio;
        //       const resolutionWidth =
        //         (currentResolutionRatio.value / window.devicePixelRatio) *
        //         this.videoRatio;
        //       this.canvas.setWidth(resolutionWidth);
        //       this.canvas.setHeight(resolutionHeight);
        //       appStore.allTrack.forEach((iten) => {
        //         const item = iten.canvasDom;

        //         if (item) {
        //           // 分辨率变小了，将图片变小
        //           if (newHeight < oldHeight) {
        //             const ratio2 = oldHeight / newHeight;
        //             item.left = item.left! / ratio2;
        //             item.top = item.top! / ratio2;
        //           } else {
        //             // 分辨率变大了，将图片变大
        //             const ratio2 = oldHeight / newHeight;
        //             item.left = item.left! / ratio2;
        //             item.top = item.top! / ratio2;
        //           }
        //         }
        //       });
        //       appStore.allTrack.forEach((iten) => {
        //         const item = iten.canvasDom;

        //         if (item) {
        //           // 分辨率变小了，将图片变小
        //           if (newHeight < oldHeight) {
        //             const ratio = newHeight / oldHeight;
        //             const ratio1 = (item.scaleX || 1) * ratio;
        //             item.scale(ratio1);
        //           } else {
        //             // 分辨率变大了，将图片变大
        //             const ratio = newHeight / oldHeight;
        //             const ratio1 = (item.scaleX || 1) * ratio;
        //             item.scale(ratio1);
        //           }
        //         }
        //       });

        //       changeCanvasStyle();
        //     }
        //   },
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handleClose(done){
            done();
          },
          handlePreview(file) {
            console.log(file);
          },
          handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
          },
          beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
          },
          generateRandomString() {  
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
            let result = '';  
            const charactersLength = characters.length;  
            for (let i = 0; i < 10; i++) {  
              result += characters.charAt(Math.floor(Math.random() * charactersLength));  
            }  
            return result;
          }
            
      }
    }
  </script>
  <style scoped>
    *{
      padding: 0;
      margin: 0;
    }
   .page{
    padding:0;
    margin: 0px 0px auto;
    height: 98vh;
    width: 100%; 
    background-image: url('../assets/live_bg.jpg');
    background-repeat: repeat;
    overflow: hidden;
   }
  .parent {  
    position: relative;  
    width: 100%; /* 可选，根据需要设置宽度 */  
    height: 100vh; /* 可选，根据需要设置高度，这里设置为视口高度 */  
  }  
  .videos {
    display: none;
    object-fit:fill;
  }  
  .index {
    height:100vh ;/*height可以根据你要创建的页面进行修改*/
    /* overflow-x: hidden;
    overflow-y: scroll; */
  }
  .container {
      position: relative;
      overflow: hidden;
      height: 100%;
      line-height: 0;
    }

    /* 菜单 */
    .menu-x {
    visibility: hidden; /* 隐藏菜单 */
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    background-color: #fff;
  }
 
  /* 菜单每个选项 */
  .menu-li {
    box-sizing: border-box;
    padding: 4px 8px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
 
  /* 鼠标经过的选项，更改背景色 */
  .menu-li:hover {
    background-color: antiquewhite;
  }
 
  /* 第一个选项，顶部两角是圆角 */
  .menu-li:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
 
  /* 最后一个选项，底部两角是圆角，底部不需要边框 */
  .menu-li:last-child {
    border-bottom: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
::v-deep .el-table--border th.el-table__cell,
::v-deep .el-table td.el-table__cell {
  border-bottom: none !important;
}
 
::v-deep .el-table--border .el-table__cell {
  border-right:none !important;
}
 
::v-deep .el-table--group, .el-table--border{
  border: none !important;
}
.el-table::before {
  height: 0;
}
::v-deep .el-table,
::v-deep .el-table .el-table__header-wrapper th,
::v-deep .el-table--border {
  background-color: transparent !important;
}
::v-deep .el-table tr,
::v-deep .el-table__body tr:hover > td {
  background-color: transparent !important;
}
::v-deep .el-table__body tr.current-row > td {
  background-color: #ecf5ff !important;
}
/* ::v-deep .el-table__body tr.current-row > td {
    background: #f0f9eb !important;
} */
  </style>
   