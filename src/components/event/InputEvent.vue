<template>
  <v-dialog v-model="dialog" width="80%" height="auto" fullscreen>
    <v-card width="100%" height="auto" style="position:relative;" tile>
      <v-card-title class="headline grey lighten-2 font-weight-bold">
        행사 등록
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
        <v-btn color="green" dark width="67" tile elevation="0" @click="insertEvent">등록</v-btn>
        <v-btn color="primary" tile width="67" elevation="0" @click="dataReset">close</v-btn>
        </div>
      </v-card-title>
      <v-layout wrap>
      <v-col cols="12" xs="12" sm="12" md="6" height="370">
        <v-text-field
        ref="ev_name"
        v-model="ev_name"
        filled clearable
        :rules="nameRules"
        :eroor-messages="errorMessages"
        label="행사이름"
        ></v-text-field>
        <v-text-field
        ref="ev_url"
        v-model="ev_url"
        filled clearable
        :rules="urlRules"
        :eroor-messages="errorMessages"
        label="홈페이지 URL(예시: http://happypuppy.com)"
        ></v-text-field>
        <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              ref="ev_dates"
              filled clearable
              v-model="dateRangeText"
              :rules="[() => !!dateRangeText || '기간을 선택해주세요.']"
              :eroor-messages="errorMessages"
              label="클릭하여 기간을 지정해주세요."
              persistent-hint
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="ev_dates" range locale="ko"></v-date-picker>
        </v-menu>
        <v-file-input 
          ref="ev_img"
          filled clearable
          :rules="[() => !!ev_img || '포스터를 삽입해주세요.']"
          v-model="ev_img" accept="image/*" label="이미지 첨부" @change="imgView">
        </v-file-input>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" id="img_col" >
        <div class="slider">
          가로 영역 크기 조정
          <v-slider
            v-model="xv"
            min="280"
            :max="x_max"
            :disabled="sl_disabled"
          ></v-slider>
          새로 역역 크기 조정
          <v-slider
            v-model="yv"
            min="280"
            :max="y_max"
            :disabled="sl_disabled"
          ></v-slider>
        </div>
        <div id="img_cutting" ref="img_cutting" style="height:370px;">
          <img class="img_view" ref="img_view" :src="img" v-resize="onResize"/>
          <div ref="box" @mousedown="dragMouseDown" @touchstart="touchStart" 
            @touchmove="elementTouch" @touchend="closeTouchElement" class="img_cutting_box" >
          </div>
        </div>  
      </v-col>
      </v-layout>
      
    </v-card>
    <v-dialog  v-model="loader_dialog" hide-overlay  persistent width="350">
        <v-card color="primary" dark>
            <v-card-text>행사 등록중입니다. 잠시만 기다려 주세요.
                <v-progress-linear  indeterminate color="white"  class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card> 
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      menu: false,
      xv:0,
      yv:0,
      x_max:1000,
      y_max:1000,
      ev_dates:[],
      ev_name: null,
      ev_url: null,
      ev_img: null,
      img: null,
      update_bl : false,
      dialog:false,
      loader_dialog:false,
      nameRules:[
        v => v === null ? '행사명을 입력해 주세요.'
        : v.length < 21 || '20자 이네로 입력해 주세요.',
      ],
      urlRules: [
        v => v === null ? '홈페이지 url를 입력해 주세요.'
        : v.length < 2000 || 'url길이를 초과 하셨습니다.',
        v => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(v) || 'url양식이 맞지 않습니다.'
      ],
      dateRules: [
        v => !!v || '기간을 선택해 주세요.',
      ],
      imgRules: [
        v => !!v || '포스터를 삽입해 주세요.'
      ],
      errorMessages : '',
      ich: '370',
      sl_disabled:true,
      img_size:{},
      position: {1 : 0, 2 : 0, 3 : 0, 4 : 0,},
      first_img : false,
      ins : null, //이미지의 본래 사이즈
      bns : null, //추출 상자의 본래 사이즈
      bs : null, //추출 상자의 변환 사이즈
      nrt : null, //변환 전환 비율
      rt : null, //본래 전환 비율
      coord : null, //본래 이미지 좌표
      update : false,
    }),
    computed: {
      dateRangeText () {
        return this.ev_dates.join(' ~ ')
      },
      form(){
        return {
          ev_name : this.ev_name,
          ev_url : this.ev_url,
          ev_dates: this.ev_dates,
        }
      },
    },
    methods: {
      //컷팅 박스 모바일 터치
      //시작 좌표 변수에 재정의
      touchStart(event){
        const item = event || window.event;
        this.position[3] = item.touches[0].clientX;
        this.position[4] = item.touches[0].clientY;
      },
      //컷팅 반스 모바일 터치 상태에서 움직임
      //이미지 범위 이탈 방지
      elementTouch(evnet){
        const item = event || window.event, 
        {box, img_view }= this.$refs,
        {rt, coord} = this,
        {offsetLeft, offsetTop, offsetWidth, offsetHeight} = box,
        _coord = {l : coord.l, t : coord.t}

        this.position[1] = this.position[3] - item.touches[0].clientX;
        this.position[2] = this.position[4] - item.touches[0].clientY;
        this.position[3] = item.touches[0].clientX;
        this.position[4] = item.touches[0].clientY;

        let left = offsetLeft - this.position[1], top = offsetTop - this.position[2];
        left = left > offsetLeft ? (++_coord.l) * rt : left === offsetLeft ? _coord.l * rt : (--_coord.l) * rt;
        top = top > offsetTop ? (++_coord.t) * rt : top === offsetTop ? _coord.t * rt : (--_coord.t) * rt;

        if(left >= 0 && left <= img_view.offsetWidth - offsetWidth){
          box.style.left = `${left}px`;
          coord.l = _coord.l;
        }else{
          box.style.left = `${offsetLeft}px`;
        }
        
        if(top >= 0 && top <= img_view.offsetHeight - offsetHeight){
          box.style.top = `${top}px`;
          coord.t = _coord.t;
        }else{
          box.style.top = `${offsetTop}px`;
        }
      },
      //컷팅 박스 터치 종료
      closeTouchElement(){
        Object.keys(this.position).forEach(f => {
          this.position[f] = 0;
        })
      },
      //웹 환경에서 컷팅박스 드래그 시작
      dragMouseDown(event){
        const item = event || window.event;
        item.preventDefault();
        this.position[3] = item.clientX;
        this.position[4] = item.clientY;
        document.onmouseup = this.closeDragElement;
        document.onmousemove = this.elementDrag;
      },
      //이미지 추출 박스를 드래그로 이동,
      //이미지 범위 이탈 방지
      elementDrag(evnet){
        const item = event || window.event, 
        {box, img_view }= this.$refs,
        {rt, coord} = this,
        {offsetLeft, offsetTop, offsetWidth, offsetHeight} = box,
        _coord = {l : coord.l, t : coord.t}

        item.preventDefault();

        this.position[1] = this.position[3] - item.clientX;
        this.position[2] = this.position[4] - item.clientY;
        this.position[3] = item.clientX;
        this.position[4] = item.clientY;

        let left = offsetLeft - this.position[1], top = offsetTop - this.position[2];
        left = left > offsetLeft ? (++_coord.l) * rt : left === offsetLeft ? _coord.l * rt : (--_coord.l) * rt;
        top = top > offsetTop ? (++_coord.t) * rt : top === offsetTop ? _coord.t * rt : (--_coord.t) * rt;

        if(left >= 0 && left <= img_view.offsetWidth - offsetWidth){
          box.style.left = `${left}px`;
          coord.l = _coord.l;
        }else{
          box.style.left = `${offsetLeft}px`;
        }
        
        if(top >= 0 && top <= img_view.offsetHeight - offsetHeight){
          box.style.top = `${top}px`;
          coord.t = _coord.t;
        }else{
          box.style.top = `${offsetTop}px`;
        }
      },
      //드래그 종료
      closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
        Object.keys(this.position).forEach(f => {
          this.position[f] = 0;
        })
      },
      //행사 업로드 요청
      insertEvent(){
        let formHasErrors = false
        let form = this.form
        Object.keys(form).forEach(f => {
          if (!form[f] || this.$refs[f].hasError) {
            formHasErrors = true;
            this.$refs[f].validate(true) // 폼의 에러부분에 메세지 띄워주는 메소드
          }
        })

        if(!this.ev_img || this.$refs.ev_img.hasError){
          formHasErrors = true;
          this.$refs.ev_img.validate(true);
          return
        }
        
        if(!formHasErrors){
          this.loader_dialog = true;
          const item = {
            ev_name : form.ev_name,
            ev_url : form.ev_url,
            ev_start_date: form.ev_dates[0] > form.ev_dates[1] ? form.ev_dates[1] : form.ev_dates[0],
            ev_end_date : form.ev_dates.length < 1 || form.ev_dates[0] === form.ev_dates[1] ? null 
            : form.ev_dates[0] > form.ev_dates[1] ? form.ev_dates[0] : this.ev_dates[1],
          },
          {coord, bns, ev_img} = this,
          position = { 
            left : coord.l, top : coord.t,
            width : bns.w, height : bns.h
          };

          var form_data = new FormData();
          form_data.append('form', JSON.stringify(item));
          form_data.append('position', JSON.stringify(position));
          form_data.append('img', ev_img);
          let url = '';

          if(!!this.update){
            url = 'api/event/update'
            form_data.append('update', JSON.stringify(this.update));
          }else{
            url = 'api/event/sharp_img'
          }

          this.$http.post(url, form_data).then( res =>{
            if(res.data.code === 1){
              this.dialog = false;
              history.go(0);
            }else if(res.data.code === 2){
              alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
              this.$router.push('/');
            }else{
              alert("이미지 추출 과정에서 문제가 발생했습니다.");
            }
            this.loader_dialog = false;
          }).catch(err => {
            console.log(err);
            alert("이미지 추출 과정에서 문제가 발생했습니다.");
            this.loader_dialog = false;
          })
        }
      },
      //이미지가 첨부 됐을때 비율을 계산하여 이미지 추출 박스를 보여줌
      //백앤드 서버에 추출할 포지션들이 들어가면 소수점이 있거나 이미지 크기를 초과하였을 경우
      //작동하지 않음으로 소수점이 발생하면 안됨
      imgView(event){
        const {img_cutting, box} = this.$refs;
        if(event){
          const {setImgNaturalSize, cuttingBoxSizing} = this;
          this.img = URL.createObjectURL(event);
          this.sl_disabled = false;
          const me = this;
          //** 이미지 들어감
          this.$refs.img_view.onload = function() {
            if(this.naturalWidth < 280 || this.naturalHeight< 280){
              alert('이미지가 너무 작습니다. 최소 280 * 280 이미지로 제작해주세요.')
              me.img = null;
              me.ev_img = null;
              return
            }

            img_cutting.style.height = 'auto';
            box.style.display = 'block';

            //이미지 원래 사이즈 밑 max 값 설정
            setImgNaturalSize(this.naturalWidth, this.naturalHeight);
            //컷팅 박스 크기 재정의
            cuttingBoxSizing();
          }
        }else{
          this.img = null;
          this.sl_disabled = true;
          img_cutting.style.height = "370px";
          box.style.display = 'none';
          box.style.width = '200px';
          box.style.height = "300px";
        }
      },
      //이미지 본래 사이즈 변수, 이미지 상단 슬라이더 max값을 초기화
      setImgNaturalSize(w, h){
        this.ins = {w : w, h : h}; 
        this.xv = w;
        this.x_max = w;
        this.yv = h;
        this.y_max = h;
      },
      //window size 변동시 실행
      onResize(){
        if(this.img){
          this.cuttingBoxSizing(this.xv, this.yv);
        }
      },
      cuttingBoxSizing(xv, yv){
        const {box, img_view} = this.$refs,
        {offsetWidth, offsetHeight, naturalWidth, naturalHeight} = img_view;
        const rt = offsetWidth / naturalWidth, 
        bns = {w : !xv ? naturalWidth : xv, h: !yv ? naturalHeight : yv},
        bs = {w: bns.w * rt, h: bns.h * rt };

        this.nrt = naturalWidth / offsetWidth; //확대 비율
        this.rt = rt; //축소 비율
        this.bns = bns;
        this.bs = bs;

        box.style.width = `${bs.w}px`;
        box.style.height = `${bs.h}px`;

        const l = Math.floor((naturalWidth - bns.w) / 2), 
        t = Math.floor((naturalHeight - bns.h) / 2);

        this.coord = { l : l, t:t}; 

        box.style.left = `${l * rt}px`;
        box.style.top = `${t * rt}px`;
      },
      //입력한 데이터를 초기화 후 dialog 닫기
      dataReset(){  
        this.errorMessages = []; 
        const {ev_img, img_cutting, box} = this.$refs;
        box.style.width = "200px";
        box.style.height = "300px";
        box.style.display = "none";
        Object.keys(this.form).forEach(f => {
          this.$refs[f].isResetting = true;
          this.$refs[f].internalValue = Array.isArray(this.internalValue) ? [] : null;
        })
        ev_img.reset();
        img_cutting.style.height = "370px";
        this.dialog = false;
      },
    },
    watch:{
      dialog:function(hook){
        hook || this.dataReset();
      },
      xv:function(hook){
        this.cuttingBoxSizing(hook, this.yv);
      },
      yv:function(hook){
        this.cuttingBoxSizing(this.xv, hook);
      }
      
    }
  }
</script>

<style  scoped>
#img_cutting{
  width:100%;
  position: relative;
  border:1px solid #cdcfcf;
  z-index: 1;
}
.img_cutting_box{
  position:absolute;
  display: none;
  width:200px;
  height:300px;
  border:2px solid #1E90FF;
  box-sizing: border-box;
}
.img_cutting_box:hover { box-shadow: 0 0 10px 0 darkgray; cursor: pointer; }
.img_view{
  width:100%;
  height: auto;
  display:block;
}
#control_btn{
  position:absolute;
  top:0;
  left:0;
  transform:translate(-50%, -50%);
  cursor: move;
}
.btn_center{
  position:absolute;
  transform:translate(-50%, -50%);
}
.move_btn{
  top:50%;
  left:50%;
}
.slider{
  width:95%; margin:0 auto;
}
</style>