<template>
    <v-dialog
      v-model="dialog"
      :fullscreen="full"
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <div ref="media_dialog" class="media_dialog" v-resize="onResize">
        <div :class="toolbar" ref="toolbar">
          <div style="width:100%; height:100%;">
            <div style="width:35px; float: right;">
              <v-btn icon width="30px" height="30px">
                <v-icon size="30px" color="#F5F5F5" @click="closeMedia">mdi-close-box</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div class="areas" ref="areas">
          <div v-if="!cols" style="width:100%; height:20px;"></div>
          <div id="media_area" ref="media_area" v-if="media">
            <v-card tile ref="video_card" 
            :width="video_width"
            :height="video_height">
              <video style="width:100%; height:100%" 
                ref="_video"
                playsinline 
                preload="metadata"
                controls 
                :src="'/api/media/get_video/' + media.video"
                @mouseover="videoOver"
                @mouseout="videoOut"
                @touchstart="videoTouchStart"
                @touchend="videoTouchEnd"
              >
              </video>
            </v-card>
            <div class="info_area" ref="info_area">
              <v-tabs
                v-model="tab"
                height="0"
                background-color="transparent"
                color="basil"
                grow
              ></v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item class="back_color">
                  <v-col cols="12" class="pb-0" :class="mb_cols">
                    <div class="tag">{{media.tag}}</div>
                    <div class="content" style="margin:0px; background-color:#f5f5f5">
                      {{media.title}}
                    </div>
                    <v-card v-if="media.content" v-text="media.content" tile 
                      color="#F5F5F5" outlined class="sb_content"></v-card>
                    <v-layout class="count date" >
                      <v-card title elevation="0" color="#F5F5F5" width="250px">
                        조회수 {{media.count}}회 / {{formatDate(media.date)}}
                      </v-card>
                      <v-spacer></v-spacer>
                      <v-card v-if="dialog_width > 560" elevation="0" color="#F5F5F5">
                        <v-btn tile color="#F5F5F5" outlined @click="myMediaThinck(1)" >
                          <v-icon color="#616161" size="20">mdi-thumb-up-outline</v-icon>
                            <div style="color:#616161">{{media.good}}</div>
                        </v-btn>
                        <v-btn tile color="#F5F5F5" outlined @click="myMediaThinck(0)" >
                          <v-icon color="#616161" size="20">mdi-thumb-down-outline</v-icon>
                            <div style="color:#616161;">{{media.bad}}</div>
                        </v-btn>
                      </v-card>
                    </v-layout>
                  </v-col>
                  <v-divider v-if="dialog_width <= 560" :class="divider_margin"></v-divider>
                  <v-layout wrap>
                    <v-col v-if="dialog_width <= 560" cols="12" class="pa-0" :class="mb_cols">
                      <div style="height:100%;" class="d-flex justify-start">
                        <div class="d-flex align-center" style="height:100%">
                          <v-btn height="60px" tile color="#F5F5F5" outlined
                            @click="myMediaThinck(1)" >
                            <v-icon color="#616161" >mdi-thumb-up-outline</v-icon>
                              <div style="color:#616161">{{media.good}}</div>
                          </v-btn>
                          <v-btn height="60px" tile color="#F5F5F5" outlined
                            @click="myMediaThinck(0)">
                            <v-icon color="#616161">mdi-thumb-down-outline</v-icon>
                              <div style="color:#616161">{{media.bad}}</div>
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                    <v-divider :class="divider_margin"></v-divider>
                    <v-col cols="12" :class="mb_cols">
                      <v-list-item-avatar class="ma-0" style="width:50px; height:50px; float: left;">
                          <v-img :src="!media.p_img ? '' : '/api/img/get_img/member/' + media.p_img" style="background-color:#A9E2F3">
                            <v-icon v-if="!media.p_img" size="40">mdi-dog</v-icon>
                          </v-img>
                      </v-list-item-avatar>
                      <div class="ml-2 channel_info">
                        <div v-text="media.nickname ? media.nickname : media.email">
                        </div>
                        <div class="script_count" 
                        v-text="ch_count === null ? '' 
                        : '구독자 ' + ch_count + '명'">
                        </div>
                      </div>
                      <v-spacer></v-spacer>
                      <div style="height:100%;" class="d-flex justify-end">
                        <div class="d-flex align-center" style="height:100%">
                          <v-btn v-if="iam" text color="blue" v-text="'관리'" @click="$router.push('memberMedia')"></v-btn>
                          <v-btn v-else text color="blue" @click="scripting"
                          v-text="sc_whether ? '구독취소' : '구독'"></v-btn>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" :class="mb_cols" v-if="!!media.comment">
                      <v-expansion-panels class="pa-0">
                        <v-expansion-panel class="pl-3" style="background-color:#f5f5f5;">
                          <v-expansion-panel-header class="pa-1">
                            설명
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-textarea 
                                v-model="media.comment"
                                dence auto-grow rows="1" dense
                                row-height="5"
                                readonly
                                hide-details
                            ></v-textarea>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-layout>
                  <v-divider :class="divider_margin"></v-divider>
                  <v-col cols="12" :class="mb_cols">
                    <v-btn tile block @click="tab = 1" v-text="'댓글 ' + m_count"></v-btn>
                  </v-col>
                  <v-divider :class="divider_margin"></v-divider>
                  <!-- 모바일 다음 영상 -->
                  <v-col v-if="cols" cols="12" :class="mb_cols">
                    <div id="next_area" style="width:100%;" ref="mb_next_area">
                      <v-card tile outlined>
                        <v-list width=100% dense class="pa-0">
                          <v-list-group color="primary" v-model="next_media" class="pa-0">
                              <template v-slot:activator>
                                  <v-list-item-title >다음 영상</v-list-item-title>
                              </template>
                              <v-list-item @click="newViewMedia(i)" class="py-1 px-0" v-for="(bar, i) in medias" :key="i" link>
                                <v-layout wrap>
                                  <v-col cols="5" class="pa-0">
                                    <v-responsive :aspect-ratio="16/9">
                                      <v-img :aspect-ratio="16/9" style="width:100%; height:100%;" :src="'/api/img/get_thumbnail/media/' + bar.img"></v-img>
                                    </v-responsive>
                                  </v-col>
                                  <v-col cols="7" class="pa-0 pl-2">
                                    <div class="_title" v-text="bar.title"></div>
                                    <div class="channel_name" v-text="bar.nickname ? bar.nickname : bar.email">
                                    </div>
                                    <div class="_info">
                                      조회 {{bar.count}} / {{formatDate(bar.date)}}
                                    </div>
                                  </v-col>
                                </v-layout>
                              </v-list-item>
                          </v-list-group>
                        </v-list>
                      </v-card>
                    </div>  
                  </v-col>
                </v-tab-item>
                <v-tab-item class="back_color">
                  <v-col cols="12" :class="mb_cols">
                    <v-card tile color="#F5F5F5" outlined title height="30px">
                      <div style="height:100%" class="d-flex align-center">
                        <div style="display:inline-block" v-text="'댓글 ' + m_count">
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="tab = 0">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                  <v-divider></v-divider>
                  <InputComment
                  v-bind:my_info="my_info"
                  v-bind:mb_cols="mb_cols"
                  v-bind:offset_width="offset_width"
                  @child="inputComment"/>
                  <Comment
                  v-bind:my_info="my_info"
                  v-bind:comments="comments"
                  v-bind:offset_width="offset_width"
                  v-bind:fild_bls="fild_bls"
                  @child="inputComment"
                  @parents="setCommentsThink"/>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </div>    
          <!-- 웹 다음 영상     -->
          <div id="next_area" ref="next_area">
            <v-card ref="nexr_card" color="#F5F5F5" tile outlined>
              <v-list width=100% dense class="pa-0">
                <v-list-group   v-model="next_media" class="pa-0">
                    <template v-slot:activator>
                        <v-list-item-title >다음 영상</v-list-item-title>
                    </template>
                    <div ref="wep_nexts">
                      <v-list-item @click="newViewMedia(i)"  v-for="(bar, i) in medias" :key="i" link>
                        <v-layout wrap>
                          <v-col cols="5" class="pa-0">
                            <v-responsive :aspect-ratio="16/9">
                              <v-img :aspect-ratio="16/9" style="width:100%; height:100%;" :src="'/api/img/get_thumbnail/media/' + bar.img"></v-img>
                            </v-responsive>
                          </v-col>
                          <v-col cols="7" class="pa-0 pl-2">
                              <div class="_title" v-text="bar.title">
                              </div>
                              <div class="channel_name" v-text="bar.nickname ? bar.nickname : bar.email">
                              </div>
                              <div class="_info">
                                조회 {{bar.count}} / {{formatDate(bar.date)}}
                              </div>
                          </v-col>
                        </v-layout>
                      </v-list-item>
                    </div>
                </v-list-group>
              </v-list>
            </v-card>
          </div>  
        </div>
      </div>
    </v-dialog>
