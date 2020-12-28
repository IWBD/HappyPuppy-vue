<template>
  <v-container fluid style="padding:0px; height:100%; background-color:#F8F3F2">
    <div id="member_page">
      <div id="member_banner">
        <div>
          <v-list-item-avatar class="ma-0" style="margin:0 auto; width:100px; height:100px;">
            <v-img :src="!member_info.img ? '' : '/api/img/get_img/member/' + member_info.img" style="background-color:#A9E2F3">
              <v-icon v-if="!member_info.img" size="50">mdi-dog</v-icon>
            </v-img>
          </v-list-item-avatar>
        </div>
        <span>
          <h3 v-text="!!member_info.nickname ? member_info.nickname + '님, ' : member_info.email + '님, '">&nbsp;</h3>
          <h3> 환영합니다.</h3>
        </span>
      </div>
        <v-layout wrap>
          <v-col cols="12" sm="6" v-for="(bar, i) in 4" :key="i">
            <v-card class="cards" tile
            ref="cards" @click="test"
            elevation="1" @mouseover="cardOver(i)" @mouseout="cardOut(i)">
              <div class="card_base" v-if="i === 0">
                <h3>내 정보</h3>
                <div id="member_info">
                  <v-layout wrap>
                    <v-col class="pa-0 mr-2 card_col" cols="3">
                      <v-list-item-avatar class="ma-0 position_center" style="width:80px; height:80px;">
                        <v-img :src="!member_info.img ? '' : '/api/img/get_img/member/' + member_info.img" style="background-color:#A9E2F3">
                          <v-icon v-if="!member_info.img" size="50">mdi-dog</v-icon>
                        </v-img>
                      </v-list-item-avatar>
                    </v-col> 
                    <v-col class="pa-0 card_col" cols="8">
                      <div class="profile position_center">
                        <div>
                          <p>계정 : </p>
                          <p>{{member_info.email}}</p>
                        </div>
                        <div>
                          <p>닉네임 : </p>
                          <p v-text="!!member_info.nickname ? member_info.nickname : '비설정'"></p>
                        </div>
                      </div>
                    </v-col> 
                  </v-layout>
                </div>
                <Profile v-bind:member_info="member_info" @child="changeProfile"/>
              </div>
              <div class="card_base" v-if="i === 1">
                <h3>행사</h3>
                <div id="member_info">
                  <v-col cols="12 card_col pa-0">
                    <div class="position_center" id="event">
                      현재 {{member_info.ev}}개의 행사를 등록하셨습니다.
                    </div>
                  </v-col>
                </div>
                <v-btn tile outlined @click="$router.push('memberEvent')">관리</v-btn>
              </div>
              <div class="card_base" v-if="i === 2">
                <h3>내 미디어</h3>
                <div id="member_info">
                  <v-col class="pa-0 card_col" cols="12" >
                    <div class="media_table" v-for="bar in c_info_name" :key='bar.key'>
                      <div class="name" v-text="bar.title"></div>
                      <div class="con" v-text="!channel_info ? 0 : channel_info[bar.key]"></div>
                    </div>
                  </v-col> 
                </div>
                <v-btn tile outlined @click="$router.push('memberMedia')">관리</v-btn>
              </div>
              <div class="card_base" v-if="i === 3">
                <h3>실종반려견</h3>
                <div id="member_info">
                  <v-col cols="12 card_col pa-0">
                    <div class="position_center" id="event">
                      현재 {{member_info.ab}}개의 반려견을 등록하셨습니다.
                    </div>
                  </v-col>
                </div>
                <v-btn tile outlined @click="$router.push('memberAbandoned')">관리</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-layout>
    </div>
  </v-container>
</template>

<script>
import Profile from "../components/memberPage/Profile";

import { mapGetters } from 'vuex';
const name = 'member'
export default {
  props:[],
  data: () => ({
    dialog : false,
    items: [
      { title: '회원정보' },
      { title: '행사' },
      { title: '미디어' },
      { title: '실종반려견' },
    ],
    elevation: [1, 1, 1, 1],
    member_info:{
      ab: null,
      email: '',
      ev: null,
      img: null,
      nickname: '',
      num: null,
    },
    c_info_name : [
      { title:'구독 자 : ', key:'sc' }, 
      { title:'조회 수 : ', key:'mc' }, 
      { title:'좋아요 : ', key:'good' }, 
      { title:'싫어요 : ', key:'bad' }
    ],
    channel_info:null,
  }),
  methods:{
    cardOver(i){
     this.$refs.cards[i].elevation = 6;
    },
    cardOut(i){
      this.$refs.cards[i].elevation = 1;
    },
    getMemberInfo(){
      this.$http.get('api/member/get_info').then(res => {
        if(res.data.code === 1){
          let item = res.data.item[0];
          item.ab = !item.ab ? 0 : item.ab;
          item.ev = !item.ev ? 0 : item.ev;
          this.member_info = res.data.item[0];
          this.getChannelInfo();
          return;
        }else if(res.data.code === 2) {
          alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
        }else{
          alert('사용자 정보를 가져오지 못했습니다.');
        }
        this.$router.push('/');
      }).catch(err => {
        console.log(err);
        alert('사용자 정보를 가져오지 못했습니다.');
        this.$router.push('/');
      })
    },
    getChannelInfo(){
      this.$http.get('api/member/get_channel_info').then(res => {
        if(res.data.code === 1){
          this.channel_info = res.data.result.length > 0 ? res.data.result[0] : null;
          return
        }else if(res.data.code === 2) {
          alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
        }else{
          alert('사용자 정보를 가져오지 못했습니다.');
        }
        this.$router.push('/');
      }).catch(err => {
          console.log(err);
          alert('사용자 정보를 가져오지 못했습니다.');
          this.$router.push('/');
      })
    },
    changeProfile(data){
      if(data.bl){
        //이미지 변경
        this.member_info.img = data.item;
      }else{
        //닉네임 변경
        this.member_info.nickname = data.item;
      }
    }
  },
  mounted(){
  },
  created(){
    this.getMemberInfo();
  },
  watch:{
    login_info: function(hook){
      !!hook.number || this.$router.push('/');
    },
  },
  computed:{
    ...mapGetters(name, {
        login_info: 'GET_LOGIN_INFO'
    }),
  },
  components: {
    Profile
  }
}
</script>

<style>
  @import '../css/member/memberPage.css';
</style>

