<template>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile v-resize="onResize">
        <v-toolbar  dark  color="primary">
          <v-toolbar-title v-text="!upadte ? '영상 수정' : '영상 업로드'"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="formClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-col cols="12" v-if="update" class="view_message pb-0">
          썸네일, 영상은 업로드하지 않으시면 기존 영상을 유지합니다.
        </v-col>
        <div class="input_content">
            <v-layout wrap>
                <v-col cols="12" md="6" class="pb-0">
                  <h4 v-text="video_message" 
                  class="error_message"  ref="video_message"></h4>
                  <v-card tile outlined elevation="0" ref="video" class="view_box" :height="view_height"
                    @mouseover="video_btn = true" @mouseout="video_btn = false">
                    <div class="hundred_percent">
                      <video  class="hundred_percent"
                      :src="to_video" controls>
                      </video>
                    </div>
                    <v-btn fab color="primary" @click="openForm(true)"
                     class="position_center" style="position:absolute;" ref="video_btn">
                      <v-icon>mdi-video</v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <h4 v-text="img_message" 
                  class="error_message"  ref="img_message"></h4>
                  <v-card tile outlined elevation="0" :height="view_height" class="view_box"
                  @mouseover="img_btn = true" @mouseout="img_btn = false"> 
                    <v-img ref="thumbnail" class="hundred_percent" :src="to_img">
                    </v-img>
                    <v-btn fab color="primary" @click="openForm(false)"
                     class="position_center" style="position:absolute;" ref="image_btn">
                      <v-icon>mdi-image</v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field
                    ref="title"
                    v-model="title"
                    :rules="title_rules" :eroor-messages="errorMessages"
                    label="제목" clearable filled counter="50"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field
                    ref="content"
                    v-model="content"
                    :rules="title_rules" :eroor-messages="errorMessages"
                    label="간략한 설명" clearable filled counter="50"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field
                    ref="tag"
                    v-model="tag"
                    counter="100"
                    :rules="tag_rules"
                    :eroor-messages="errorMessages"
                    label="테그 ex>#산책#교육 필수(x)" clearable filled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-select
                    ref="category"
                    v-model="category"
                    :items="categorys"
                    :rules="category_rules"
                    label="카테고리"
                    filled
                    ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    ref="comment"
                    v-model="comment"
                    name="input-7-1"
                    filled
                    label="영상 설명.(필수 x)"
                    counter="100"
                    :rules="comment_rules"
                  ></v-textarea>
                </v-col>
                <div style="width:100%;" class="d-flex justify-center">
                  <v-btn tile color="red" @click="uploadToMedia"
                  dark style="margin:0 auto;">
                    {{!update ? '업로드' : '수정하기'}}
                  </v-btn>
                </div>
            </v-layout>
        </div>
        <div style="display:none;">
          <v-file-input 
              ref="input_img"
              accept="image/*"
              @change="inputToImage"
            ></v-file-input>
              <v-file-input 
                ref="input_video"
                accept="video/*"
                @change="inputToVideo"
            ></v-file-input>
        </div>
      </v-card>
      <v-dialog
          v-model="load_dialog"
          hide-overlay
          persistent
          width="300"
        >
        <v-card color="primary" dark>
          <v-card-text>
            업로드 중입니다. 잠시만 기다려 주세요....
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-dialog>
</template>



<script>

