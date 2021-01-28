<template>
    <v-container fluid class="containner_area pa-0"  v-resize="onResize">
        <v-tabs style="height:100%;" v-model="tab" :vertical="vertical">
            <v-tab  v-for="(bar, i) in tab_title" :key="i" style="width:100px;">
                {{bar}}
            </v-tab>
            <v-tab-item>
                <v-card titl elevation="0" color="#F8F3F2" :min-height="tab_height">
                    <Medias
                        v-bind:medias="medias"
                        @child="getMedias"
                    />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card titl elevation="0" color="#F8F3F2" :min-height="tab_height">
                    <Comments
                        v-bind:comments="comments"
                        @child="getMedias"
                        />
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>

<script>
import Medias from "./Medias";
import Comments from "./Comments";
import { mapGetters } from 'vuex';
const name = 'member'
export default {
    data:() => ({
        tab:0,
        tab_title : ['영상', '영상 댓글'],
        layout_item : null,
        vertical: false,
        tab_height : null,
        medias: [],
        comments: [],
    }),
    components:{Medias, Comments },
    methods: {
        onResize(){
            const {innerWidth, innerHeight} = window;
            if(innerWidth > 959){
                this.vertical = true;
            }else if(innerWidth > 599){
                this.vertical = true;
            }else{
                this.vertical = false;
            }
            this.tab_height = `${innerHeight - 61}px`;
        },
        getMedias(){
            this.$http.get('/api/member/my_medias').then(res => {
                if(res.data.code === 1){
                    this.medias = res.data.result.medias.length > 0 ? 
                                  res.data.result.medias : null;
                    this.comments = res.data.result.comments.length> 0 ? 
                                    res.data.result.comments : null;
                    return
                }else if(res.data.code === 2){
                    alert('로그인이 되지않았거나, 세션이 만료되었습니다. 로그인 해주세요.');
                }else{
                    alert('미디어 정보를 가져오는 중 문제가 발생했습니다.');
                }
                this.$router.push('/');
            }).catch(err => {
                console.error(err);
                alert('미디어 정보를 가져오는 중 문제가 발생했습니다.');
                this.$router.push('/');
            })
        },
    },
    computed:{
        ...mapGetters(name, {
            login_info: 'GET_LOGIN_INFO'
        }),
    },
    watch: {
        login_info : function(hook){
            !!this.login_info.number || this.$router.push('/');
        }
    },
    created(){
        this.getMedias();
    },
}
</script>
