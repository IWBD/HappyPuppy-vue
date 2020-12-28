<template>
    <div style="max-width:1200px; margin:0 auto;">
        <v-col cols="12" class="pa-2">
            <v-btn tile color="primary"  @click="openUploadForm(false)">영상 업로드</v-btn>
        </v-col>
        <div style="width:100%;">
            <v-divider></v-divider>
        </div>
        <v-layout  wrap v-for="(bar, i) in medias" :key="i">
            <v-col class="pa-1"  cols="12">
                <v-layout wrap>
                    <v-col class="pa-1" cols="12" sm="6" md="6" lg="3">
                        <v-responsive :aspect-ratio="16/9" style="background-color:white">
                            <v-img :aspect-ratio="16/9" :src="`/api/img/get_thumbnail/media/${bar.img}`">
                            </v-img>
                        </v-responsive>
                    </v-col>
                    <v-col class="pa-1" cols="12" sm="6" md="6" lg="3">
                        <v-responsive :aspect-ratio="16/9">
                            <video style="width:100%; height:100%" 
                                controls preload="none"
                                playsinline
                                :src="`/api/media/get_video/'${bar.video}`">
                            </video>
                        </v-responsive> 
                    </v-col>
                    <v-col class="pa-1" cols="12" sm="12" md="12" lg="6">
                        <v-layout wrap>
                            <v-col cols="12" sm="12" md="10" >
                                <h4 v-text="bar.title"></h4>
                                <h4 v-text="'날짜 ' + formatDate(bar.date)"></h4>
                                <h4 v-text="'조회수 ' + bar.count + '회'"></h4>
                                <h4 v-text="'좋아요 '+ bar.good"></h4>
                                <h4 v-text="'싫어요 '+ bar.bad"></h4>
                            </v-col>
                            <v-col cols="12" sm="12" md="2" class="pa-1 text-center">
                                <v-btn elevation="0" tile dark color="green"
                                    @click="openUploadForm(true, bar)">
                                    수정
                                </v-btn>
                                <v-btn elevation="0" tile dark color="red" @click="deleteMedia(bar)">
                                    삭제
                                </v-btn>
                            </v-col>
                        </v-layout>
                    </v-col>
                </v-layout>
            </v-col>
            <div style="width:100%;">
                <v-divider></v-divider>
            </div>
        </v-layout>
        <div class="none_data" v-if="!medias">
            업로드된 영상이 없습니다.
        </div>
        <InputMedia
        ref="add"
        v-bind:update="update"
        v-bind:media_num="media_num"
        @child="childColl"
        />
    </div>
</template>

<script>
import InputMedia from "../media/InputMedia";
export default {
    props:['medias'],
    components:{InputMedia},
    data:() => ({
        update_title : ['썸네일', '영상', '제목', '간략한 설명', '테그', '카테고리', '영상 설명'],
        includeFiles: true,
        enabled: [false, false, false, false, false],
        createbox_item : ['title', 'content', 'tag', 'category', 'comments'],
        checkbox_item : null, 
        update : false,
        media_keys : null,
        media_num : null
    }),
    methods: {
        childColl(){
            this.$emit('child');
        },
        deleteMedia(media){
            this.$http.post('/api/media/drop_media', {num:media.num}).then(res => {
                if(res.data.code === 1){
                    alert('영상 삭제가 완료되었습니다.');
                    this.$emit('child');
                }else if(!!res.data.code){
                    alert('장시간 동작이 없어 세션이 만료됐습니다. 로그인 해주세요.');
                    this.$router.push('/');
                    return;
                }else{
                    alert('삭제 동작중에 문제가 발생했습니다.')
                }
                this.$router.go();
            }).catch(err => {
                console.log(err);
                alert('삭제 동작중에 문제가 발생했습니다.');
                this.$router.push('/');
            })
        },
        openUploadForm(update, media){
            console.log(media);
            this.update = update;
            const add = this.$refs.add;
            if(update){
                const items = this.createbox_item;
                for(let i = 0; i < items.length; i++){
                    add[items[i]] = media[items[i]];
                }
                this.media_num = media.num;
            }else{
                this.media_num = null;
            }
            add.viewheight();
            add.dialog = true;
        },
        formatDate(date){
            date = new Date(date);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; 
        },
        getThinkCount(good, bad){
            return `좋아요 ${good}개 싫어요${bad}개`;
        },
    },
}
</script>

<style scoped>

</style>
