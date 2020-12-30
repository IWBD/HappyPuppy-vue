<template>
  <v-container fluid style="padding:0px; height:100%;" v-resize="onResize">
    <div id="mb_search_btn" ref="mb_search_btn">
      <v-btn icon width="48px" height="48px" @click="searchForm(true)">
        <v-icon>mdi-magnify</v-icon>  
      </v-btn>
    </div>
    <div id="mb_search_fild" ref="mb_search_fild">
      <v-toolbar class="pa-0" height="60px" >
        <v-btn class="hd_btn"  tile dark color="#1E88E5" @click="searchForm(false)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          label="검색" style="margin:10px 5px;"
          v-model="keyword"  hide-details="auto" single-line
          elevation="0" clearable dense 
          @keyup.enter="keywordPush"
        ></v-text-field>
        <v-btn class="hd_btn"  tile dark color="#1E88E5" @click="keywordPush">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
    <div id="media_menu" style="height:inherit" ref="left_navigation"
      @mouseover="openMenu" @mouseout="closeMenu">
      <v-list dense :width="menu_width" style="height:inherit">
        <v-list-item>
          <v-list-item-icon   class="d-flex aligin-center" style="margin:12px 0px 0px 0px; width:40px;">
            <v-btn width="24px" icon  @click="keywordPush">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-content class="pa-0">
            <v-text-field label="검색" style="margin-top:10px"
            v-model="keyword"  hide-details="auto" 
            outlined elevation="1" clearable dense 
            @keyup.enter="keywordPush"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="media_divider"></v-divider>
        <v-list-item-group v-model="nv"  color="primary" mandatory>
          <v-list-item  v-for="(item, i) in first_items" :key="i">
            <v-list-item-icon  class="d-flex aligin-center">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="media_divider"></v-divider>
          <v-subheader v-if="!login_number">로그인 필요</v-subheader>
          <v-list-item :disabled="!login_number" v-for="(item, i) in second_items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item style="display:none;"></v-list-item>
          <v-list-item  style="display:none;"></v-list-item>
          <v-divider class="media_divider"></v-divider>
          <v-subheader v-if="login_number">구독 채널</v-subheader>
          <v-list-item v-for="(bar, i) in my_scripts" :key="i">
            <v-list-item-icon>
              <v-avatar  size="30" style="background-color:#A9E2F3"> 
                <img v-if="bar.p_img" :src="`/api/img/get_img/member/${bar.p_img}`">
                <v-icon v-else size="20">mdi-dog</v-icon>
              </v-avatar>
              <v-avatar ref='drop_ready' size="5" > 
              </v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
              v-text="!bar.nickname ? bar.email : bar.nickname"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-item-group>
      </v-list>
    </div>
    <div class="media_content" ref="media_content">
      <v-tabs-items v-model="nv">
        <v-tab-item class="color_grey" >
          <div class="contents_base">
            <div id="content">
              <Medias 
                v-bind:medias="home_medias"
                v-bind:mb_cols="mb_cols"
                @child="changeScripts"
              />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item class="color_grey" >
          <Explore
            ref="explore"
            v-bind:mb_cols="mb_cols"
            @child="resetHome"/>
        </v-tab-item>
        <v-tab-item class="color_grey" >
          <ScriptMedias 
            ref="scripts"
            v-bind:my_scripts="my_scripts"
            v-bind:login_number="login_number"
            v-bind:mb_cols="mb_cols"
            @child="resetHome"
            @goback="goback"/>
        </v-tab-item>
        <v-tab-item class="color_grey" >
          <div class="contents_base">
            <div id="content">
              <Channel
              ref='my_channel'
              @child="resetHome"/>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item class="color_grey">
          <GoodMedias
            ref='good_medias'
            v-bind:mb_cols="mb_cols"
           @goback="goback"/>
        </v-tab-item>
        <v-tab-item class="color_grey">
          <SearchResult
            v-bind:medias="searched_result.medias"
            v-bind:channels="searched_result.channels"
            v-bind:mb_cols="mb_cols"
            v-bind:rs_none="rs_none"
            @child="resetHome"
          />
        </v-tab-item>
        <v-tab-item class="color_grey">
          <div class="contents_base">
            <div id="content">
              <Channel
                ref='click_channel'
                @child="resetHome"
              />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item class="color_grey" v-for="(bar, i) in my_scripts" :key="i">
          <div class="contents_base">
            <div id="content">
              <Channel
              ref='script_channels'
              @child="resetHome"
              />
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <div ref="bottom_navigation" style="position:fixed; bottom:0; width:100%;">
      <v-bottom-sheet v-model="sheet">
        <v-list >
          <v-list-item  @click="sheetClose(i)"
            v-for="(bar, i) in bottom_tiles" :key="i">
            <v-list-item-avatar>
              <v-avatar size="32px" tile>
                <v-icon>{{bar.icon}}</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>{{bar.title}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-bottom-sheet>
    </div>
    <div class="media_md_control" ref="btn_area" v-if="!navigation">
      <v-card width="100%" height="60px">
        <v-layout wrap class="media_mb_btn">
          <v-col cols="6" class="pa-0">
            <div style="width:100%; text-align:center;">
              <v-btn color="white" elevation="0"  width="100%" height="60"
              @click="sheet = true">
                <div style="width:100%; text-align:center;">
                  <v-icon>mdi-menu</v-icon>
                  <div> 매뉴</div>
                </div>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="6" class="pa-0">
            <div style="width:100%; text-align:center;">
              <v-btn color="white" elevation="0"  width="100%" height="60">
                <div style="width:100%; text-align:center;"
                  @click="searchForm(true)"
                >
                  <v-icon>mdi-magnify</v-icon>
                  <div>검색</div>
                </div>
              </v-btn>
            </div>
          </v-col>
        </v-layout>
      </v-card>
    </div>
  </v-container>
</template>



<script>
import Medias from "../components/media/Medias";
import Explore from "../components/media/Explore";
import ScriptMedias from "../components/media/ScriptMedias";
import Channel from "../components/media/Channel";
import GoodMedias from "../components/media/GoodMedias";
import SearchResult from "../components/media/SearchResult";

import { mapMutations, mapGetters } from 'vuex';
const name = 'media'
export default {
  components: { Medias, Explore, ScriptMedias, Channel, GoodMedias, SearchResult},
  props:['login_number', 'mb_header_view'],
  data: () => ({
    first_items: [
      { text: '홈', icon: 'mdi-home'},
      { text: '탐색', icon: 'mdi-compass'},
    ],
    second_items: [
      { text: '구독', icon: 'mdi-playlist-check'},
      { text: '내 채널', icon: 'mdi-google-my-business', key : 4},
      { text: '좋아요 표시한 동영상', icon: 'mdi-heart', key : 5},
    ],
    scription_items: [
      { text: '여기는', icon: 'mdi-clock'},
      { text: '구독 목록', icon: 'mdi-account'},
    ],
    media_layout: null,
    keyword: null,
    menu_width:'0px',
    navigation:null,
    searched_result:{medias:null, channels:null},
    nv:null,
    home_medias:null,
    my_scripts:null,
    menu_scipts:null,
    mb_cols:null,
    sheet: false,
    bottom_tiles: [
      { icon: 'mdi-home', title: '홈' },
      { icon: 'mdi-compass', title: '탐색' },
      { icon: 'mdi-playlist-check', title: '구독' },
      { icon: 'mdi-google-my-business', title: '내 채널' },
      { icon: 'mdi-heart', title: '좋아요 표시한 영상' },
    ],
    b_nv:0,
    sm:false,
    xs:false,
    first_nv:false,
    tab_values:['', 'explore', 'scripts', 'm_channel', 'good_medias', 'search', 'channel'],
    rs_none:false,
    watch:false,
  }),
  computed:{
    ...mapGetters(name, {
      store_nv: 'GET_NV',
      store_keyword : 'GET_KEYWORD',
      store_open_email : 'GET_OPEN_EMAIL'
    }),
  },
  methods:{
    ...mapMutations(name, ['MU_NV', 'MU_KEYWORD', 'MU_OPEN_EMAIL']),
    search(){
      if(!!this.keyword && !!this.keyword.replace(/\s/g, '').length){
        this.$http.get('/api/media/search_keyword/' + this.keyword).then(res => {
          if(!res.data.code){
            alert('검색에 실패하였습니다.');
            if(!this.first_nv){
              this.nv = 0;
            }
          }else{
            this.nv = 5;
            this.MU_KEYWORD(this.keyword);
            if(!res.data.result.channels && !res.data.result.medias){
              this.rs_none = true;
            }else{
              this.rs_none = false;
            }
            this.searched_result = res.data.result;
            this.searchForm(true)
          }
        }).catch(err => {
          alert('검색 과정에서 문제가 발생했습니다.');
          console.log(err);
        })
      }
    },
    keywordPush(){
      if(this.nv === 5){
        const params = `/education/search/${this.keyword}`;
        this.$router.push(params).catch(err => {});
      }else{
        this.nv = 5;
      }
    },
    searchForm(bl){
      const {mb_search_fild, mb_search_btn} = this.$refs;
      if(!mb_search_fild || !mb_search_btn){
        setTimeout(()=>{
          this.searchForm(bl)
        },200)
      }else{
        if(this.xs){
          if(bl){
            mb_search_btn.style.display = 'none';
            mb_search_fild.style.display = 'block';
          }else{
            mb_search_fild.style.display = 'none';
            mb_search_btn.style.display = 'block';
          }
        }
      }
    },
    sheetClose(num){
      this.nv = num;
      this.sheet = false;
    }, 
    resetHome(data){
      this[data.key](data);
    },
    getChildScChannel(data){
      this.nv = data.idx + 5
    },
    resetScripts(data){
      this.changeScripts(data, data.script);
    },
    changeScripts(data, script){
      const {my_scripts, menu_scipts} = this;
      let idx = null;
      for(let i = 0; i < my_scripts.length; i++){
        if(my_scripts[i].email === data.email){
          idx = i;
          break;
        }
      }
      if(idx === null){
        my_scripts.push(data);
      }else{
        this.$refs.drop_ready[idx].$el.style.backgroundColor = script ? '' : 'red';
      }
    },
    openMenu(){
      if(this.sm){
        this.menu_width = "250px"
      }
    },
    closeMenu(){
      if(this.sm){ 
        this.menu_width = "60px"
      }
    },
    getScChannel(email){
      const channels = this.$refs['script_channels'];
      if(!channels || !this.my_scripts){
        setTimeout(()=>{
          this.getScChannel(email);
        },200)
      }else{
        const items = this.my_scripts;
        let i = 0;
        for(i = 0; i < items.length; i++){
          if(email === items[i].email){
            break
          }
        }
        this.nv = i + 7;
        channels[i].getChannelInfo(email);
      }
    },
    getSearchChannel(email){
      const channel = this.$refs['click_channel'];
      if(!channel){
        setTimeout(() => {
          this.getSearchChannel(email);
        },200);
      }else{
        channel.getChannelInfo(email);
      }
    },
    getExlore(){
      const ex = this.$refs['explore'];
      if(!ex){
        setTimeout(() => {
          this.getExlore();
        }, 200)
      }else{
        ex.getExploreMedias();
      }
    },
    getScripts(){
      const sc = this.$refs['scripts'];
      if(!sc || !this.my_scripts){
        setTimeout(() => {
          this.getScripts();
        }, 200)
      }else{
        sc.getMyScriptMedias();
      }
    },
    getMyEmail(){
      this.$http.get('/api/login_spv/my_email').then(res => {
        if(res.data.code === 2){
          alert('로그인 되지 않았거나, 세션이 만료되었습니다. 다시 로그인 해주세요.');
          this.nv = 0;
        }else{
          this.getMyChannel(res.data.email);
        }
      }).catch(err => {
        alert('내 채널 정보를 가져오는데 문제가 발생했습니다.');
        this.goback();
      })
    },
    getMyChannel(email){
      const my = this.$refs['my_channel'];
      if(!my){
        setTimeout(()=>{
          this.getMyChannel(email);
        },200)
      }else{
        my.getChannelInfo(email);
      }
    },
    getGoodMedias(){
      if(this.$refs['good_medias']){
        this.$refs['good_medias'].getMyGoodMedias();
      }
    },
    onResize(){
      const width = window.innerWidth,
      {media_content, mb_search_btn, mb_search_fild} = this.$refs;
      let menu_width, navigation, min_height;
      mb_search_fild.style.display = 'none';
      if(width > 1263){
        menu_width = 250;
        navigation = true;
        min_height = window.innerHeight - 61 + 'px';
        mb_search_btn.style.display = 'none';
        this.sm = false;
        this.xs = false;
      }else if(width > 959){
        menu_width = 60;
        navigation = true;
        min_height = window.innerHeight - 61 + 'px';
        mb_search_btn.style.display = 'none';
        this.sm = true;
        this.xs = false;
      }else{
        menu_width = 0;
        navigation = false;
        min_height = window.innerHeight - 61 + 'px';
        this.sm = false;
        this.xs = true;
        mb_search_btn.style.display = 'block';
      }
      this.mb_cols = width > 599 ? "pa-2" : "pa-0";
      media_content.style.width = width - menu_width + 'px';
      media_content.style.marginLeft = menu_width + 'px';
      media_content.style.minHeight = min_height;
      this.navigation = navigation;
      this.menu_width = menu_width + 'px';
    },
    naviChange(bl){
      const {left_navigation, bottom_navigation} = this.$refs;
      if(bl){
        left_navigation.style.display = 'block';
        bottom_navigation.style.display = 'none';
      }else{
        left_navigation.style.display = 'none';
        bottom_navigation.style.display = 'block';
      }
    },
    mbSearchControl(){
      const {mb_search_btn} = this.$refs;
      let y = window.screenY;
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
        mb_search_btn.style.opacity = bl ? 1 : 0;
      });
    },
    getMyScriptList(callback){
      this.$http.get('/api/media/my_script').then( res => {
        !!res.data.code || alert('구독자 정보를 가져오지 못했습니다.');
        this.my_scripts = !res.data.result ? [] : res.data.result;
        if(!!callback){
          callback();
        }
      })
    },
    getHomeMedias(){
      if(!this.my_scripts){
        setTimeout(() => {
          this.getHomeMedias();
        },200)
      }else{
        this.$http.post('/api/media/home_medias', {list:this.my_scripts}).then(res => {
          if(!res.data.code){
            alert('미디어 정보를 가져오지 못했습니다.');
            this.$router.push('/');
          }else{
            this.home_medias = res.data.result;
          }
        }).catch(err=>{
          alert('미디어 정보를 가져오는 중에 문제가 발생했습니다.');
          console.log(err);
          this.$router.push('/');
        })
      }
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
    goback(data){
      if(!!data){
        this.nv = 0;
      }
    },
    showContent(params){
      let {tab, keyword} = params;
      if(!tab){
        if(!this.login_number && this.store_nv !== 5 && this.store_nv !== 6){
          tab = this.tab_values[this.store_nv < 2 ? this.store_nv : 0]
        }else{
          if(this.store_nv === 5){
            this.keyword = this.store_keyword;
            this.nv = 5;
            this.searchForm(true);
            this.search();
            return
          }
          keyword = this.store_nv === 6 ? this.store_open_email : undefined;
          tab = this.tab_values[this.store_nv];
        }
      }
      switch(tab){
        case 'explore' :
          this.nv = 1;
          this.getExlore();
          break;
        case 'scripts' :
          this.nv = 2;
          this.getScripts();
          break;
        case 'm_channel' :
          this.nv = 3;
          this.getMyEmail();
          break;
        case 'good_medias' : 
          this.nv = 4;
          this.getGoodMedias();
          break;
        case 'search' :
          this.keyword = keyword;
          this.nv = 5;
          this.searchForm(true);
          this.search();
          break;
        case 'channel' : 
          if(!keyword){
            this.nv = 0;
            this.getHomeMedias();
          }else{
            this.nv = 6;
            this.getSearchChannel(keyword);
          }
          break;
        case 'sc_channel' : 
           if(!keyword){
            this.nv = 0;
            this.getHomeMedias();
          }else{
            this.nv = 6;
            this.getSearchChannel(keyword);
          }
          break;  
        default :
          this.nv = 0;
          this.getHomeMedias();
          break;
      }
    },
    contentChange(params){
      const {tab, keyword} = params;
      switch(tab){
        case 'explore' :
          this.nv = 1;
          this.getExlore();
          break;
        case 'scripts' :
          this.nv = 2;
          this.getScripts();
          break;
        case 'm_channel' :
          this.nv = 3;
          this.getMyEmail();
          break;
        case 'good_medias' : 
          this.nv = 4;
          this.getGoodMedias();
          break;
        case 'search' :
          this.nv = 5;
          this.keyword = keyword;
          this.searchForm(true);
          this.search();
          break;
        case 'channel' : 
          this.nv = 6;
          if(!keyword){
            this.getHomeMedias();
          }else{
            this.getSearchChannel(keyword);
          }
          break;
        case 'sc_channel' : 
           if(!keyword){
            this.getHomeMedias();
          }else{
            this.getScChannel(keyword);
          }
          break;  
        default :
          this.nv = 0;
          this.getHomeMedias();
          break;
      }
    },
    paramsChange(hook){
      let params;
      if(hook === 0){
        params = '/education/home';
      }else if(hook === 1){
        params = '/education/explore';
      }else if(hook === 2){
        params = '/education/scripts';
      }else if(hook === 3){
        params = '/education/m_channel';
      }else if(hook === 4){
        params = '/education/good_medias';
      }else if(hook === 5){
        params = `/education/search/${this.keyword}`;
      }else if(hook === 6){
        params = `/education/channel/${this.store_open_email}`;
      }else if(!!hook){
        params = `/education/sc_channel/${this.my_scripts[hook-7].email}`;
      }
      this.$router.push(params).catch(err => {});
    }
  },
  mounted(){
    this.onResize();
    this.mbSearchControl();
  },
  created(){
    this.getMyScriptList(this.showContent(this.$route.params));
  },
  watch:{
    navigation: function(hook){
      this.naviChange(hook);
    },
    nv : function(hook){
      this.MU_NV(hook);
      if(this.first_nv){
        this.paramsChange(hook);
      }else{
        this.first_nv = true;
      }
    },
    login_number:function(hook){
      if(!!hook){
        this.getMyScriptList();
      }else{
        this.my_scripts = [];
      }
    },
    mb_header_view : function(hook){
      const btn_area = this.$refs.btn_area;
      if(!!btn_area){
        this.$refs.btn_area.style.opacity = !hook ? 0 : 1;
      }
    },
    store_nv : function(hook){
      this.nv = hook;
    },
    $route : function(hook){
      this.contentChange(hook.params);
    }
  },
 
}
</script>

<style>
  @import '../css/media/education.css';
  .media_md_control{
    position:fixed;
    left:50%;
    top:90%;
    transform: translate(-50%, -50%);
    width:80%;
    max-width:200px;
    height:60px;
    opacity: 1;
    -webkit-transition: opacity 0.5s;
    transition: opacity 0.5s;
  }
  .media_mb_btn{
    width:100%;
    height:100%;
  }
</style>