export default {
  props:['update', 'media_num'],
  data: () => ({
    dialog: false,
    ad_honorarium:null,
    title:null,
    content:null,
    category:null,
    categorys:['일상', '교육', '팁'],
    image:null,
    video:null,
    comment:null,
    tag:null,
    title_rules:[
        v => v === null || v.length <= 0 ? '입력되지 않았습니다' 
        : v.length > 50 ? '50자 이내로 입력해주세요.'
        : v.replace(/\s/g, '').length !== 0 || "공백만 입력하셨습니다."
    ],
    tag_rules:[
        v => v === null || v.length === 0 ? null :
        !v.match(/#/g) ? '맨 앞에 #입력은 필수 입니다.': 
        v.match(/##/g) ? '#을 연속으로 입력할 수 없습니다.':
        v.match(/#/g).length < 11 || '10개 까지만 입력할 수 있습니다.',
    ],
    category_rules:[
        v => v !== null || '카테고리를 선택해주세요.' 
    ],
    comment_rules:[
        v => v === null || v.length === 0 ? null 
        : v.length > 100 ? '100자 이내로 입력해주세요.'
        : v.replace(/\s/g, '').length !== 0 || "공백만 입력하셨습니다."
    ],
    errorMessages:null,
    view_height:'200px',
    to_img:'',
    to_video:null,
    img_file:null,
    video_file:null,
    img_btn:true,
    video_btn:true,
    video_message:"영상",
    img_message:"썸네일",
    load_dialog:false,
  }),
  methods:{
    dateReset(){
      const {form} = this.form();
      Object.keys(form).forEach(f => {
          this.$refs[f].isResetting = true;
      })
    },
    formClose(){
      this.dateReset();
      this.ad_honorarium = null;
      this.title = null;
      this.content = null
      this.category = null;
      this.image = null;
      this.video = null;
      this.comment = null;
      this.tag = null;
      this.errorMessages = null;
      this.to_img = '';
      this.to_video = null;
      this.img_file = null;
      this.video_file = null;
      this.img_btn = true;
      this.video_btn = true;
      this.dialog = false;
      this.showBtn('video_btn');
      this.showBtn('image_btn');
    },
    onResize(){
      const video = this.$refs.video;
      if(!video){
        return false;
      }
      this.view_height = video.$el.offsetWidth / 16 * 9 + 'px';
      return true;
    },
    viewheight(){
      const {onResize, viewheight} = this;
      setTimeout(function(){
        const bl = onResize();
        if(!bl){
          return viewheight();
        }
      },500)
    },
    openForm(bl){
      let k = bl ? 'input_video' : 'input_img'
      this.$refs[k].$el.getElementsByTagName('input')[0].click();
    },
    viewmessage(k, bl){
      let message , color;
      message = k === 'img_message' ? '썸네일' : '영상'
      if(bl){
        color = "black";
      }else{
        color = "red";
        message = message + ' 이 업로드되지 않았습니다.'
      }
      this[k] = message;
      this.$refs[k].style.color = color;
    },
    inputToVideo(event){
      if(event){
        const type = event.type.indexOf('video/');
        if(type === -1){
          alert('영상 파일만 업로드할 수 있습니다.');
          return;
        }
        if(event.size > 1073741824){
          alert('영상 최대 크기는 1GB입니다.');
          return;
        }
        this.to_video = URL.createObjectURL(event);
        this.video_file = event;
        this.video_btn = false;
      }
    },
    inputToImage(event){
      if(event){
        const type = event.type.indexOf('image/');
        if(type === -1){
          alert('이미지 파일만 업로드할 수 있습니다.');
          return;
        }
        if(event.size > 10485760){
          alert('이미지 최대 크기는 10MB입니다.');
          return
        }
        this.to_img = URL.createObjectURL(event);
        this.img_file = event;
        this.img_btn = false;
      }
    },
    form(){
      const form = {
        title : this.title,
        content : this.content,
        category : this.category,
        tag : this.tag,
        comment : this.comment
      }
      const view = {
        img : this.img_file,
        video : this.video_file
      }
      return {form : form, view : view};    
    },
    formHasError(bl){
      let has_error = false;
      const {form, view} = this.form();
      const {$refs, viewmessage} = this;
      Object.keys(form).forEach(f => {
        if($refs[f].hasError){
          has_error = true;
          $refs[f].validate(true);
        }
      })
      if(bl){
        Object.keys(view).forEach(f => {
          const key = f === 'img' ? 'img_message' : 'video_message';
          let bl = true;
          if(!view[f]){
            console.log(f)
  
            has_error = true;
            bl = false;
          }
          viewmessage(key, bl);
        })
      }
      return has_error;
    },
    uploadToMedia(){
      this.load_dialog = true;
      let url;
      var form_data;
      if(this.update){ //업데이트
        if(this.formHasError(false)){
          this.load_dialog = false;
          return;
        }
        url = '/api/media/update_media'
        form_data = new FormData();
        form_data.append('num', this.media_num);
      }else{//업로드
        if(this.formHasError(true)){
          this.load_dialog = false;
          return;
        }
        url = '/api/media/upload_media';
        form_data = new FormData();
      }
      const {form, img_file, video_file} = this;
      form_data.append('form', JSON.stringify(form().form));
      form_data.append('img', img_file);
      form_data.append('video', video_file);

      this.$http.post(url, form_data).then(res => {
        if(res.data.code === 1){
          alert('업로드가 완료되었습니다.');
          this.formClose();
          this.$emit('child');
        }else if(res.data.code === 2){
          alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
          this.$router.push('/');
          return;
        }else{
          alert('업로드 과정에서 문제가 발생했습니다.');
          this.$router.go();
        }
      }).catch(err => {
        console.log(err);
        alert('업로드 과정에서 문제가 발생했습니다.');
        this.$router.go();
      }).finally(()=>{ 
        this.load_dialog = false;
      })
    },
    showBtn(k){
      this.$refs[k].$el.style.display = 'block';
    },
    hideBtn(k){
      this.$refs[k].$el.style.display = 'none';

    }
  },
  watch:{
    img_btn : function(hook){
      if(!this.img_file){
        return
      }
      hook ? this.showBtn('image_btn') : this.hideBtn('image_btn');
    },
    video_btn : function(hook){
      if(!this.video_file){
        return
      }
      hook ? this.showBtn('video_btn') : this.hideBtn('video_btn');
    },
  },
}
</script>

<style>
@import '../../css/media/inputmedia.css';
</style>
