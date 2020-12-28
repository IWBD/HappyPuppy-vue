<template>
  <v-dialog v-model="join_dialog" persistent  fullscreen>
    <v-card>
      <v-toolbar color="#1E88E5">
        <v-card-title>
          <span class="headline" style="color:white;">회원가입</span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="formClose">
          <v-icon size="40">mdi-close-box</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="form_area">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
              <center>
                <img src="../../images/logo.png" width="200">
              </center>
                <v-text-field
                ref="member_name"
                v-model="member_name"
                :rules="[() => !!member_name || '이름을 입력해주세요.']"
                :error-messages="errorMessages"
                label="이름"
                clearable
                required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8" xs="12">
                  <v-text-field
                  ref="member_email"
                  v-model="member_email"
                  :rules="emailRules"
                  :error-messages="errorMessages"
                  label="이메일"
                  clearable
                  required
                  :disabled="email_disabled"
                  @blur="duplicateEmail"
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" xs="12">
                    <v-btn block height="50px" class="font-weight-bold"  @click="sendCertifyNumber">인증번호 보내기</v-btn>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  ref="certify_number"
                  v-model="certify_number"
                  :rules="[() => !!certify_number || '인증번호를 입력하세요.']"
                  :error-messages="errorMessages"
                  type="password"
                  label="인증번호"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" xs="12">
                <v-text-field
                ref="member_password"
                v-model="member_password"
                :rules="passwordRules"
                :error-messages="errorMessages"
                label="비밀번호"
                clearable
                required
                type="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" xs="12">
                <v-text-field
                ref="member_password_check"
                v-model="member_password_check"
                :rules="passwordCheckRules"
                :eroor-messages="errorMessages"
                type="password"
                label="비밀번호 확인"
                clearable
                required
                ></v-text-field>
              </v-col>
              <v-btn block height="60px" color="primary" @click="submit">회원가입</v-btn>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" class="font-weight-bold" text @click="dataReset">초기화</v-btn>
          <v-spacer/>
          <v-btn color="blue darken-1" class="font-weight-bold" text @click="formClose">닫기</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        join_dialog: false, 
        member_email:null, 
        certify_number:null, 
        member_password:null, 
        member_password_check:null,
        member_name:null,
        emailRules: [
          v => !!v || '이메일을 입력해주세요.',
          v => /.+@.+/.test(v) || '이메일 양식에 맞지 않습니다.',
        ],
        passwordRules:[
          v => v === null ? '비밀번호를 입력해주세요.'
          : v.length >= 8 && v.length <=25 || '8~25자의 영문, 숫자, 특수문자를 입력하세요.',
          v => /[0-9]/g.test(v) || '숫자가 포함되어있지 않습니다.',
          v => /[a-z]/ig.test(v) || '영문이 포함되어있지 않습니다.',
          v => /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi.test(v) || '특수문자가 포함되있지 않습니다.',
        ],
        passwordCheckRules:[
          v => !!v || '비밀번호 확인이 입력되어있지 않습니다.',
          v => v === this.member_password || '비밀번호가 일치하지 않습니다.',
        ],
        errorMessages: '',
        formHasErrors: false, 
        email_disabled: false, 
      }
    },
    props: ['login_info'],
    computed:{
      //폼에 필요한 데이터 리턴
      form(){
        return{
          member_name:this.member_name,
          member_email: this.member_email,
          certify_number:this.certify_number,
          member_password:this.member_password,
          member_password_check:this.member_password_check,
        }
      }
    },
    methods:{
      //이메일 중복 확인
      duplicateEmail(){
        const {member_email} = this.$refs;
        const num = member_email.errorBucket.length;

        if(!num){
          this.$http.get("/api/join/duplicate_email/" + this.member_email).then(res => {
            if(!!res.data.code && res.data.result > 0){
              member_email.errorBucket.push("이미 사용중인 이메일 입니다.")
            }
          }).catch(err => {
            console.log(err);
          })
        }
      },
      //회원 페이지 이동 혹은 회원가입 폼 오픈
      joinOrMypageButton(){
        if(!!this.login_info.number){
          this.$router.push('/memberPage')
        }else{
          this.join_dialog = true;
        }
      },
      //폼의 모든 필드 데이터 리셋
      dataReset(){  
        this.errorMessages = [] 
        this.formHasErrors = false 

        Object.keys(this.form).forEach(f => {
          this.$refs[f].isResetting = true;
          this.$refs[f].internalValue = Array.isArray(this.internalValue) ? [] : null;
        })
        this.email_disabled = false;
      },
      //폼 닫기
      formClose(){
        this.dataReset();
        this.join_dialog = false;
      },
      //회원 가입 요청
      //폼의 모든 필드에 유효성 검사 후 로그인 요청
      submit () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f] || this.$refs[f].hasError) {
            this.formHasErrors = true;
            this.$refs[f].validate(true); //해당 필드에 에러메세지 도출
          }
        })
        
        if(!this.formHasErrors){
          const item = {
            'email' : this.member_email,
            'name' : this.member_name,
            'certify_number' : this.certify_number,
            'password' : this.member_password
          }

          this.$http.post("/api/join/input_member", item).then(res => {
            if(!!res.data.code){
              if(res.data.result){
                alert('인증번호가 일치하지 않거나, 요청 시간이 초과되었습니다.')
                return;
              }
              this.member_password = [];
              this.member_password_check = [];
              alert("회원가입이 완료되었습니다.");
              this.formClose();
            }
          }).catch(err => {
            console.log(err);
            alert("회원가입 과정에서 문제가 발생했습니다.");
          })
        }
      },
      //이메일 인증번호 전송 요청
      //이메일 필드에 유효성 검사 후 요청
      sendCertifyNumber(){
        let email_field = this.$refs["member_email"]
        if(!email_field.hasError){ 
          this.email_disabled = true;
          const item = {email : this.member_email};
          this.$http.post ('/api/join/certify-number', item).then(res => {
            if(!res.data.code || !res.data.result){
              this.email_disabled = false;
            }else{
              alert('인증번호가 전송되었습니다.')
            }
          }).catch(err => {
            alert('인증번호 요청 과정에 문제가 발생했습니다.');
            this.email_disabled = false;
          })
        }else{
          email_field.validate(true)
        }
      },

    }
  }

</script>