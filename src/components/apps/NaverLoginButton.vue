<template>
    <v-btn width="100%" height="60px" color="success" dark @click="naverLogin">NAVER 계정으로 로그인
    </v-btn>
</template>

<script>
export default {
    methods:{
        naverLogin(){
            this.$http.post('/api/login/naver', {p:this.$router.history.current.path}).then(res => {
                location.href = res.data.result;
            }).catch(err=>{
                alert('네이버 로그인 페이지 이동 과정에서 문제가 발생했습니다')
            })
        }
    }
}
</script>