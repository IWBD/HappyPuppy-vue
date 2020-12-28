<template>
    <v-container fluid class="pa-0" style="height:100%;">
        <div id="member_page">
            <div style="padding-bottom:10px;">
                <v-btn color="primary" @click="openInsertForm">전단지 등록</v-btn>
            </div>
            <v-divider></v-divider>
            <v-card tile  v-if="ext_none">
                <v-list>
                    <v-list-group :value="false" v-for="(bar, i) in abandoneds" :key="i">
                        <template v-slot:activator>
                            <v-list-item-title v-text="bar.ad_name" class="font-weight-bold"></v-list-item-title>
                        </template>
                        <div class="content">
                            <v-layout wrap>
                                <v-col cols="12" style="color:black; overflow:auto;">
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th >
                                                        제목
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ bar.ad_title }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                    <v-divider></v-divider>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th >
                                                        이름
                                                    </th>
                                                    <th >
                                                        연락번호
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ bar.ad_name }}</td>
                                                    <td>{{ bar.ad_pone }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                    <v-divider></v-divider>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        사례금
                                                    </th>
                                                    <th>
                                                        날짜
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td v-text="!!bar.ad_honorarium ? bar.ad_honorarium : '없음' "></td>
                                                    <td>{{ bar.ad_date }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                    <v-divider></v-divider>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        장소
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ bar.ad_place }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                    <v-divider></v-divider>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        내용
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ bar.ad_detail }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-col>
                                <v-col cols="12" style="position:relative; text-align:center;">
                                    <v-btn tile elevation="0" dark color="green" @click="openPoster(bar.poster_img)">보기</v-btn>
                                    <v-btn tile elevation="0" dark color="primary" @click="openUpdateForm(bar)">수정</v-btn>
                                    <v-btn tile elevation="0" dark color="red" @click="deletePoster(bar, i)">삭제</v-btn>
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
        <v-dialog  v-model="poster_dialog" tile fullscreen>
            <v-card tile elevation="0"  align="center" style="background-color:gray; overflow-x:auto;">
                <div class="py-4" style="width:auto;">
                    <v-card elevation="0" tile width="420px" height="650px" style="overflow:auto; background-color:gray;">
                        <Poster
                            ref="poster"
                            :poster="poster_img"
                            :poster_name="poster_name"
                            @child="poster_dialog = false"/>
                    </v-card>
                </div>
                <v-card-actions color="white" class="d-flex justify-center">
                    <v-btn color="#F44336" dark tile elevation="0"
                        @click="pdfDownload" class="ma-1" width="81">
                        PDF
                    </v-btn>
                    <v-btn class="ma-1" width="81" color="primary"
                        tile elevation="0" @click="poster_dialog = false">
                        close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog 
            ref="dia"
            v-model="update_form" fullscreen
             eager>
            <v-card tile elevation="0" align="center" color="white">
                <v-toolbar dark color="primary">
                    <v-toolbar-title v-text="!toolbar_item ? '전단지 수정' : '전단지 등록'"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark fab @click="stepToBack">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <div style="width:90%; max-width:1500px;">
                    <div style="padding:5% 0%;" >
                        <UpdateForm ref="update_form"/>
                    </div>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="loading_dialog"
            hide-overlay
            persistent
            width="300"
            >
            <v-card color="primary" dark>
                <v-card-text>
                이미지 삽입중입니다. 잠시만 기다려주세요.
                <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                ></v-progress-linear>
                </v-card-text>
            </v-card>
            </v-dialog>
    </v-container>
</template>

