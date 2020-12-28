<template>
  <v-container fluid class="pa-0" style="background-color:#f8f3f2" v-resize="onResize">
      <v-tabs-items  v-model="tab">
        <v-tab-item style="background-color:#f8f3f2">
          <EVCarouesl
            ref="carouesl"
            @child="getPoster"
          />
        </v-tab-item>
        <v-tab-item eager style="background-color:#f8f3f2">
          <EvCalendar 
          ref="canlender"
          :event_list="event_list"
          :events_info="event_info"/>
        </v-tab-item>
      </v-tabs-items>
      <v-card id="btn_area" ref="btn_area">
        <v-layout wrap class="btn_list" >
          <v-col cols="4" class="pa-0 d-flex align-center"
          v-for="(bar, i) in btn_item" :key="i">
            <div style="width:100%; text-align:center;">
              <v-btn color="white" elevation="0"  width="100%" height="60"
                @click="tab = i">
                <div style="width:100%; text-align:center;">
                  <v-icon v-text="bar.icon"></v-icon>
                  <div v-text="bar.title"></div>
                </div>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="4" class="pa-0 btn_area_list d-flex align-center">
            <div style="width:100%; text-align:center;">
              <v-btn color="white" elevation="0"  width="100%" height="60"
              @click="pageMove">
                <div style="width:100%; text-align:center;">
                  <v-icon>mdi-folder-upload-outline</v-icon>
                  <div>업로드</div>
                </div>
              </v-btn>
            </div>
          </v-col>
        </v-layout>
      </v-card>
  </v-container>
</template>

<script>
import EvCalendar from '../components/event/EventCalendar';
import EVCarouesl from '../components/event/EventCarouesl';
import { mapMutations, mapGetters } from 'vuex';
const name = 'member'
export default {
  props:['mb_header_view'],
  components: {
      EvCalendar,
      EVCarouesl,
  },
  data : () => ({
    event_list : null,
    events_info : null,
    tab : 0,
    btn_item : [
      {icon:'mdi-image-outline', title:'이미지'},
      {icon:'mdi-calendar-outline', title:'달력'},
    ],
    events_height:null
  }),
  computed:{
    ...mapGetters(name, {
      login_info: 'GET_LOGIN_INFO'
    }),
  },
  methods:{
    pageMove(){
      if(this.login_info.number){
        this.$router.push('/memberEvent');
      }else{
        alert('로그인이 필요한 서비스입니다.')
      }
    },
    getPoster(data){
      this.$refs.canlender.childEvent(data);
    },
    onResize(){
      this.events_height = window.innerHeight - 61 + 'px';
    },
  },
  watch:{
    mb_header_view : function(hook){
      this.$refs.btn_area.$el.style.opacity = !hook ? 0 : 1;
    },
    tab : function(hook){
      if(!hook){
        setTimeout(() => {
          this.$refs.carouesl.$redrawVueMasonry();
        }, 500)
      }
    }
  }
}


</script>

<style scoped>

#btn_area{
  position:fixed;
  left:50%;
  top:90%;
  transform: translate(-50%, -50%);
  width:80%;
  max-width:300px;
  height:60px;
  opacity: 1;
  -webkit-transition: opacity 0.5s;
  transition: opacity 0.5s;
}
.btn_list{ 
  width:100%;
  height:100%;
}
.btn_area_list{
  width:50%;
  height:100%;
}
</style>
