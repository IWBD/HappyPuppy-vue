<template>
    <div class="contents_base">
        <div v-if="!not" id="content">
            <div class="none_data">
                좋아요를 표시한 영상이 없습니다.
            </div>
        </div>
        <div v-else id="content" style="background-color:#F8F3F2">
            <Medias
            v-bind:medias="medias"
            v-bind:mb_cols="mb_cols"/>
        </div>
    </div>
</template>

<script>
import Medias from "./Medias";
export default {
    pops:['mb_cols'],
    components:{Medias,},
    data: () => ({
        medias:null,
        not:true,
    }),
    methods:{
        setMyGoodMeidas(result){
            if(!result || !result.length){
                this.not = false;
                return;
            }
            this.medias = result;
        },
        getMyGoodMedias(){
            this.$http.get('/api/media/get_good_mymedias').then(res => {
                if(res.data.code === 1){
                    this.setMyGoodMeidas(res.data.result);
                    return
                }else if(res.data.code === 2){
                    alert('로그인이 되지 않았거나, 세션이 만료되었습니다. 다시 로그인 해주세요.');
                }else{
                    alert('좋아요 정보를 가져오는데 문제가 발생했습니다.');
                }
                this.$emit('goback', true);
            }).catch(err => {
                console.log(err);
                alert('좋아요 정보를 가져오는데 문제가 발생했습니다.');
                this.goback();
            })
        },
        goback(){
            this.$emit('goback', true);
        }
    },
    created(){
        this.getMyGoodMedias();
    },
}
</script>