</template>

<script>
import Comment from "./Comment";
import InputComment from "./InputComment";
export default {
  props:['medias'],
  data: () => ({
    iam:null,
    dialog:false,
    full : true, 
    dialog_width : null,
    dialog_height : null,
    full_height : null,
    first_height: false,
    video_height:null,
    video_width:null,
    wrap:null,
    mb_cols:null,
    cols:null,
    tab:0,
    next_media:false,
    next_video_height : null,
    toolbar:null,
    toolbarView:null,
    mouseover:false,
    startY : null,
    startMoveY : null,
    endY:0,
    channel_profile : {
        nickname : null,
        img : null,
        script_count : null
    },
    media:null,
    m_count:null,
    sc_whether:null,
    ch_count:null,
    comments:null,
    my_info:{
      nickname:null,
      img:null,
    },
    offset_width:null,
    media_idx:null,
    fild_bls:null,
  }),
  methods:{
    newViewMedia(i){
      if(i === this.idx){
        return
      }
      this.tab = 0;
      this.open(this.medias[i], i);
      this.getComments();
    },
    myMediaThinck(think){
      const url = '/api/media/my_media_think/' + this.media.num + '/' + think;
      this.$http.get(url).then(res => {
        if(!res.data.code){
          alert('좋아요, 싫어요가 실패하였습니다.');       
        }else if(res.data.code === 2){
          alert('로그인이 안돼있거나, 세션이 만료되었습니다. 로그인 해주세요.');
        }else{
          this.setThink(res.data.code, think);
        }
      }).catch(err => {
        console.log(err);
        alert('좋아요, 싫어요가 실패하였습니다.');       
      })
    },
    setCommentsThink(data){
      this.comments = data;
    },
    setThink(code, think){
      const k = !!think ? 'good' : 'bad';
      const keys = !!think ? ['good', 'bad'] : ['bad', 'good'];
      if(code === 1){
        this.media[keys[0]] ++;
      }else if(code === 3){
        this.media[keys[0]] --;
      }else if(code === 4){
        this.media[keys[0]] ++;
        this.media[keys[1]] --;
      }
      const data = {
        index : this.media_idx,
        media : this.media
      }
      this.$emit('mediaThink', data);

    },
    closeMedia(){
      const _video = this.$refs._video;
      _video.pause();
      this.tab = 0;
      this.dialog = false;
    },
    formatDate(date){
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; 
    },
    getComments(){
      this.$http.get('/api/media/get_comments/' + this.media.num).then(res => {
        if(res.data.code === 1){
          var comments = res.data.result;
          var arrs = [];
          for(let i = 0; i < comments.length; i++){
            arrs[i] = false;
          }
          this.fild_bls = arrs;
          this.comments = comments;
        }else{
          alert('댓글 정보를 가져오지 못했습니다.');
          this.tab = 0;
        }
      }).catch(err => {
        console.log(err);
        alert('댓글 정보를 가져오지 못했습니다.');
        this.tab = 0;
      })
    },
    getDate(item){
      const now_date = new Date();
      const date = new Date(item);
      const rs_item = {
        year : now_date.getFullYear() - date.getFullYear(),
        month : now_date.getMonth() - date.getMonth(),
        date : now_date.getDate() - date.getDate(),
      }
      if(rs_item.year > 0){
        return rs_item.year + '년 전';
      }
      if(rs_item.month > 0){
        return rs_item.month + '개월 전';
      }
      if(rs_item.date > 0){
        return rs_item.date + '일 전';
      }
      var time = (now_date.getTime() - date.getTime()) / 60000; //분
      if(time/60 >= 1){
        return Math.floor(time/60) + '시간 전';
      }
      if(time >= 1){
        return Math.floor(time) + '분 전';
      }
      return '방금 전';
    },
    getProfile(){
      const url = '/api/media/m_count/'  + this.media.num + '/' + this.media.email;
      this.$http.get(url).then(res => {
        if(!!res.data.code){
          this.setMemberInfo(res.data);
        }else{
          alert('댓글 정보를 가져오지 못했습니다.');
        }
      }).catch(err => {
        console.log(err);
        alert('댓글 정보를 가져오지 못했습니다.');
      })
      this.dialog = true;
      this.playVideo();
    },
    inputComment(data){
      const params = {
          m_target : this.media.num,
          c_target : !data.c_num ? null : data.c_num,
          reply : !data.reply ? null : data.reply.email,
          comment : data.comment,
      }
      this.$http.post('/api/media/input_comment', params).then(res => {
        if(res.data.code === 1){
          this.getComments();
          this.getProfile();
        }else if(res.data.code === 2){
          alert('로그인이 안되있거나, 세션이 만료되었습니다. 다시 로그인 해주세요.');
        }else{
          alert('댓글 등록에 실패하였습니다.');
        }
      }).catch(err => {
        console.log(err);
        alert('댓글 등록에 실패하였습니다.')
      })
    },
    open(media, idx){
        this.media = media;
        this.media_idx = idx;
        this.getProfile();
    },
    onResize(){
      const {innerWidth, innerHeight} = window;
      this.dialog_width = innerWidth;
      this.dialog_height = innerHeight;
    },
    playVideo(){
      let playVideo = this.playVideo;
      if(!this.$refs._video){
        setTimeout(() => {
          playVideo();
        }, 500);
      }else{
        this.$refs._video.onloadedmetadata  = function(){
          this.play();
        }
        this.$refs._video.play();
        this.upMediaCount();
      }
    },
    upMediaCount(){
      const num = {num : this.media.num}
      this.$http.post('/api/media/media_counting', num).then(res => {
        if(!res.data.code){
          alert("조회수 증가에 실패하였습니다.");
        }else{
          this.setMediaCount(res.data.code);
        }
      }).catch(err => {
        console.log(err);
        alert("조회수 증가에 실패하였습니다.");
      })
    },
    setMediaCount(code){
      if(code === 1){
        this.$emit('parents', {index:this.media_idx}); 
      }
    },
    scripting(){
      const email = this.media.email;
      const url = !this.sc_whether ? '/api/media/scripting/' + email : '/api/media/unscripting/' + email;
      this.$http.get(url).then(res => {
        if(res.data.code === 1){
          this.sc_whether = !this.sc_whether;
          this.ch_count = this.sc_whether ? ++this.ch_count : --this.ch_count ;
          this.$emit('child', this.sc_whether);
        }else{
          alert("로그인이 안되있거나, 세션이 만료되었습니다. 로그인 이후 가능한 서비스 입니다.");
        }
      }).catch(err => {
        console.log(err);
        alert('서버 문제 발생');
      })
    },
    setMemberInfo(data){
      this.iam = data.iam;
      this.m_count = data.result[0].m_count;
      this.sc_whether = !!data.result[0].sc_whether;
      this.ch_count = data.result[0].ch_count;
      if(!!data.my_info){
        this.my_info = data.my_info
      }else{
        this.my_info = {
          nickname:0,
          img:0
        }
      }
    },
    setMediaWidth(hook){
      const {media_area, next_area, video_card} = this.$refs;
      if(!!media_area.style){
        if(hook >= 960){
          const width = this.dialog_width > 1600 ? 1600 - 470 : this.dialog_width - 470;
          media_area.style.width = width + 'px';
          next_area.style.display = 'block';
          next_area.style.width = '450px';
          this.video_width = width + 'px';
          this.video_height = width / 16 * 9 + 'px';
          this.cols = false;
          this.next_media = true;
          this.toolbar = "wep_toolbar"
          this.offset_width = width;
        }else{
          const width = this.dialog_width;
          media_area.style.width = '100%';
          next_area.style.display = 'none';
          this.video_width = width + 'px';
          this.video_height = width / 16 * 9 + 'px';
          this.cols = true;
          this.next_media = false;
          this.toolbar = "mb_toolbar"
          this.offset_width = width;
        }
        if(hook > 1600){
          this.mb_cols = 'px-0';
          this.divider_margin = '';
        }else{
          this.mb_cols = '';
          this.divider_margin = 'mx-2';
        }
        this.setMediaHeight(window.innerHeight);
      }else{
        let setMediaWidth = this.setMediaWidth, item = hook
        setTimeout(function(){
          setMediaWidth(item);
        },500)
      }
    },
    setMediaHeight(hook){
      const {media_dialog, next_area, info_area} = this.$refs;
      let height;
      if(!this.cols){
        height = hook - Number(this.video_height.split('px')[0]) - 30 -20 + 'px';
        next_area.style.maxHeight = hook - 30 + 'px';
      }else{
        height = hook - Number(this.video_height.split('px')[0]) + 'px';
      }
      media_dialog.style.maxHeight = hook + 'px';
      info_area.style.maxHeight = height;
      info_area.style.minHeight = height;
    },
    videoTouchStart(){
      this.startY = event.changedTouches[0].screenY;
      console.log(this.startY); 
      this.startMoveY = 0;
      this.videoOver();
    },
    videoTouchEnd(){
      this.viewToolbar(true);
    },
    videoOver(){
      if(this.cols){
        this.mouseover = true;
        clearTimeout(this.toolbarView);
        this.toolbarView = null;
        this.$refs.toolbar.style.display = 'block';
      }
    },
    videoOut(){
      if(this.cols && this.mouseover){
        this.mouseover = false;
        this.viewToolbar(true);
      }
    },
    viewToolbar(hook){
      let toolbar = this.$refs.toolbar;
      if(hook){
        if(!!this.toolbarView){
          clearTimeout(this.toolbarView);
          this.toolbarView = null;
        }
        this.toolbarView = setTimeout(() => {
          toolbar.style.display = 'none'
          clearTimeout(this.toolbarView);
        }, 1000);
      }else{
        if(!!this.toolbarView){
          clearTimeout(this.toolbarView);
          this.toolbarView = null;
        }
        toolbar.style.display = 'block';
      }
    },
  },
  watch:{
    cols: function(hook){
      this.viewToolbar(hook);
    },
    dialog_width: function(hook){
      this.setMediaWidth(hook);
    },
    dialog_height: function(hook){
      this.setMediaHeight(hook);
    },
    tab : function(hook){
      if(!!hook){
        this.getComments();
      }
    }
  },
  components:{
    Comment, InputComment
  }
}
</script>

<style scoped>
@import '../../css/media/playmedia.css';
</style>

