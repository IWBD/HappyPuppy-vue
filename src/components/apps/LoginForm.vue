<template>
  <v-dialog v-model="login_dialog" persistent fullscreen>
    <v-card>
      <v-toolbar color="#1E88E5">
        <v-card-title>
          <span class="headline" style="color:white;">로그인</span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="formClose">
          <v-icon size="40">mdi-close-box</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="form_area">
        <br>
        <v-container>
          <v-row>
            <v-col cols="12">
              <center>
                <img src="../../images/logo.png" width="200">
              </center>
              <br><br>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                <v-text-field
                ref="user_email"
                v-model="user_email"
                :rules="[() => !!user_email || '이메일을 입력해주세요.']"
                :eroor-messages="errorMessages"
                label="이메일"
                filled clearable
                @keyup.enter="tryLogin"
                ></v-text-field>
                <v-text-field
                ref="user_pw"
                v-model="user_pw"
                :rules="[() => !!user_pw || '비밀번호를 입력해주세요.']"
                :eroor-messages="errorMessages"
                type="password"
                label="비밀번호"
                filled clearable
                @keyup.enter="tryLogin"
                ></v-text-field>
                <span style="color:red; font-size:12px">{{ex_message}}</span>
                <br><br>
                <v-btn block height="60px" color="primary" @click="tryLogin">로그인</v-btn>
                <br>
                <NLB/>
                </v-tab-item>
                <v-tab-item>
                  <PWC
                  @child="tab = 0"/>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <div class="dif_area">
            <v-btn color="primary" v-text="!tab ? '비밀번호 찾기' : '로그인 하기'"
            text @click="tab = tab ? 0 : 1" ></v-btn>
            <v-btn color="primary" text @click="moveToJoin">회원가입</v-btn>
          </div>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import NLB from './NaverLoginButton'//네이버 로그인 버튼
import PWC from "./PWC";
  export default {
    data: () => ({
      tab:0,
      login_dialog: false, 
      errorMessages: '', 
      user_email: null, 
      user_pw: null, 
      ex_message : '', 
      formHasErrors: false,
    }),
    props: ['login_info'],
    computed:{
      //폼에 필요한 데이터 리턴
      form(){
        return{
          user_email:this.user_email,
          user_pw:this.user_pw,
        }
      },
      
    },
    methods :{
      //로그인 폼을 열거나, 로그아웃
      inOrOut_button(){
        if(this.login_info.number !== 0){
          this.$http.get("/api/login_spv/logout").then((res) => {
              this.$emit("child", {
                number: 0,
                l_title: "LOGIN",
                r_title: "SIGN UP"
              });
          }).catch(err => {
            this.$router.go();
          });
        }else{
          this.login_dialog = true;
        }
      },
      //로그인 폼 닫고, 회원가입 폼 열기
      moveToJoin(){
        this.formClose();
        this.$emit('join');
      },
      //폼 데이터 리셋
      dataReset(){  
        this.errorMessages = [];
        this.formHasErrors = false;
        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset();
        })
        this.ex_message = '';
      },
      //폼 닫기
      formClose(){
        this.dataReset();
        this.login_dialog = false;
      },
      //로그인 요청
      //폼의 각 필드에 유효성 검사 후 로그인 요청
      tryLogin(){
        this.formHasErrors = false
        Object.keys(this.form).forEach(f => {
           if (!this.form[f] || this.$refs[f].hasError) {
            this.formHasErrors = true;
            this.$refs[f].validate(true)//해당 필드에 에러메세지 도출
          }
        })
        if(!this.formHasErrors){
          this.$http.post("/api/login", {'email' : this.user_email, 'password' : this.user_pw,}).then(
            (res) => {
              if(!!res.data.message){
                this.$emit("child", {
                  number: 1,
                  l_title: "LOGOUT",
                  r_title: "MYPAGE"
                });
                this.formClose();
              }else{
                this.ex_message = "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다."
              }
            }).catch(err => {
              alert(err);
            })
          }
        }
    },
    components:{
      NLB, PWC
    }
  }
</script>