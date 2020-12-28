<template>
    <div class="contents_base">
            <div id="content" style="background-color:#F8F3F2" >
                
                <div v-if="!!channels">
                    <v-layout wrap>
                        <v-col cols="12">
                            <h3>채널</h3>
                        </v-col>
                    </v-layout>
                    <v-divider></v-divider>
                    <v-col cols="12"  class='d-flex justify-center'
                        v-for="(bar, i) in channels" :key="i">
                        <v-layout wrap style="max-width:1000px;" v-resize="channelResize">
                            <v-col cols="4" sm="2" ref="channel_area" class='d-flex justify-center'>
                                <v-avatar :size="img_size"> 
                                    <v-img :src="!bar.img ? '' : '/api/img/get_img/member/' + bar.img" class="profile_color">
                                        <v-icon v-if="!bar.img" :size="icon_size">mdi-dog</v-icon>
                                    </v-img>
                                </v-avatar>
                            </v-col>
                            <v-col cols="8" sm="4" class="d-flex align-center">
                                <div>
                                    <h4>
                                        {{!bar.nickname ? bar.email : bar.nickname}}
                                    </h4>
                                    <div v-text="'구독 ' + bar.script_count + '명'"></div>
                                </div>
                            </v-col>
                        </v-layout>
                    </v-col>
                    <v-divider></v-divider>
                </div>
                <div v-if="!!medias">
                    <v-layout wrap>
                        <v-col cols="12">
                            <h3>영상</h3>
                        </v-col>
                    </v-layout>
                    <v-divider></v-divider>
                    <Medias
                    v-bind:medias="medias"
                    v-bind:mb_cols="mb_cols"
                    @child="changeScripts"/>
                </div>
                <div v-if="rs_none" ref="rs_none" class="text-center pa-12" >
                    검색 결과가 없습니다.
                </div>
            </div>
    </div>
</template>

<script>
import Medias from "./Medias";
export default {
    props:['medias', 'channels', 'mb_cols', 'rs_none'],
    components:{Medias},
    data: () => ({
        profile : {
            img:null,
        },
        img_width:null,
        img_size:null,
        window_width:null,
        // rs_none:false,
    }),
    methods: {
        changeScripts(data, script){
            const {my_scripts} = this;
            console.log(data);
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
        channelResize(){
            this.window_width = window.innerWidth;
        },
        setImgWidth(hook){
            const channel_area = this.$refs.channel_area;
            if(!channel_area){
                setTimeout(() => {
                    this.setImgWidth();
                },200)
            }else{
                const hook = channel_area[0].offsetWidth;
                this.img_width = hook
                this.img_size = hook * 0.72;
                this.icon_size = hook * 0.5;
            }
        }
    },
    watch:{
        window_width : function(){
            this.setImgWidth();
        },
        
    }
}
</script>