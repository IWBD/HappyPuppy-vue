<template>
    <v-col cols="12" ref="area" :class="mb_cols">
        <v-layout wrap>
            <v-card width="50px" title color="#F5F5F5" elevation="0">
                <div class="d-flex justify-center">
                    <v-list-item-avatar  class="ma-0 profile_img40">
                        <v-img :src="!my_info.img ? '' : '/api/img/get_img/member/' + my_info.img"  
                        style="background-color:#A9E2F3">
                            <v-icon v-if="!my_info.img" size="30">mdi-dog</v-icon>
                        </v-img>
                    </v-list-item-avatar>
                </div>
            </v-card>
            <v-card :width="offset_width - 100" title color="#F5F5F5" elevation="0">
            <v-textarea
                v-model="comment"
                class="comment"
                ref="comment"
                dence auto-grow rows="1" dense
                :label="label"
                counter="100"
                @focus="openBtn(true)"
            ></v-textarea>
            <div id="btns" ref="btns">
                <div class="d-flex justify-end" >
                    <v-btn tile v-if="in_comment" elevation="0" @click="parentsClose()">취소di</v-btn>
                    <v-btn tile v-else elevation="0" @click="openBtn(false)">취소</v-btn>
                    <v-btn tile elevation="0" color="blue" @click="inputComment(comment)" dark>댓글</v-btn>
                </div>
            </div>
            </v-card>
        </v-layout>
    </v-col>
</template>

<script>
export default {
  props:['num', 'mb_cols', 'in_comment', 'my_info', 'offset_width'],
  data: () => ({
    comment:null,
    comment_width:null,
    label:'댓글 남기기',
    reply:null,
  }),
  methods:{
    openBtn(bl){
        this.$refs.btns.style.display = bl ? "block" : 'none';
    },
    inputComment(comment){
        const data = {
            comment : comment,
            c_num : !this.num ? null : this.num,
            reply : !this.reply ? null : this.reply
        }
        !comment || comment.length > 100 || this.$emit('child', data);
        this.comment = null;
        this.parentsClose(false);
    },
    parentsClose(){
        this.$emit('parents', this.in_comment);
        this.comment = null;
    }
  },
}
</script>

<style scoped>
#btns{
    display: none;
}
</style>

