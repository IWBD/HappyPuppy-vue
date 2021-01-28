<template>
  <div v-resize="onResize">
    <v-layout class="d-flex justify-center">
      <v-col :cols="cols" class="d-flex">
        <v-spacer></v-spacer>
        <v-select
          v-model="place"
          :items="states"
          label="지역 선택"
          hide-details
          single-line
          class="pa-0 mt-0"
        ></v-select>
        <v-btn icon @click="searchPlace">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="pageMove" outlined color="gray" tile>등록하기
        </v-btn>
        <v-spacer></v-spacer>
      </v-col>
    </v-layout>
    <v-divider></v-divider>
    <div v-if="!ad_brief_list" style="padding-top:20%; width:100%; text-align:center;">
      검색 결과가 없습니다.
    </div>
    <v-layout wrap class="pa-3" v-if="ad_brief_list">
        <v-col :cols="cols" v-for="(bar, index) in ad_brief_list" :key="index">
          <a @click="getPoster(bar.poster_img)">
            <img style="width:100%; display:block;" :src="`api/img/get_img/abandoned/${bar.poster_img}`">
          </a>
        </v-col>
    </v-layout>
    <v-dialog  v-model="poster_dialog" tile fullscreen >
        <v-card tile elevation="0"  align="center" class="pdf_background" style="background-color:gray;">
          <div class="my-4" style="width:auto;">
            <v-card class="my-4" elevation="0" tile width="420px" height="650px" style="overflow:auto; background-color:gray;">
              <Poster
                ref="poster"
                :poster="poster_img"
                :poster_name="poster_name"
                @child="poster_dialog = false"/>
            </v-card>
          </div>
          <v-card-actions color="white" class="d-flex justify-center">
              <v-btn color="#F44336" dark tile elevation="0"
                @click="pdfDownload" class="ma-1" width="81"
              >
                PDF
              </v-btn>
              <v-btn class="ma-1" width="81" color="primary"
                tile elevation="0" @click="poster_dialog = false"
              >
                close
              </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Poster from "./Poster"
import { mapGetters } from 'vuex'
const member = 'member';
export default {
  data: () => ({
    tab:null,
    show: false,
    states: ['전국', '서울', '인천', '대전', '광주', '대구', '울산', '부산', '경기', '강원', '세종', '충남', '충북', '전남', '전북', '경남', '경북', '제주'],
    cols:null,
    ad_brief_list:null,
    place:null,
    poster_dialog:null,
    form:null,
    honorarium:null,
    main_img_url:null,
    sb_img_urls:null,
    disb:false,
    poster_img:null,
    poster_name:null,
  }),
  computed:{
    ...mapGetters(member, {
      login_info: 'GET_LOGIN_INFO'
    }),
  },
  components:{
    Poster,
  },
  methods :{
    pageMove(){
      if(!this.login_info.number){
        alert('로그인 이후에 가능한 서비스입니다.');
      }else{
        this.$router.push('/memberAbandoned');
      }
    },
    //window 사이즈 변경시 poster들의 레이아웃 변경
    onResize(){
      const width = window.innerWidth;
      this.cols = width < 720 ? 12 : width < 1050 ? 6 : width < 1410 ? 4 : 3;
    },
    //기본 검색, 마운트동시에 실행
    getAllPoster(){
      this.$http.get('/api/abandoned/').then((res) => {
        this.changeContent(res.data);
      }).catch(err => {
        alert('실종 반려견 정보를 가져오는 중 문제가 발생했습니다.');
      })
    },
    //base64 전단지 이미지 요청, 전단지 open
    getPoster(poster){
      this.$http.get(`/api/img/rpb/${poster}`).then(res => {
        if(!!res.data.message){
          this.poster_img = res.data.result;
          this.poster_name = poster;
          this.poster_dialog = true;
        }else{
          alert('PDF 준비중에 문제가 발생했습니다.');        
        }
        return
      }).catch(err => {
        console.log(err);
        alert('PDF 준비중에 문제가 발생했습니다.');
      })
    },
    //지역 검색
    searchPlace(){
      const place = this.place;
      if(!place || place === '전국' ){
        this.getAllPoster();
        return;
      }
      this.$http.get('/api/abandoned/place_search/' + place).then((res) => {
        this.changeContent(res.data);
      }).catch(err => {
        alert('실종 반려견 정보를 가져오는 중 문제가 발생했습니다.');
      })
    },
    //검색 완료후 poster 데이터 변경
    changeContent(data){
      this.ad_brief_list = data.message ? data.result : null;
    },
    //자식 poster의 pdf생성 메소드 호출
    pdfDownload(){
      this.$refs.poster.createPDF();
    }
  },
  mounted(){
    this.onResize();
    this.getAllPoster();
  }, 
  
}
</script>

<style scoped>
.pdf_background{
  overflow-x:auto; 
  background-color:gray;
}
</style>