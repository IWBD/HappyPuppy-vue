<template>
    <div class="contents_base">
        <div id="content">
            <div v-if="!not" class="none_data" style="background-color:#F8F3F2">
                구독하신 채널이 없습니다.
            </div>
            <div v-else>
                <tabs v-model="sc_tab">
                    <div class="pl-2">
                        <v-btn text color="primary" v-text="!sc_tab ? '구독자 보기' : '영상들 보기'"
                        @click="sc_tab= !sc_tab ? 1 : 0">구독자 보기
                        </v-btn>
                    </div>
                </tabs>
                <v-tabs-items v-model="sc_tab">
                    <v-tab-item class="color_grey">
                        <Medias
                        v-bind:mb_cols="mb_cols"
                        v-bind:medias="medias"
                        @child="changeScripts"
                        @think="resetThink"/>
                    </v-tab-item>
                    <v-tab-item class="color_grey">
                        <v-list :width="menu_width">
                        <v-list-item-group v-model="ch" color="primary" mandatory>
                            <v-list-item @click="change_medias('all')">전체
                            </v-list-item>
                            <v-list-item v-for="(bar, i) in my_scripts" :key="i"
                                @click="change_medias(bar.email)">
                                <v-avatar  size="40" class="pr-1"> 
                                    <img :src="'/api/img/get_img/member/' + bar.p_img">
                                </v-avatar>
                                <v-avatar v-if="delete_ready[i]" size="5" style="background-color:red;" > 
                                </v-avatar>
                                <div v-text="!bar.nickname ? bar.email : bar.nickname"></div>
                                <v-spacer></v-spacer>
                                <v-btn text @click="showChannel(bar.email)" color="primary">채널가기</v-btn>
                            </v-list-item>
                        </v-list-item-group>
                        </v-list>
                    </v-tab-item>   
                </v-tabs-items>
            </div>
        </div>
    </div>
</template>



<script>
import Medias from "./Medias";
import { mapMutations, mapGetters } from 'vuex';
const name = 'media'
export default {
    props:['my_scripts', 'mb_cols'],
    components:{Medias},
    data: () => ({
        medias:null,
        value: 1,
        medias_bucket:{},
        sc_tab:null,
        ch:null,
        channels:[],
        not:true,
        medias_key:null,
        delete_ready:[],
    }),
    computed:{
        ...mapGetters(name, {
            store_sc: 'GET_SC'
        }),
    },
    methods:{
        ...mapMutations(name, ['MU_SC_SC', 'MU_SC_CH', 'MU_OPEN_EMAIL']),
        storeSCchange(num){
            this.MU_SC_SC(num);
        },
        storeCHchange(num){
            this.MU_SC_CH(num);
        },
        showChannel(email){
            this.MU_OPEN_EMAIL(email);
            this.$router.push('/education/channel/' + email);
        },
        resetThink(data){
            this.medias_bucket[data.media.email].splice(data.index, 1, data.media);
            const medias = this.medias_bucket['all'];
            let idx = null;
            for(let i = 0; i < medias.length; i++){
                if(medias[i].num === data.media.num){
                    idx = i
                    break;
                }
            }
            this.medias_bucket['all'].splice(idx, 1, data.media);
        },
        changeScripts(data, script){
            const {my_scripts} = this;
            let idx = null;
            for(let i = 0; i < my_scripts.length; i++){
                if(my_scripts[i].email === data.email){
                    idx = i;
                    break;
                }
            }
            this.delete_ready.splice(idx, 1, !script);
            data.key = 'resetScripts';
            data.script = script;
            this.$emit('child', data);
        },
        change_medias(key){
            this.medias = this.medias_bucket[key];
            this.medias_key = key;
            this.sc_tab  = 0;
        },
        setMedias(result){
            this.medias = result.all;
            this.medias_key = 'all';
            Object.keys(result).forEach(f => {
                this.medias_bucket[f] = result[f];
            })
        },
        getMyScriptMedias(){
            if(!this.my_scripts){
                this.not = false;
                return;
            }
            this.$http.post('/api/media/get_script_medias', {list:this.my_scripts}).then(res => {
                const code = res.data.code;
                if(code === 2){
                    alert('로그인이 되지 않았거나, 세션이 만료되었습니다. 다시 로그인 해주세요.');
                }else if(!code){
                    alert('구독자 정보를 가져오는데 문제가 발생했습니다.');
                }else{
                    if(!res.data.result){
                        this.not = false;
                    }else{
                        this.sc_tab = this.store_sc.sc;
                        this.ch = this.store_sc.ch;
                        this.setMedias(res.data.result);
                    }
                    return;
                }
                this.goback();
            }).catch(err => {
                alert('구독자 정보를 가져오는데 문제가 발생했습니다.');
                this.goback();
                console.log(err);
            })
        },
        goback(){
            this.$emit('goback', true);
        },
    },
    watch:{
        sc_tab : function(hook){
            this.storeSCchange(hook);
        },
        ch : function(hook){
            this.storeCHchange(hook);
        }
    },
    
}
</script>

<style scoped>
.color_grey{
    background-color:#F8F3F2;
}
</style>