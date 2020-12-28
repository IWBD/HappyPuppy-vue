<template>
    <v-layout wrap>
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
                <v-btn block height="50px" class="font-weight-bold" :loading="loading" @click="sendCertifyNumber">인증번호 보내기</v-btn>
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
            :type="showPW ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" xs="12">
            <v-text-field
            ref="member_password_check"
            v-model="member_password_check"
            :rules="passwordCheckRules"
            :eroor-messages="errorMessages"
            :type="showPW ? 'text' : 'password'"
            label="비밀번호 확인"
            clearable
            required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn block height="60px" color="primary" @click="submit">비밀번호 변경</v-btn>
          </v-col>
    </v-layout>
</template>

<script>
export default {
    data () {
      return {
        member_email:null,
        certify_number:null,
        member_password:null,
        member_password_check:null,
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
        email_disabled:false,
        errorMessages: '',
        formHasErrors: false, 
        loading: false,
      }
    },
    computed:{
      //폼의 모든 필드 데이터 리턴
      form(){
        return{
          member_email: this.member_email,
          certify_number:this.certify_number,
          member_password:this.member_password,
          member_password_check:this.member_password_check,
        }
      }
    },
    methods:{
      //폼의 모든 필드 리셋
      dataReset(){  
        this.errorMessages = [] 
        this.formHasErrors = false 

        Object.keys(this.form).forEach(f => {
          this.$refs[f].isResetting = true;
          this.$refs[f].internalValue = Array.isArray(this.internalValue) ? [] : null;
        })

        this.email_disabled = false;
      },
      //인증번호 요청
      sendCertifyNumber(){
        let email_field = this.$refs["member_email"]

        if(!email_field.hasError){ 
          this.email_disabled = true;
          this.loading = true;
          const item = {email : this.member_email, bl:false};

          this.$http.post ('/api/member/certify_number', item).then(res => {
            this.loading = false;
            if(!res.data.code){
              alert('인증번호 요청 과정중에 문제가 발생했습니다.');
            }else if(!res.data.result){
              alert('가입되지 않은 이메일입니다.')
            }else{
              alert('인증번호가 전송되었습니다.');
              return;
            }
            this.email_disabled = false;
          }).catch(err => {
            alert('인증번호 요청 과정중에 문제가 발생했습니다.');
            this.loading = false;
            this.email_disabled = false;
          })
        }else{
          email_field.validate(true)
        }
      },
      //비밀번호 변경 요청
      submit(){
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
            'certify_number' : this.certify_number,
            'password' : this.member_password
          }

          this.$http.post("/api/member/find_pass", item).then(res => {
            if(!!res.data.code){
              if(res.data.result){
                alert('인증번호가 일치하지 않거나, 요청 시간이 초과되었습니다.')
                return;
              }
              alert("비밀 번호가 변경되었습니다.");
              this.dataReset();
              this.$emit('child');
            }
          }).catch(err => {
            console.log(err);
            alert("회원가입 과정에서 문제가 발생했습니다.");
          })
        }
      }
    }
}
</script>
