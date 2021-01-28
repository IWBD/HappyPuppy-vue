<template>
  <v-app>
    <div  style="max-height:184px" v-if="wep.wep">
      <v-toolbar width="100%" height="60px" flat >
        <v-spacer></v-spacer>
        <a href="/">
            <img src="./images/logo.png" width="104">
        </a>
        <v-spacer></v-spacer>
        <v-toolbar style="border-top: 1px solid #E3DFDE;" flat height="60px">
          <v-tabs show-arrows grow centered>
            <v-tab v-for="bar in title" :key="bar.title" :to="bar.to" class="font-weight-bold">{{ bar.titleName }}</v-tab>
          </v-tabs>
        </v-toolbar>
        <v-menu
        style="z-index:99;"
          offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item  @click="childLogin">
              <v-list-item-title v-text="login_info.l_title"></v-list-item-title>
            </v-list-item>
            <v-list-item @click="childJoin">
              <v-list-item-title v-text="login_info.r_title" ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-spacer></v-spacer>
      </v-toolbar>
    </div>
    <v-navigation-drawer v-model="mobile_header" app clipped v-if="wep.mobaile">
      <v-list dense v-for="bar in title" :key="bar.title">
        <v-list-item link :to="bar.to">
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{bar.titleName}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="white" id="mb_header" clipped-left :height="mb_header_height" v-if="wep.mobaile">
      <v-app-bar-nav-icon @click.stop="mobile_header = !mobile_header"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <a href="/">
        <img src="./images/logo.png" width="104">
      </a>
      <v-spacer></v-spacer>
      <v-menu offset-y>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item  @click="childLogin">
              <v-list-item-title v-text="login_info.l_title"></v-list-item-title>
            </v-list-item>
            <v-list-item @click="childJoin">
              <v-list-item-title v-text="login_info.r_title" ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>
    <v-content ref="main_content" :class="wep.wep ? 'wep_content' : 'mobile_content'" style="background-color:#f8f3f2" v-resize="onResize">
      <router-view :key="$router.fullPath" 
      v-bind:login_number="login_info.number"
      v-bind:mb_header_view="mb_header_view"
      @child="loginCheck"
      ></router-view>
    </v-content>
    <LoginForm ref="login_form"
     v-bind:login_info="login_info" 
     @child="change"
     @join="childJoin"
     />
    <JoinForm ref="join_form" v-bind:login_info="login_info"/>
  </v-app>
</template>

<script>
import LoginForm from './components/apps/LoginForm'
import JoinForm from './components/apps/JoinForm'
import { mapMutations, mapGetters } from 'vuex'
const member = 'member';
export default {
  data: () => ({
    title: [
      { titleName: 'HOME',  to: '/'}, 
      { titleName: 'EVENT', to: '/event'},
      { titleName: 'MEDIA', to: '/education' },
      { titleName: 'LOST DOG', to: '/abandonedDog' },
    ],
    xs_b : false,
    mobile_header: false,
    el : null,
    login_dialog : false,
    drawer: null,
    point : {},
    wep_content : "padding:0px; border-top: 1px solid #E3DFDE; height:100%;" ,
    mobaile_content : "padding-top:60px;  height:100%;",
    mb_header_height : "60px",
    mb_header_view : true,
  }),
  components: {LoginForm, JoinForm},
  mounted(){
    this.loginCheck();
    this.mbHeaderControl();
    this.main_content = this.$refs.main_content;
  },
  methods :{
    //window 사이즈 감지
    //조건에 따라 레이아웃 변수 변경
    onResize(){
      const height = `${window.innerHeight - 61}px`;
      if(!this.main_content){
        this.$refs.main_content.$el.style.minHeight = height;
        return
      }
      this.main_content.$el.style.minHeight = height;
    },
    //로그인 정보 변경
    ...mapMutations(member, ['MU_LOGIN_INFO']),
    change(data){
      this.MU_LOGIN_INFO(data);
      // this.$router.go();
    },
    //login or logout 버튼 클릭
    childLogin(){
      this.$refs["login_form"].inOrOut_button()
    },
    //join or mypage 버튼 클릭
    childJoin(){
      this.$refs["join_form"].joinOrMypageButton()
    },
    //모바일 화면에서 스크롤에 따라 헤더 숨김
    mbHeaderControl(){
      const headerHeight = this.headerHeight;
      let y = window.scrollY;
      window.addEventListener('scroll', (delta) => {
        let _y = window.scrollY, bl;
        if(_y < 60){
          bl = true;
        }else if(_y < y){
          bl = true;
        }else{
          bl = false;
        }
        y = _y; 
        headerHeight(bl);
      })
    },
    //헤더 숨김 변수 변경
    headerHeight(bl){
      this.mb_header_view = bl;
    },
    //로그인 여부 확인 요청
    loginCheck(){
      this.$http.get('/api/login_spv').then((res) => {
        const info = res.data.code === 1 ?
        {
          number: res.data.login_code,
          l_title: "LOGOUT",
          r_title: "MYPAGE"
        } : {
          number: 0,
          l_title: "LOGIN",
          r_title: "SIGN UP"
        };
        this.change(info);
      }).catch(err => {
          alert(err);
      });
    }
  },
  watch : {
    //헤더 숨김 변수 감지
    mb_header_view : function(hook){
      if(this.wep.mobaile){
        document.getElementById("mb_header").style.opacity = hook ? "1" : "0"
        const search_box = document.getElementById('search_box');
        if(!!search_box){
          search_box.style.top = hook ? "60px" : "0px"
        }
      }
    },
  },
  computed : {
    //vuetify breakpoint 변화 감지에 따라 레이아웃 변수 변경
    wep(){
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm ? {wep : false, mobaile : true} : {wep : true, mobaile : false};
    },
    //로그인 정보
    ...mapGetters(member, {
      login_info: 'GET_LOGIN_INFO'
    }),
  },
}
</script>

<style>
@import './css/app.css';
</style>
