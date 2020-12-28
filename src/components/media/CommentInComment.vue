<template>
    <v-layout wrap ref="area" >
        <v-card title width="50px" elevation="0" color="#F5F5F5" >
            <div class="d-flex justify-center">
                <v-list-item-avatar class="ma-0 profile_img30">
                    <v-img  style="background-color:#A9E2F3"
                     :src="!comments.img ? '' : '/api/img/get_img/member/' + comments.img">
                        <v-icon v-if="!comments.img" size="20">mdi-dog</v-icon>
                    </v-img>
                </v-list-item-avatar>
            </div>
        </v-card>
        <v-card :width="offset_width" title color="#F5F5F5" elevation="0">
            <div class="comment pb-1">
                {{!comments.nickname ? comments.email + '/' + getDate(comments.date) : comments.nickname + '/' + getDate(comments.date)}}
            </div>
            <v-textarea 
                v-model="comments.comment"
                class="comment"
                dence auto-grow rows="1" dense
                row-height="5"
                readonly
                :label="!comments.reply ? null : !comments.rn ? '@' + comments.reply : '@'+ comments.rn"
                hide-details
            ></v-textarea>
            <div style="margin:5px 0;" class="comment_btns">
                <v-btn tile icon color="#F5F5F5" outlined
                    @click="commentInCommentThink(1)">
                    <v-icon color="#BDBDBD" >mdi-thumb-up-outline</v-icon>
                </v-btn>
                {{comments.good}}
                <v-btn tile icon color="#F5F5F5" outlined
                    @click="commentInCommentThink(0)">
                    <v-icon color="#BDBDBD">mdi-thumb-down-outline</v-icon>
                </v-btn>
                {{comments.bad}}
                <v-menu offset-y>
                    <template v-slot:activator="{ attrs, on }">
                        <v-btn icon 
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-item dence link @click="openFild(true)">
                            <v-list-item-title   v-text="'답글'"></v-list-item-title>
                        </v-list-item>
                        <v-list-item dence link @click="deleteComment">
                            <v-list-item-title v-text="'삭제'"></v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-card>
    </v-layout>
</template>

<script>
import InputComment from "./InputComment";
export default {
    props:['comments', 'comment_idx', 'offset_width', 'this_idx'],
    data: () => ({
        open_fild:false,
        comment_width:null,
        resize:false,
        resize_tileout:false,
        offsetWidth:0,
    }),
    methods:{
        deleteComment(){
            const data = {
                comment_idx : this.comment_idx,
                this_idx : this.comment_idx,
                num : this.comments.num
            }
            this.$emit('cd', data);
        },
        openFild(bl){
            const data = {
                bl:bl, 
                i:this.comment_idx, 
                reply:{
                    nickname:this.comments.nickname, 
                    email:this.comments.email
                }
            };
            this.$emit('child', data);
        },
        commentInCommentThink(think){
            const data = {
                comment_idx : this.comment_idx,
                this_idx : this.this_idx,
                think : think,
                num : this.comments.num
            }
            this.$emit('parents', data);
        },
        getDate(item){
            const now_date = new Date();
            const date = new Date(item);
            const rs_item = {
                year : now_date.getFullYear() - date.getFullYear(),
                month : now_date.getMonth() - date.getMonth(),
                date : now_date.getDate() - date.getDate(),
            }
            if(rs_item.year > 0){
                return rs_item.year + '년 전';
            }
            if(rs_item.month > 0){
                return rs_item.month + '개월 전';
            }
            if(rs_item.date > 0){
                return rs_item.date + '일 전';
            }
            var time = (now_date.getTime() - date.getTime()) / 60000; //분
            if(time/60 >= 1){
                return Math.floor(time/60) + '시간 전';
            }
            if(time >= 1){
                return Math.floor(time) + '분 전';
            }
            return '방금 전';
        }
    },
    mounted(){
    },
    watch:{
    },
    created(){
        
    },
    updated(){
    },
    computed:{
    },
    components:{
        InputComment
    }
}
</script>

<style>
.img30{
    width:30px;
    height:30px;
}
</style>

