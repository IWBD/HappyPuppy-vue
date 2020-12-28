<template>
  <v-container fluid style="padding:0px; height:100%; background-color:#F8F3F2" v-resize="onResize">
    <div id="channel_content">
      <div class="channer_header">
        <div class="home_info">
          <div id="img_area">
            <v-list-item-avatar class="ma-0" style="width:80px; height:80px;">
              <v-img :src="!profile.img ? '' : '/api/img/get_img/member/' + profile.img" style="background-color:#A9E2F3">
                <v-icon v-if="!profile.img" size="50">mdi-dog</v-icon>
              </v-img>
            </v-list-item-avatar>
          </div>
          <div id="info_area" class="d-flex align-center" >
            <div>
              <div v-text="!profile.nickname ? email : profile.nickname"
                :style="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm  ? 'font-size:16px' : 'font-size:18px'"></div>
              <div v-text="!script_count ? '구독자 0명' : '구독자 ' + script_count + '명'"
                :style="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? 'font-size:13px' : 'font-size:15px'"></div>
            </div>
            <div id="scrip_btn">
              <v-btn tile v-if="!!iam" color="green" dark @click="openMenage" v-text="'관리'"></v-btn>
              <v-btn tile v-else color="green" dark @click="scripting" v-text="my_script ? '구독취소' : '구독'"></v-btn>
            </div>
          </div>
        </div>
        <div class="channel_tab">
          <v-tabs v-model="tab">
            <v-tab class="font-weight-bold">홈</v-tab>
            <v-tab class="font-weight-bold">동영상</v-tab>
          </v-tabs>
        </div>
      </div>
    </div>
    <div class="videos content" v-if="!!medias">
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="tabs">
            <div class="media_area">
              <div class="channer_header">
                <v-col>
                  <h4>
                    최근 업로드한 영상
                  </h4>
                </v-col>
                <div>
                  <v-layout wrap>
                    <v-col cols="12" sm="6" md="4" lg="4" xl="3" :class="mb_cols">
                      <v-responsive :aspect-ratio="16/9" class="media_box"  style="background-color:white">
                        <v-img :aspect-ratio="16/9" class="view_area" @click="openPlayMedia(first_media, 0)" :src="!first_media.img ? '':'/api/img/get_thumbnail/media/'+first_media.img"></v-img>
                      </v-responsive>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="media_info">
                        <v-layout>
                          <v-col cols="12" class="pa-0">
                            <p class="mb-1">
                              {{first_media.title}}
                            </p>
                            <p class="v_info ma-0">
                              조회수 {{first_media.count}}회 {{getDate(first_media.date)}}
                            </p>
                          </v-col>
                        </v-layout>
                    </div>
                    </v-col>
                  </v-layout>
                </div>
                <v-divider></v-divider>
              </div>
              <div class="channer_header">
                <v-col>
                  <h4>
                    인기 동영상
                  </h4>
                </v-col>
                <v-layout wrap>
                  <v-col cols="12" sm="6" md="4" lg="4" xl="3" v-for="(bar, i) in home_medias" :key="i" :class="mb_cols">
                    <v-responsive :aspect-ratio="16/9" class="media_box"  style="background-color:white">
                        <v-img :aspect-ratio="16/9" class="view_area" @click="openPlayMedia(bar, i)" 
                        :src="!bar.img ? '':'/api/img/get_thumbnail/media/'+bar.img"></v-img>
                    </v-responsive>
                    <div class="media_info">
                      <v-layout>
                        <v-col cols="12">
                          <p class="mb-1">
                            {{bar.title}}
                          </p>
                          <p class="v_info ma-0">
                            조회수 {{bar.count}}회 {{getDate(bar.date)}}
                          </p>
                        </v-col>
                      </v-layout>
                    </div>
                  </v-col>
                </v-layout>
              </div>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="tabs">
            <div class="media_area">
              <div class="channer_header">
                <div style="width:130px; height:50px; margin:10px 0px 0px 10px;">
                  <v-select
                    v-model="alignment"
                    :items="alignments"
                    filled
                    dense
                    @change="alignmentSelect"
                  ></v-select>
                </div>
                <v-layout wrap>
                  <v-col cols="12" sm="6" md="4" lg="4" xl="3" v-for="(bar, i) in medias" :key="i" :class="mb_cols">
                    <v-responsive :aspect-ratio="16/9" class="media_box"  style="background-color:white">
                        <v-img :aspect-ratio="16/9" class="view_area" @click="openPlayMedia(bar, i)" 
                        :src="!bar.img ? '':'/api/img/get_thumbnail/media/'+bar.img"></v-img>
                    </v-responsive>
                    <div class="media_info">
                      <v-layout>
                        <v-col cols="12">
                          <p class="mb-1">
                            {{bar.title}}
                          </p>
                          <p class="v_info ma-0">
                            조회수 {{bar.count}}회 {{getDate(bar.date)}}
                          </p>
                        </v-col>
                      </v-layout>
                    </div>
                  </v-col>
                </v-layout>
              </div>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
      <InputMaida ref="input_media"/>
      <PlayMedia ref="open_media" 
        v-bind:medias="medias"
        @child="getScript"
        @mediaThink="resetThinck"
        @parents="resetCount"/>
    </div>
    <div class="d-flex justify-center" style="padding-top:20%" v-else>
      게시된 영상이 없습니다.
    </div>
  </v-container>