<script>
import Poster from "../../components/abandoneddog/Poster";
import UpdateForm from "../../components/abandoneddog/AbandonedDog_input";
import { mapMutations, mapGetters } from 'vuex';
const name = 'member'
export default {
    data: () => ({
        abandoneds:[],
        poster_dialog:null,
        poster_name:null,
        poster_img:null,
        form:null,
        honorarium:null,
        main_img_url:null,
        sb_img_urls:null,
        update_form:false,
        ext_none:1,
        toolbar_item:0,
        update_num:0,
        loading_dialog:false,
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
        abandoneds: function(hook){
            this.ext_none = hook.length > 0 ? true : false;
        },
    },
    methods:{
        //반려견 poster 정보 요청
        getAllAbandoned(){
            this.$http.get('/api/member/get_abandoned').then(res => {
                if(res.data.code === 1){
                    this.abandoneds = res.data.item;
                }else if(res.data.code === 2){
                    alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
                    this.$router.push('/');
                }else{
                    alert('반려견 정보를 불러오지 못했습니다.');
                    this.$router.push('/')
                }
            }).catch(err => {
                alert('반려견 정보를 불러오지 못했습니다.');
                this.$router.push('/');
            })
        },
        //form 객체 리턴
        getForm(data){
            const form = {
                ad_title : data.ad_title,
                ad_name : data.ad_name,
                ad_date : data.ad_date,
                ad_place : data.ad_place,
                ad_pone : data.ad_pone,
                ad_date : data.ad_date,
                ad_detail : data.ad_detail,
            };
            return form;
        },
        //사례금 정보 리턴
        getHonorarium(data){
            return data ? {bl:true, hr:data} : {bl:false, hr:null};
        },
        //poster 하단 이미지 url 리턴
        getSubImgs(data){
            const sb_imgs = JSON.parse(data);
            Object.keys(sb_imgs).forEach(f => {
                sb_imgs[f] = '/api/img/get_img/abandoned/' + sb_imgs[f];
            })
            return sb_imgs;
        },
        //base64 전단지 이미지 요청, 전단지 open
        openPoster(poster){
            this.$http.get(`/api/img/rpb/${poster}`).then(res => {
                if(!!res.data.message){
                    this.poster_img = res.data.result;
                    this.poster_name = poster;
                    this.poster_dialog = true;
                }else{
                alert('PDF 준비중에 문제가 발생했습니다.');        
                }
                return
            }).catch(err => {
                console.log(err);
                alert('PDF 준비중에 문제가 발생했습니다.');
            })
        },
        //head, body의 스크롤 제거
        //포스터 캡쳐에서 좌표값에 문제가 생길수 있기 때문
        createScrollNone(){
            const style = `body{-ms-overflow-style:none; } body::-webkit-scrollbar { display:none; }`
            const sheet = document.createElement('style');
            sheet.type="text/css";
            sheet.innerText = style;
            sheet.setAttribute("name", "scrollnone");
            document.head.appendChild(sheet);
        },
        //head, body 스크롤 복구
        deleteScrollNone(){
            const sn = document.getElementsByName("scrollnone");
            for(let i = 0; i<sn.length; i++){
                document.head.removeChild(sn[i]);
            }
        },
        //폼을 초기화하고 form open
        openInsertForm(){
            this.createScrollNone();
            this.toolbar_item = 1;
            const form = this.$refs.update_form;
            form.alert_key = false;
            form.update = null;
            form.ad_title = null;
            form.ad_name = null;
            form.ad_date = new Date().toISOString().substr(0, 10);
            form.ad_place = null;
            form.ad_pone = null;
            form.ad_detail = null;
            form.ad_honorarium = null;
            form.ad_swich = false;
            form.e1 = 1; 
            form.calender = false; 
            form.formHasErrors = false;
            form.main_img_dialog = false;
            form.main_img = null;
            form.main_img_url = '';
            form.sb_img_dialog = false;
            form.sb_img_urls =[null, null, null];
            form.select_idx = null;
            form.sb_img = null;
            form.sb_imgs =[];
            form.poster_data = null;
            form.poster = null;
            form.poster_file = null;
            form.loading = false;
            form.alert = false;
            form.alert_massage = null;
            form.$refs.main_img_btn.style.display = 'block';
            for(let i = 0; i<3; i++){
                document.getElementById('sb_img'+i).style.display = 'block';
            }
            this.update_form = true;
            setTimeout(()=>{
                form.alert_key = true;
            },1000)
        },
        //기존 정보들을 삽입 후 form open
        openUpdateForm(bar){
            this.createScrollNone();
            this.loading_dialog = true;
            this.toolbar_item = 0;
            this.update_num = bar.num;
            const form = this.$refs.update_form,
            sb_imgs = JSON.parse(bar.sb_imgs);
            form.alert_key = false;
            form.update = {
                num : bar.num,
                main_key : bar.main_img,
                sb_keys : sb_imgs,
                poster_key  : bar.poster_img,
                email : bar.email,
            };

            const {getImgBlod, getForm} = this;
            const my_form = getForm(bar);

            form.ad_swich = !!bar.ad_honorarium ?  true : false;
            form.ad_honorarium = bar.ad_honorarium;

            Object.keys(my_form).forEach(f=>{
                form[f] = my_form[f];
            })

            getImgBlod(bar.main_img, form, 'main_img');

            Object.keys(sb_imgs).forEach(f=>{
                getImgBlod(sb_imgs[f], form, f);
            })
        },
        //수정할 이미지들을 파일 및 문자열 변환
        //html2canvas 라이브러리가 문자열이 아니면 캡쳐하지않기 때문
        getImgBlod(item, target, k){
            let url = '/api/img/get_img/abandoned/' + item;

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
                var fileData = this.dataURLtoFile(dataUrl, item);
                if(!k.indexOf('sb')){
                    const i = Number(k.split('sb')[1]);
                    target.subImgClick(i, true);
                    target.sb_imgs[i] = fileData;
                    target.subImgInput(fileData);
                }else{
                    target.main_img = fileData;
                    target.mainImgInput(fileData);
                }
                if(++this.update_num >= 3){
                    this.update_num = 0;
                    this.loading_dialog = false;
                    this.update_form = true;
                }
            })
        },
        //문자열 파일 전환
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        },
        //폼 첫번째 단계로 이동
        stepToBack(){
            this.update_form = false;
            this.$refs.update_form.e1 = 1;
            this.deleteScrollNone();
        },
        //전단지 삭제
        deletePoster(bar, idx){
            const params = {
                num : bar.num,
                main_key : bar.main_img,
                sb_keys : bar.sb_imgs,
                poster_key : bar.poster_key
            }
            this.$http.post('api/abandoned/delete_poster', params).then(res => {
                if(res.data.code === 1){
                    this.abandoneds.splice(idx, 1);
                }else if(res.data.code === 2){
                    alert('장시간 동작이 없어 세션이 만료되었습니다. 다시 로그인 해주세요.');
                    this.$router.push('/');
                }else{
                    alert('삭제 과정에서 문제가 발생했습니다.');
                }
            }).catch(err => {
                console.log(err);
                alert('삭제 과정에서 문제가 발생했습니다.');
            })
        },
        pdfDownload(){
            this.$refs.poster.createPDF();
        }
    },
    mounted(){
        this.getAllAbandoned();
    },
    components:{
        Poster, UpdateForm
    }
}
</script>

<style scoped>
    @import '../../css/member/abandoned.css';
</style>

