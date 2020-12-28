<template>
      <div class="contents_base">
          <div id="content" style="background-color:#F8F3F2">           
              <v-layout wrap>
                  <v-col cols="12" class="pt-2" :class="mb_cols">
                    <v-btn-toggle
                      v-model="btn_toggle"
                      tile
                      color="deep-purple accent-3"
                      style="width:100%"
                    >
                      <v-btn tile width="25%" @click="setMedias('pop', medias_bucket.pop)">인기
                      </v-btn>
                      <v-btn tile width="25%" @click="setMedias('recently', medias_bucket.recently)">최근
                      </v-btn>
                      <v-btn tile width="25%" @click="setMedias('daily', medias_bucket.daily)">일상
                      </v-btn >
                      <v-btn tile width="25%" @click="setMedias('education', medias_bucket.education)">교육
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                  <v-col cols="12" class="pt-0" :class="mb_cols">
                      <div class="tag_area">
                        <v-btn v-for="(bar, i) in tags" :key="i"
                          text color="primary" @click="showTagMedia(bar.idxs)">
                          {{bar.name}}
                        </v-btn>
                      </div>
                  </v-col>
              </v-layout>
              <Medias
              v-bind:mb_cols="mb_cols"
              v-bind:medias="medias"
              @child="changeScripts"
              @think="resetThink"
              />
          </div>
      </div>
</template>



<script>
import Medias from "./Medias";
import { mapMutations, mapGetters } from 'vuex';
const name = 'media'
export default {
  props:['mb_cols'],
  components:{Medias},
  data: () => ({
    medias:null,
    medias_bucket:{
      pop:null,
      recently:null,
      daily:null,
      education:null,
    },
    bucket_key:null,
    tags:null,
    btn_toggle:null,
  }),
  computed:{
    ...mapGetters(name, {
      store_ex: 'GET_EX'
    }),
  },
  methods:{
    ...mapMutations(name, ['MU_EX_KEY']),
    storeBUCKEY_KEYchange(item){
      this.MU_EX_KEY(item);
    },
    ...mapMutations(name, ['MU_EX_BTN']),
    storeBTNchange(item){
      this.MU_EX_BTN(item);
    },
    resetThink(data){
      const medias_bucket = this.medias_bucket;
      Object.keys(medias_bucket).forEach(f => {
        let item = medias_bucket[f];
        for(let i = 0; i < item.length; i++){
          if(data.media.num === item[i].num){
            medias_bucket[f].splice(i, 1, data.media);
          }
        }
      })
    },
    changeScripts(data, script){
      data.key = 'resetScripts';
      data.script = script;
      this.$emit('child', data);
    },
    setMedias(key, items){
      this.medias = items;
      this.bucket_key = key;
      this.storeBUCKEY_KEYchange(key);
      let tags = [];
      for(let i = 0; i < items.length; i ++){
        if(!items[i].tag){
          continue;
        }
        let sp_tags = items[i].tag.split('#');
        for(let j = 0; j < sp_tags.length; j ++){
          if(!!sp_tags[j]){
            let bl = false, tag = '#' + sp_tags[j];
            for(let x = 0; x < tags.length; x ++){
              if(tags[x].name === '#' + sp_tags[j]){
                bl = true;
                tags[x].idxs.push(i);
                break;
              }
            }
            if(!bl){
              tags.push({name : '#' + sp_tags[j], idxs : [i]});
            }
          }
        }
      }
      this.tags = tags;
    },
    showTagMedia(idxs){
      let new_medias = [];
      for(let i = 0; i < idxs.length; i++){
        new_medias.push(this.medias_bucket[this.bucket_key][idxs[i]]);
      }
      this.medias = new_medias;
    },
    getExploreMedias(){
      this.$http.get('/api/media/pop_medias').then(res => {
        if(!res.data.code){
          alert('탐색 정보를 불러오지 못했습니다.');
        }else{
          this.medias_bucket.pop = res.data.result.pop;
          this.medias_bucket.recently = res.data.result.recently;
          this.medias_bucket.daily = res.data.result.daily;
          this.medias_bucket.education = res.data.result.education;
          const {btn, key} = this.store_ex;
          this.btn_toggle = btn;
          this.setMedias(key, res.data.result[key]);
        }
      }).catch(err => {
        alert('탐색 정보를 불러오지 못했습니다.');
        console.log(err);
      })
    },
  },
  watch:{
    btn_toggle: function(hook){
      this.storeBTNchange(hook);
    }
  },
  
}
</script>

<style scoped>
.tag_area{
  width:100%;
  max-height:200px;
  overflow-y: auto;
}
</style>