</template>

<script>
import PlayMedia from "./PlayMedia";
import { mapGetters } from 'vuex';
const name = 'member'
export default {
  data: () => ({
    img:null,
    tab:null,
    email:null,
    alignment:'정렬 기준',
    alignments:['정렬 기준', '조회수', '좋아요', '싫어요', '최근 영상'],
    member_find : false,
    profile : {
      nickname : null,
      img : null,
    },
    channel_infos:null,
    channel_email:null,
    script_count:null,
    iam:null,
    first_media:{
      img:null
    },
    home_medias:null,
    medias:null,
    my_script:null,
    mb_cols:null
  }),
  computed:{
    ...mapGetters(name, {
      login_info: 'GET_LOGIN_INFO'
    }),
  },
  methods:{
    resetThinck(data){
      this.medias[data.index] = data.media
    },
    resetCount(data){
      this.medias[data.index].count ++;
    },
    openPlayMedia(media, idx){
      this.$refs.open_media.open(media, idx);
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
    openMenage(){
      this.$router.push('/memberMedia');
    },
    scripting(){
      const email = this.channel_email;
      // console.log(this.my_script);
      const url = !this.my_script ? '/api/media/scripting/' + email : '/api/media/unscripting/' + email;
      this.$http.get(url).then(res => {
        if(res.data.code === 1){
          this.my_script = !this.my_script;
          this.script_count = this.my_script ? ++this.script_count : --this.script_count ;
          const data = this.profile;
          data.key = 'resetScripts';
          data.script = this.my_script;
          data.p_img = data.img;
          console.log(data);
          this.$emit('child', data);
        }else{
          alert("로그인이 안되있거나, 세션이 만료되었습니다. 로그인 이후 가능한 서비스 입니다.");
        }
        return;
      }).catch(err => {
        console.log(err);
        alert('서버 문제 발생');
      })
    },
    onResize(){
      this.mb_cols = window.innerWidth > 599 ? "pa-2" : "pa-0";
    },
    firstResize(){
      var {onResize, firstResize} = this;
      this.member_find = true;
      setTimeout(function() {
        const bl = onResize();
        if(!bl){
          return firstResize();
        }
      }, 500);
    },
    sort(key, arr){
      var rs_arr = [];
      for(let i = 0; i < arr.length; i++){
        rs_arr.push(arr[i]);
      }
      rs_arr.sort(function(a, b) {
          return a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0;
      });
      console.log(rs_arr);
      return rs_arr;
    },
    alignmentSelect(){
      let key = ''
      var arr = [];
      const {home_medias, alignment} = this;
      switch(this.alignment){
        case '정렬 기준' :
          break;
        case '조회수' :
          key = 'count';
          break;
        case '좋아요' :
          key = 'good';
          break;
        case '싫어요' :
          key = 'bad'
          break;
        case '최근 영상' : 
          key = 'date';
          break;
        default : 
          break;
      }
      if(key === ''){
        arr = this.home_medias;
      }else{
        arr = this.sort(key, this.medias);
      }
      this.medias = arr;
    },
    setHomeInfo(items, iam){
      this.channel_infos = items;
      this.iam = iam;
      this.profile = items.member_profile;
      if(!items.medias[0]){
        this.script_count = null;
        this.medias = null;
      }else{
        this.script_count = items.medias[0].sl;
        this.first_media = items.first_media;
        this.home_medias = items.medias;
        this.medias = items.medias;
      }
      this.my_script = !!items.this_script[0].count;
    },
    getChannelInfo(email){
      this.channel_email = email;
      this.$http.get('/api/media/get_channel/' + email).then(res => {
          if(!res.data.code || res.data.code === 2){
            alert('존재하지 않는 채널이거나, 채널 정보를 가져올 수 없습니다.');
            this.$router.push('/education');
          }else{
            this.firstResize();
            this.setHomeInfo(res.data.result, res.data.iam); 
            this.email = email;
          }
      }).catch(err => {
          alert('채널 정보를 가져오는데 문제가 발생했습니다.');
          this.$router.push('/education');
      })
    },
    getScript(data){
      this.my_script = !this.my_script;
      this.script_count = data ? ++this.script_count : --this.script_count;
    }
  },
  created(){
      const email = this.$route.params.email;
      if(!!email){
        this.getChannelInfo(email);
      }
  },
  watch:{
    login_info:function(hook){
      if(!hook.number){
        this.iam = false;
      }else{
        this.getChannelInfo(this.channel_email);
      }
    },
  },
  components:{
    PlayMedia
  }
}
</script>

<style>
@import '../../css/media/channel.css';
</style>

