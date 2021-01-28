<template>
  <div id="event_img_box" ref="img_box" v-resize="onResize">
    <div v-masonry="containerId" transition-duration="0.5s" item-selector=".item">
      <div v-masonry-tile class="item"  v-for="(item, index) in events" :key="index">
        <v-hover v-slot="{ hover }">
          <v-card tile elevation="0" :width="ecw" :class="img_class" style="background-color:#f8f3f2"  >
            <div v-if="hover"
              class="event_hover" style="border-radius:15px;">
              <div class="d-flex align-center" style="height:100%;">
                <div style="text-align:center; width:100%;">
                  <div v-text="item.ev_name" style="font-size:23px;"></div>
                  <div v-text="getFormatDate(item.ev_start_date, item.ev_end_date)"></div>
                  <v-btn dark outlined @click="parentColl(item)">Click</v-btn>
                </div>
              </div>
            </div>
            <img :style="event_st"  :src="`/api/img/get_img/event/${item.ev_img}`"/>
          </v-card>
        </v-hover>
      </div>
    </div>
    <div v-if="!events" style="padding-top:20%; text-align:center; font-size:20px;">
      향후 등록된 행사가 없습니다.
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {VueMasonryPlugin} from 'vue-masonry';
Vue.use(VueMasonryPlugin);

export default {
  data : () => ({
    colors: [
      'lime lighten-2',
      'warning lighten-2',
      'pink lighten-2',
      'blue lighten-2',
      'deep-purple lighten-2',
      'purple lighten-2',
      'indigo lighten-2',
      'warning lighten-2',
      'pink lighten-2',
      'red lighten-2',
      'deep-purple lighten-2',
      'purple lighten-2',
    ],
    events:[], 
    count:null,
    set_events:[],
    con_height:null,
    test_src:['../../images/test.jpg', '../../images/pp.jpg', '../../images/logo.png', '../../images/404.jpg', '../../images/event_dog.jpg', '../../images/lost_icon.jpg', '../../images/testPoster.jpg'],
    img_class : '',
    event_st : 'width:100%; border-radius:15px; display:block;',
    scroll_y:0,
    ecw:0,
  }),
  created(){
    this.getTodayEvent();
  },
  methods:{
    //window 크기변화 감지
    onResize(){
      this.scroll_y = 0;
      const img_box = this.$refs.img_box;
      const height = document.body.offsetWidth;
      if(height > 1499){
        this.img_class = 'IBCW';
        this.ecw = '280px';
        img_box.style.width = '1500px';
      }else if(height > 1199){
        this.img_class = 'IBCW';
        this.ecw = '280px';
        img_box.style.width = '1200px';
      }else if(height > 899 ){
        this.img_class = 'IBCW';
        this.ecw = '280px';
        img_box.style.width = '900px';
      }else if(height > 599){
        this.img_class = 'IBCW';
        this.ecw = '280px';
        img_box.style.width = '600px';
      }else {
        this.img_class = 'IBCM';
        this.ecw = `${height}px`;
        img_box.style.width = `${height}px`;
      }
    },
    //행사 정보 요청
    getTodayEvent(){
      const today = new Date(), 
      start = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
      this.$http.get(`api/event/get_asc/${start}`).then(res => {
        if(res.data.code){
          this.events = !res.data.items.length ? null : res.data.items;
        }else{
          this.events = null;
        }
      }).catch(err => {
        console.error(err);
        alert('행사 정보를 가져오는 과정에서 문제가 발생했습니다.')
      })
    },
    //포스터 view 호출
    parentColl(item){
      this.$emit('child', item);
    },
    //날짜 문자열 포멧
    getFormatDate(start, end){
      return `${this.formatDate(new Date(start))} - ${this.formatDate(new Date(end))}`
    },
    //날짜 문자열 추출
    formatDate (a, bl) {
      return bl ? `${a.getFullYear()}-${a.getMonth() + 1}` : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
    },
  },
}

</script>

<style scoped>
@import '../../css/event/carouesl.css';
#event_img_box{
  margin: 0 auto;
}
.event_hover{
  position:absolute; 
  height:100%; 
  width:100%;
  color:white;
  background-color: black;
  top:0px;
  opacity: 0.5;
}
.event_img{
  width:100%; 
  border-radius : 15px; 
  display: block;
}
.IBCW{
  background-color: red;
  margin:15px 10px;
}
.IBCM{
  margin:10px 0px;
  background-color: red;
}
</style>