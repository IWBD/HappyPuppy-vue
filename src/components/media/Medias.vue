<template>
  <v-layout v-if="medias" wrap>
    <v-col  cols="12" sm="6" md="4" lg="4" xl="3" :class="mb_cols"
        v-for="(bar, i) in medias" :key="i">
        <v-responsive :aspect-ratio="16/9" style="background-color:white">
          <v-img :aspect-ratio="16/9" class="view_area" @click="openPlayMedia(bar, i)"
           :src="`/api/img/get_thumbnail/media/${bar.img}`"></v-img>
        </v-responsive>
        <div class="media_info d-flex justify-start">
          <div style="width:40px; height:100%; margin-right:5px;">
            <v-list-item-avatar @click="showChannel(bar.email)" class="ma-0 cucur_pointer" style="margin:0 auto;" >
              <v-img :src="!bar.p_img ? '' : `/api/img/get_img/member/${bar.p_img}`" style="background-color:#A9E2F3">
                <v-icon v-if="!bar.p_img" size="30">mdi-dog</v-icon>
              </v-img>
            </v-list-item-avatar>
          </div>
          <div>
            <p class="v_title mb-1 d-flex align-center" v-text="bar.title"></p>
            <p class="c_name ma-0 cucur_pointer" @click="showChannel(bar.email)"
                v-text="bar.nickname ? bar.nickname : bar.email"></p>
            <p class="v_info ma-0"
                v-text="'조회수 ' + bar.count + '회 ' + getDate(bar.date)"></p>
          </div>
        </div>
    </v-col>
    <PlayMedia ref="open_media" 
      v-bind:medias="medias"
      @child="getScript"
      @mediaThink="resetThink"
      @parents="resetCount"/>
  </v-layout>
</template>



<script>
import PlayMedia from "./PlayMedia";

import {mapMutations} from 'vuex';
const name = 'media'
export default {
  props:['medias', 'mb_cols'],
  components:{PlayMedia},
  data: () => ({
    open_media:null,
  }),
  methods:{
    ...mapMutations(name, ['MU_OPEN_EMAIL', 'MU_NV']),
    showChannel(email){
      this.MU_OPEN_EMAIL(email);
      this.MU_NV(6);
      // this.$router.push('/education/channel/' + email);
    },
    openPlayMedia(media, idx){
      this.open_media = {
        email : media.email,
        nickname : media.nickname,
        p_img : media.p_img
      }
      this.$refs.open_media.open(media, idx);
    },
    resetThink(data){
      this.medias[data.index] = data.media;
      this.$emit('think', data);
    },
    getScript(data){
      this.$emit('child', this.open_media, data);
    },
    resetCount(data){
      this.medias[data.index].count ++;
    },
    getDate(item){
      const now_date = new Date(),
      date = new Date(item),
      rs = now_date - date,
      day = Math.floor(rs/86400000),
      month = Math.floor(rs/2592000000),
      year = Math.floor(rs/31104000000);
      
      if(year > 0){
        return year + '년 전';
      }
      if(month > 0){
        return month + '개월 전';
      }
      if(date > 0){
        return day + '일 전';
      }

      let time = (now_date.getTime() - date.getTime()) / 60000; 
      if(time/60 >= 1){
        return Math.floor(time/60) + '시간 전';
      }
      if(time >= 1){
        return Math.floor(time) + '분 전';
      }
      return '방금 전';
    },
  },
}
 // const now_date = new Date();
      // const date = new Date(item);
      // const rs_item = {
      //   year : now_date.getFullYear() - date.getFullYear(),
      //   month : now_date.getMonth() - date.getMonth(),
      //   date : now_date.getDate() - date.getDate(),
      // }
      // if(rs_item.year > 0){
      //   return rs_item.year + '년 전';
      // }
      // if(rs_item.month > 0){
      //   return rs_item.month + '개월 전';
      // }
      // if(rs_item.date > 0){
      //   return rs_item.date + '일 전';
      // }
      // var time = (now_date.getTime() - date.getTime()) / 60000; //분
      // if(time/60 >= 1){
      //   return Math.floor(time/60) + '시간 전';
      // }
      // if(time >= 1){
      //   return Math.floor(time) + '분 전';
      // }
      // return '방금 전';
</script>
