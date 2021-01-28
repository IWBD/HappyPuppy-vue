<template>
    <v-dialog v-model="dialog" :fullscreen="fullscreen" >
        <template v-slot:activator="{ on, attrs }">
            <v-btn  tile outlined v-bind="attrs" v-on="on">
                수정
            </v-btn>    
        </template>
        <v-card tile  v-resize="onResize" ref="dialog">
            <v-toolbar color="primary" dark height="60">
                <v-toolbar-title>내 정보</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn  x-large icon @click="dialog=false">
                    <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </v-toolbar>
            <v-tabs :vertical="vertical" v-model="tab" >
                <v-card v-if="vertical" tile elevation="0" :height="tab_height" 
                style="background-color:#F8F3F2">
                    <v-tab>
                        프로필
                    </v-tab>
                    <v-tab>
                        비밀번호
                    </v-tab>
                </v-card>
                <v-layout v-else wrap tile elevation="0" :height="tab_height" 
                style="background-color:#F8F3F2">
                    <v-tab>
                        프로필
                    </v-tab>
                    <v-tab >
                        비밀번호
                    </v-tab>
                </v-layout>
                <v-tab-item>
                    <v-layout wrap class="proflie_area">
                        <v-col cols="12" sm="4" class="img_area">
                            <div class="position_center">
                                <div class="a_center">
                                    <v-list-item-avatar class="ma-0" style="width:80px; height:80px;">
                                        <v-img :src="!member_info.img ? '' : '/api/img/get_img/member/' + member_info.img" class="profile_back">
                                            <v-icon v-if="!member_info.img" size="50">mdi-dog</v-icon>
                                        </v-img>
                                    </v-list-item-avatar>
                                </div>
                                <div class="mt-3 a_center">
                                    <v-btn tile outlined @click="openImgInput">수정</v-btn>
                                    <v-file-input style="display:none;"
                                        ref="profile_img"
                                        accept="image/*"
                                        @change="inputImg"
                                    ></v-file-input>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="8" id="member_info" class="nickname_area" >
                            <div class="profile position_center">
                                <v-text-field
                                    v-model="member_info.email"
                                    dense
                                    label="계정"
                                    height="40"
                                    disabled
                                ></v-text-field>
                                <v-text-field
                                    height="40"
                                    v-model="nickname"
                                    :rules="rules"
                                    counter="15"
                                    dense
                                    ref="nickname"
                                    label="닉네임"
                                ></v-text-field>
                                <v-btn tile outlined @click="updateNickname">수정</v-btn>
                            </div>
                        </v-col>
                    </v-layout>
                </v-tab-item>
                <v-tab-item>
                    <div v-if="login_info.number === 1" class="pass_area">
                        <PWC
                        :isLogin="member_info.email"
                        @child="tab = 0"/>
                    </div>
                    <div v-else style="width:100%; padding-top:20px; text-align:center;">
                        네이버 로그인 사용자는 이용하실 수 없습니다.
                    </div>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-dialog>
</template>

<script>
import PWC from "../apps/PWC";
import { mapGetters } from 'vuex';
const member = 'member';
export default {
  props:['member_info'],
  components:{PWC},
  data: () => ({
    dialog : false,
    input: null,
    nickname : "",
    rules: [v => v.length <= 15 || '15자 까지 가능합니다.'],
    tab:0,
    tab_height:0,
    fullscreen:null,
    vertical:null,
  }),
  computed:{
    ...mapGetters(member, {
        login_info: 'GET_LOGIN_INFO'
    }),
    number(){
        return this.login_info.number !== 1;
    }
  },
  methods:{
    //window 크기 변화 감지
    //조건에 따라 레이아웃 조절 변수들 변경
    onResize(){
        const {innerWidth ,innerHeight} = window;
        if(innerWidth > 959){
            this.fullscreen = false;
            this.tab_height = `auto`;
            this.vertical = true;
            return
        }
        this.fullscreen = true;
        if(innerWidth > 599){
            this.vertical = true;
            this.tab_height = `${innerHeight - 60}px`;
        }else{
            this.vertical = false;
            this.tab_height = `auto`;
        }
    },
    //파일선택창 열기
    openImgInput(){
        this.$refs.profile_img.$el.getElementsByTagName('input')[0].click();
    },
    //이미지 업로드
    inputImg(event){
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
            const img = this.member_info.img;
            var form = new FormData();
            form.append('img', event);
            form.append('n', !img ? 0 : 1);
            form.append('delete_key', img);

            this.$http.post('/api/member/profile', form).then(res => {
                if(res.data.code === 1){
                    this.changeParent(res.data.item, true);
                }else if(res.data.code === 2){
                    alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
                    this.$router.push('/');
                }else{  
                    alert('프로필 이미지 변경에 문제가 발생했습니다.');
                }
            }).catch(err => {
                console.log(err);
                alert('프로필 이미지 변경에 문제가 발생했습니다.');
            })
        }
    },
    //닉네임 변경
    updateNickname(){
        let nickname = this.nickname
        if(this.member_info.nickname !== nickname){
            if(!this.$refs.nickname.hasError){
                this.$http.get('/api/member/nickname/' + nickname).then(res =>{
                    if(res.data.code === 1){
                        this.changeParent(nickname, false);
                    }else if(res.data.code === 2){
                        alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
                        this.$router.push('/');
                    }else if(res.data.code === 3){
                        alert('이미 사용중인 닉네임입니다.')
                    }else{
                        alert('닉네임 변경에 실패하였습니다.')
                    }
                }).catch(err => {
                    console.log(err);
                    alert('닉네임 변경에 실패하였습니다.')
                })
            }
        }
    },
    //변경 내용을 부모 컴포넌트 방영
    changeParent(item, bl){
        this.$emit('child', {bl:bl, item : item});
    },
  },
  mounted(){
    this.nickname = !this.member_info.nickname ? "" : this.member_info.nickname ;
  },
  
}
</script>

<style scoped>
    @import '../../css/member/profile.css';
</style>