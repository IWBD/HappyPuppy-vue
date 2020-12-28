<template>
    <v-container fluid style="padding:0px; height:100%; background-color:#F8F3F2">
        <div id="member_page">
            <div>
                <v-btn @click="openInsertForm" color="primary">행사 등록</v-btn>
            </div>
            <v-card tile v-if="ext_none">
                <v-list >
                    <v-list-group :value="false" v-for="(bar, i) in events" :key="i">
                        <template v-slot:activator>
                            <v-list-item-title v-text="bar.ev_name" class="font-weight-bold"></v-list-item-title>
                        </template>
                        <div class="content">
                            <v-layout wrap>
                                <v-col cols="12" sm="4"  style="text-align:center;">
                                    <img :src="'/api/img/get_img/event/' + bar.ev_img">
                                </v-col>
                                <v-col cols="12" sm="8" style="position:relative;">
                                    <div class="content_info">
                                        <div>
                                            행사 이름 : {{bar.ev_name}}
                                        </div>
                                        <div>
                                            행사 기간 : {{formateDate(bar.ev_start_date, bar.ev_end_date)}}
                                        </div>
                                        <div>
                                            홈페이지 URL: {{bar.ev_url}}
                                        </div>
                                    </div>
                                    <div class="content_btn">
                                        <v-btn tile elevation="0" class="font-weight-bold" color="primary" @click="updateEvent(bar)">수정</v-btn>
                                        <v-btn tile elevation="0" class="font-weight-bold" dark color="red" @click="deleteEvent(bar.num, i)">삭제</v-btn>
                                    </div>
                                </v-col>
                            </v-layout>
                        </div>
                    </v-list-group>
                </v-list>
            </v-card>
            <h4 v-else class="ext_none" style="padding-top:20%;">
                활동 정보가 없습니다.
            </h4>
        </div>
        <InputForm ref="form"/>
        <InputForm ref="inputForm"/>
    </v-container>
</template>

<script>
import InputForm from '../event/InputEvent';
import { mapMutations, mapGetters } from 'vuex';
const name = 'member'
export default {
    data: () => ({
        events : null,
        ext_none : true,
    }),
    computed:{
        ...mapGetters(name, {
            login_info: 'GET_LOGIN_INFO'
        }),
    },
    watch:{
        //로그 아웃 감지
        login_info: function(hook){
            !!hook.number || this.$router.push('/');
        },
        //활동 내역 감지
        events: function(hook){
            this.ext_none = hook.length > 0 ? true : false;
        },
    },
    methods:{
        //업로드 폼 열기
        openInsertForm(){
            this.$http.get('/api/login_spv').then(res => {
                if(!res.data.code || res.data.code === 2){
                    alert("로그인 이후에 가능한 서비스입니다.");
                }else{
                    this.$refs.inputForm.dialog = true;
                    this.$refs.inputForm.update = false;
                }
            }).catch(err => {
                console.log(err);
                alert("로그인 여부를 검사 중 문제가 발생했습니다.");
            });
        },
        //행사 업데이트
        //폼 오픈때 기존에 있던 이미지의 원본 파일을 url로 얻어
        //파일화 하여 다시 input
        updateEvent(item){
            const form = this.$refs.form
            form.dialog = true;
            form.ev_name = item.ev_name;
            form.ev_url = item.ev_url;
            form.update = {num : item.num, key: item.ev_img};
            form.ev_dates = [this.getDate(item.ev_start_date), this.getDate(item.ev_end_date)];

            let url = '/api/img/get_img/event/' + item.ev_img.split('sharp')[1];

            const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
            toDataURL(url)
            .then(dataUrl => {
                var fileData = this.dataURLtoFile(dataUrl, item.ev_img);
                form.ev_img = fileData;
                form.imgView(fileData);
            })
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
        //사용자의 모든 이벤트 정보 요청
        getAllEvents(){
            this.$http.get('/api/member/get_events').then(res => {
                if(res.data.code === 1){
                    this.events = res.data.item;
                }else if(res.data.code === 2){
                    alert('로그인이 안되있거나, 세션이 만료되었습니다. 로그인 해주세요.');
                    this.$router.push('/');
                }else{
                    alert('행사 정보를 불러오지 못했습니다.');
                    this.$router.push('/')
                }
            }).catch(err => {
                alert('행사 정보를 불러오지 못했습니다.');
                this.$router.push('/');
            })
        },
        //행사 기간 포맷 
        formateDate(start, end){
            return this.getDate(start) + '~' + this.getDate(end);
        },
        //받은 문자열로 date 생성후 년/월/일을 추출 해서 문자열로 리턴
        getDate(date){
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
        },
        //행사 삭제 요청
        deleteEvent(num, i){
            this.$http.post('/api/event/delete_event', {num : num}).then(res => {
                if(res.data.code === 1){
                    this.events.splice(i, 1);
                }else if(res.data.code === 2){
                    alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
                    this.$router.push('/');
                }else{
                    alert('삭제에 실패하였습니다.');
                }
            }).catch(err => {
                alert('삭제에 실패하였습니다.');
            })
        }
    },
    mounted(){
        this.getAllEvents();
    },
    components:{
        InputForm
    }
}
</script>

<style scoped>
@import '../../css/member/event.css';
</style>

