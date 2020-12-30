<template>
  <v-stepper tile v-model="e1" class="mb-0" outlined> 
    <v-stepper-header >
      <v-stepper-step :complete="e1 > 1" step="1">정보 입력</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="2">사진 첨부</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">완료</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-2"  tile elevation="0">
          <v-layout wrap class="pt-2">
            <v-flex xs12 md6>
              <v-text-field
                ref="ad_title" v-model="ad_title"
                :rules="ad_title_rules" :eroor-messages="errorMessages"
                label="제목" filled clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
              <v-text-field
                :class="pl" ref="ad_name" v-model="ad_name"
                :rules="ad_name_rules" :eroor-messages="errorMessages"
                label="반려견 이름" filled clearable
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6 md6 >
              <v-text-field
                :class="pr" ref="ad_honorarium" v-model="ad_honorarium"
                :rules="ad_honorarium_rules" :eroor-messages="errorMessages"
                label="사례금" :disabled="!ad_swich" clearable filled
              ></v-text-field>
            </v-flex>
            <v-flex xs6 md6 class="d-flex pl-12">
              <v-switch class="pa-1  mt-3"
               v-model="ad_swich" :label="adSwichString"
              ></v-switch>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 md6>
              <v-text-field
                ref="ad_pone" v-model="ad_pone" :rules="ad_pone_rules"
                :eroor-messages="errorMessages" label="연락번호"
                filled clearable @blur="adPoneChange"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6>
            <v-dialog
              ref="dialog" v-model="calender" :return-value.sync="ad_date"
              persistent width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :class="pl" ref="ad_date" v-model="ad_date"
                  label="실종 날짜" readonly filled v-bind="attrs" v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="ad_date" scrollable locale="ko">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="calender = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(ad_date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-text-field
              ref="ad_place" v-model="ad_place" :rules="ad_place_rules"
              :eroor-messages="errorMessages" label="실종 장소"
              filled readonly clearable @click="showMap"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-textarea
              ref="ad_detail" v-model="ad_detail" label="반려견의 특징이나 상세 내용을 입력해주세요."
              :rules="ad_detail_rules" :eroor-messages="errorMessages" filled>
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-card>
        <v-btn color="primary" tile @click="step1">다음</v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card class="mb-2" elevation="0" tile
         :height="poster_style.ch" style="overflow:auto;" v-resize="onRisize">
          <v-dialog v-model="main_img_dialog" width="500">
            <v-card tile>
              <v-card-title class="headline grey lighten-2 font-weight-bold">
                메인 이미지 사입
              </v-card-title>
              <div class="mt-5 mr-5 ml-5">
                <v-file-input
                v-model="main_img" label="File input" filled accept="image/*"
                prepend-icon="mdi-camera" @change="mainImgInput"
                ></v-file-input>
              </div>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="main_img_dialog = false">close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="sb_img_dialog" width="500">
            <v-card tile>
              <v-card-title class="headline grey lighten-2 font-weight-bold">
                이미지 사입
              </v-card-title>
              <div class="mt-5 mr-5 ml-5">
                <v-file-input
                v-model="sb_img"
                accept="image/*"
                label="File input"
                filled
                prepend-icon="mdi-camera"
                @change="subImgInput"
                ></v-file-input>
              </div>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="sb_img_dialog = false"
                >
                  close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-card  tile min-width="420" max-width="630" :style="poster_style.p">
            <div :style="poster_style.p" ref="_poster">
              <v-img :src="main_img_url" id="main_img" class="d-flex justify-center"
                @mouseover="mainImgMouseover(true)" @mouseout="mainImgMouseover(false)">
                  <div :style="poster_style.b" class="text-center">전단지를 때지 말아주세요. 반려동물을 찾으면, 반드시 수거해 가겠습니다. 부탁드립니다.</div>
                  <div id="dog_name" class="d-flex align-center">
                    <div :style="poster_style.n" class="text-center">{{ad_name}}</div>
                  </div>
                  <div ref="main_img_btn" id="main_img_btn">
                    <v-btn x-large fab  @click="main_img_dialog=true">
                      <v-icon>mdi-image-plus</v-icon>
                    </v-btn>
                  </div>
              </v-img>
              <div id="title_area">
                <div id="title_div" class="d-flex align-center">
                  <!-- 22자 이네로 -->
                  <div class="text-center font-weight-bold" :style="poster_style.t">
                    {{ad_title}}
                  </div>
                </div>
              </div>
              <div v-if="ad_swich" class="text-center font-weight-bold" :style="poster_style.h">
                  사례금 : {{ad_honorarium}}만원
              </div>
              <div id="ad_info_area" class="d-flex align-center font-weight-bold">
                <div id="ad_ingo_div" style="width:100%;">
                  <div :style="poster_style.d" class="d-flex justify-center text-center">
                      <v-spacer></v-spacer>
                      연락처 : {{ad_pone}}
                      <v-spacer></v-spacer>
                      날짜 : {{ad_date}}
                      <v-spacer></v-spacer>
                  </div>
                  <div :style="poster_style.d">
                    {{ad_place}}
                  </div>
                </div>
              </div>
              <!-- 124자 이네로 -->
                <div :style="poster_style.c" class="d-flex justify-center text-center">
                  <div style="width:90%;">
                    {{ad_detail}}
                  </div>
                </div>
              <v-divider class="mt-2"></v-divider>
              <div id="sb_img_area" class="d-flex justify-center text-center"  >
                <div id="sb_img_div" v-for="(bar, index) in sb_img_urls" :key="index"
                  @mouseover="subImgMouseover(index, true)" @mouseout="subImgMouseover(index, false)">
                  <div :id="'sb_img'+index" class="sb_img">
                    <v-btn x-large fab  @click="subImgClick(index)">
                      <v-icon>mdi-image-plus</v-icon>
                    </v-btn>
                  </div>
                  <v-img v-if="bar" style="width:100%;height:100%;" :src='bar' ></v-img>
                </div>
              </div>
            </div>
          </v-card>
         </v-card>
        <v-btn color="primary" tile @click="alert=false; e1 --">이전</v-btn>
        <v-btn color="primary" tile @click="step2 " :loading="loading">다음</v-btn>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card class="mb-2" elevation="0" tile>
          <v-layout wrap>
            <v-col cols="12" md="7" class="pa-0" >
              <v-card tile style="margin:0 auto; width:420px; height:594px; overflow:auto;">
                <Poster 
                  ref="poster"
                  :form="form"
                  :ad_honorarium="{bl:ad_swich, hr:ad_honorarium}"
                  :main_img_url="main_img_url"
                  :sb_img_urls="sb_img_urls"
                  :poster="poster"
                  :first="true"
                  @child="createResult"
                />
              </v-card>
            </v-col>
            <v-col cols="12" md="5" class="pa-0">
                <v-simple-table >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left" style="width:25%;">분류</th>
                        <th class="text-left">내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bar in poster_data" :key="bar.name">
                        <td style="width:20%;">{{ bar.name }}</td>
                        <td>{{ bar.calories }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-col>
          </v-layout>
        </v-card>
        <v-btn color="primary" tile @click="e1 --">이전</v-btn>
        <v-btn color="primary" tile @click="step3" :loading="loading">만들기</v-btn>
      </v-stepper-content>
    </v-stepper-items>
    <KakaoMap ref="kakaoMap" @child="inputPlace"/>
     <v-alert
      v-model="alert"
      dense
      border="left"
      type="warning"
      id="main_img_btn"
      tile
      dismissible
    >
      {{alert_massage}}
    </v-alert>
  </v-stepper>
</template>

<script>
  import KakaoMap from './KakaoMap'
  import Poster from './Poster'
  export default {
    data: () => ({
      ad_title:null, 
      ad_name:null,
      ad_honorarium:null, 
      ad_swich : false, 
      ad_pone:null, 
      ad_detail:null, 
      ad_date:new Date().toISOString().substr(0, 10),
      ad_place : null,
      ad_place_rules : [
        v => !!v || "클릭하여 실종 장소를 입력해주세요."
      ],
      errorMessages:null, 
      ad_title_rules:[ 
        v => v === null || v.length <= 0 ? '제목이 입력되지 않았습니다' 
        : v.length > 24 ? '24자 이내로 입력해주세요.'
        : v.replace(/\s/g, '').length !== 0 || "공백만 입력하셨습니다."
      ],
      ad_name_rules:[ 
        v => v === null ? '이름이 입력되지 않았습니다' 
        : v.replace(/\s/g, '').length !== 0 || "공백만 입력하셨습니다."
      ],
      ad_honorarium_rules:[ 
        v => !!v || '사례금을 입력해 주세요.',
        v => Number.isInteger(v*1) || '숫자만 입력해주세요.'
      ],
      ad_pone_rules:[ 
        v => !v ? '연락가능한 번호를 입력하세요.' : v.length < 15 || '유효하지않은 번호 양식입니다.'
      ],
      ad_detail_rules:[
        v => v === null ? '상세내용을 입력해주세요.' 
        : v.replace(/\s/g, '').length === 0 ? "공백만 입력하셨습니다." 
        : v.length < 125 || '124자 이내로 입력하세요'
      ],
      e1:1,
      calender: false, 
      formHasErrors: false,
      poster_style : {},
      main_img_dialog : false,
      main_img:null,
      main_img_url:'',
      sb_img_dialog:false,
      sb_img_urls:[null, null, null],
      select_idx : null,
      sb_img : null,
      sb_imgs:[],
      alert:false,
      alert_massage : null,
      alert_key: true,
      poster_data : null,
      update:null,
      poster:null,
      poster_file:null,
      loading:false,
    }),
    components: {
      KakaoMap,
      Poster,
    },
    methods: {
      
      // 입력 폼 체크후 다음 단계 이동
      step1(){
        this.form_err = false;

        Object.keys(this.form).forEach(f => {
          if(!this.form[f] || this.$refs[f].hasError){
            this.form_err = true;
            this.$refs[f].validate(true);
          }
        })

        if(this.ad_swich){
          if(!this.ad_honorarium || this.$refs["ad_honorarium"].hasError){
            this.form_err = true;
            this.$refs["ad_honorarium"].validate(true);
          }
        }
        if(!this.form_err){
          this.e1 ++;
        }
      },
      // 이미지 삽입 체크후 다음 단계 이동
      step2(){
        if(!this.main_img_url){
          this.openAlert('상단 메인이미지를 첨부해주세요.');
          return
        }
        const sb = this.sb_img_urls;
        let form_err = false;
        for(let item of sb){
          if(!item) {
            form_err = true;
            this.openAlert('하단 이미지 3개를 첨부해주세요.')
            return
          }
        }
        if(!form_err){
          this.poster_data = [{name: '제목', calories: this.ad_title,},
            {name: '이름', calories: this.ad_name},
            {name: '사례금', calories: this.ad_swich ? this.ad_honorarium : '없음'},
            {name: '연락처', calories: this.ad_pone},
            {name: '실종 날짜', calories: this.ad_date,},
            {name: '장소', calories: this.ad_place},
            {name: '상세 내용',calories: this.ad_detail}
          ];
          this.createPoster();
        }
        
      },
      // 업로드 인지 업데이트인지 확인하고 서버에 insert or delete 요청
      step3(){
        this.createResult();
      },
      // 전단지 이미지를 생성하고 생성된 이미지 file로 변환
      createPoster(){
        this.loading = true;
        this.$refs.main_img_btn.style.display = 'none';
        for(let i = 0; i<3; i++){
          document.getElementById('sb_img'+i).style.display = 'none';
        }
        const poster = this.$refs._poster;
        let location = this.getElLocation(poster);
        var dataURLtoFile = this.dataURLtoFile;
        var pdf =  html2canvas(poster,{x: location.x , y : location.y , scale: 4})
        .then(function(canvas) {
          const imgData = canvas.toDataURL('image/jpg');
          return imgData;
        })
        pdf.then(value => {
          this.poster_file = this.dataURLtoFile(value, 'poster.jpg');
          this.poster = value
          this.loading = false;
          this.e1++;
        });
      },
      //받은 dataUrl을 파일로 변환
      dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
          u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {type:mime});
      },
      //추출할 el 좌표 값 획득
      getElLocation(el) {
        let x = 0;
        let y = 0;
        if(el.offsetParent) {
            do {
                x += el.offsetLeft - (el.scrollLeft !== 0 ? el.scrollLeft : 0);
                y += el.offsetTop - (el.scrollTop !== 0 ? el.scrollTop : 0);
            } while (el = el.offsetParent);
        }
        return {x : x, y : y + window.scrollY};
      },
      // insert or update 서버 사이드에 요청
      createResult(data){
        const items = this.sb_imgs;
        let form = this.form;
        const update = this.update;
        form.ad_honorarium = this.ad_swich ? this.ad_honorarium : null;

        let url = '';
        if(!!update){
          url = 'api/abandoned/update_poster';
          form.update = update;
        }else{
          url = 'api/abandoned/insert_poster';
        }
        var imgs = new FormData();
        imgs.append('main', this.main_img);
        imgs.append('form', JSON.stringify(form));
        for(let i = 0; i < items.length; i++){
          imgs.append('sb' + i, items[i]);
        }
        imgs.append('poster', this.poster_file);

        this.$http.post(url, imgs).then((res) => {
            if(res.data.code === 2){
              alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
              this.$router.push('/');
              return;
            }else if(!res.data.code){
              alert('이미지 저장 중에 문제가 발생했습니다.');
            }
            this.$router.go();
          }).catch(err => {
            alert('이미지 저장 중에 문제가 발생했습니다.');
            this.$router.push('/');
        })
      },
      //에러 사항 표시
      openAlert(ms){
        if(this.alert_key){
          this.alert_massage = ms ? ms : '이미지 첨부중에 문제가 발생했습니다.';
          this.alert = true;
        }
      },
      //메인 이미지를 삽입하고 삽입된 이미지 base64문자열로 변환 요청
      mainImgInput(event, bl){
        if(event){
          const type = event.type.indexOf('image/');
          if(!bl && type === -1){
            alert('이미지 파일만 업로드할 수 있습니다.');
            this.main_img = null;
            return;
          }
          if(event.size > 10485760){
            alert('이미지 최대 크기는 10MB입니다.');
            this.main_img = null;
            return
          }
          var img = new FormData();
          img.append('img', event);
          this.$http.post('/api/img/return_buffer', img).then(res => {
            if(res.data.code === 2){
              alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
              this.$router.go();
            }else if(res.data.code === 1){
              this.main_img_url = res.data.imgData;
              this.$refs.main_img_btn.style.display = 'none';
            }else{
              alert('pdf이미지 업로드에 실패하였습니다.');
            }
          }).catch(err => {
              this.openAlert();
          })
        }else{
          this.main_img_url = '';
          this.$refs.main_img_btn.style.display = 'block';
        }
      },
      //서브 이미지를 삽입하고 삽입된 이미지 base64문자열로 변환 요청
      subImgInput(event, bl){
        const idx = this.select_idx;
        if(event){
          const type = event.type.indexOf('image/');
          if(!bl && type === -1){
              alert('이미지 파일만 업로드할 수 있습니다.');
              return;
          }
          if(event.size > 10485760){
            alert('이미지 최대 크기는 10MB입니다.');
            this.sb_imgs[idx] = null;
            return
          }
          var img = new FormData();
          img.append('img', event);

          this.$http.post ('/api/img/return_buffer', img).then((res) => {
            if(res.data.code === 1){
              this.sb_imgs[idx] = event;
              this.sb_img_urls[idx] = res.data.imgData;
              document.getElementById('sb_img'+idx).style.display = 'none';
            }else if(res.data.code === 2){
              alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
              this.$router.go();
            }else{
              alert('pdf이미지 업로드에 실패하였습니다.');
            }
          }).catch(err => {
              this.openAlert();
          })
        }else{
          this.sb_imgs[idx] = null;
          this.sb_img_urls[idx] = null;
          document.getElementById('sb_img'+idx).style.display = 'block';
        }
      },
      subImgMouseover(idx, bl){
        if(this.sb_img_urls[idx]){
          document.getElementById('sb_img'+idx).style.display = bl ? 'block' : 'none';
        }
      },
      subImgClick(idx, bl){
        this.sb_img_dialog = !bl ? true : false;
        this.select_idx = idx;
        this.sb_img = this.sb_imgs[idx];
      },
      mainImgMouseover(bl){
        if(this.main_img_url){
          this.$refs.main_img_btn.style.display = bl ? 'block' : 'none';
        }
      },
      // 브라우저 크기 변환시 레이아웃 변경
      onRisize(){
        const bl = window.innerWidth < 960;
        this.layout_item = bl;
        this.poster_style = bl ? {
          p:'width:420px; height:594px;', ch:'620px', b:'color:white; font-size:0.66em;',
          n:'width:100%; color:white; font-size:2em;', t:'width:100%; font-size:2em; color:red;', h:'font-size:1.25em',
          d:'width:80%; margin:0 auto; font-size:1em;', c:'width:100%; height:13%; font-size:0.8em;',
        } : {
          p:'width:630px; height:891px;', ch:'920px', b:'color:white; font-size:1em;',
          n:'width:100%; color:white; font-size:3em;', t:'width:100%; font-size:3em; color:red;',
          h:'font-size:2em', d:'width:80%; margin:0 auto; font-size:1.5em;', c:'width:100%; height:13%; font-size:1.2em;',
        }
      },
      // 연락번호 입력후 blur시에 실행되는 메소드
      // 정수 부분만 추출한 뒤 추출된 문자열에 따라 정규식을 적용하여 형변환
      adPoneChange(){
        if(!this.$refs["ad_pone"].hasError){
          let extraction = this.ad_pone.replace(/[^0-9]/g,'');
          let format_pone = ''; 
          let pone_bl = false;
          let regular = '';
          if(extraction.length === 11){ //11자리
            format_pone = extraction.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            regular = /^\d{3}-\d{3,4}-\d{4}$/;
          }else if(extraction.length === 8){ //8자리
            format_pone = extraction.replace(/(\d{4})(\d{4})/, '$1-$2');
            regular = /^\d{4}-\d{4}$/;
          }else if(extraction.length === 12 && extraction.indexOf('05') === 0){
            format_pone = extraction.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
            regular = /^\d{4}-\d{4}-\d{4}$/;
          }else{
            if(extraction.indexOf('02') === 0){
              format_pone = extraction.length < 10 ?  extraction.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3') :  extraction.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
              regular = /^\d{2}-\d{3,4}-\d{4}$/;
            }else{
              format_pone = extraction.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
              regular = /^\d{3}-\d{3,4}-\d{4}$/;
            }
          }
          pone_bl = regular.test(format_pone);
          if(!pone_bl){
            this.$refs["ad_pone"].errorBucket.push("잘못된 번호입니다.");
            return false;
          }
          this.ad_pone = format_pone;
        }
      },
      // 카카오맵 오픈
      showMap(){
        this.$refs["kakaoMap"].openMap();
        this.onRisize();
      },
      // 장소 선택시 조건에 따라 장소 문자열 생성
      inputPlace(data){
        let item = '';
        item = data.name;
        item = data.address_name.length === 0 || item + ', ' + data.address_name;
        if(data.road_address_name.length > 0) {
          item += ', ' + data.road_address_name;
        };
        this.ad_place = item;
      },
      // // 전단지 이미지 생성
      // createPoster(){
      //   this.$refs.poster.createPDF();
      // },
    },
    computed: {
      // 사례금 선택시 텍스트 변환
      adSwichString(){
        return this.ad_swich ? '(단위 : 만원)' : '없음';
      },
      // 폼 데이터, 사례금 제외
      form(){
        return{
          ad_title : this.ad_title,
          ad_name : this.ad_name,
          ad_date : this.ad_date,
          ad_place : this.ad_place,
          ad_pone : this.ad_pone,
          ad_date : this.ad_date,
          ad_detail : this.ad_detail,
        }
      },
      pr(){
        return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm ? "pr-0" : "pr-1"
      },
      pl(){
        return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm ? "pl-0" : "pl-1"
      },
    },
    watch : {
      main_img_url : function(hook){
        if(hook){
          this.alert = false;
        }else{
          this.openAlert('상단 메인이미지를 첨부해주세요.');
        }
      },
      sb_img : function(hook){
        if(hook){
          this.alert = false;
        }else{
          this.openAlert('하단 이미지 3개를 첨부해주세요.');
        }
      }
    }
  }
</script>

<style>
@import '../../css/abandoned/inputabandoned.css';
</style>
