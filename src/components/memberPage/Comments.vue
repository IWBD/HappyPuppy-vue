<template>
    <div class="main" ref="main">
        <v-col cols="12">
            <v-btn tile color="red" dark @click="deleteReq" class="mr-2">삭제</v-btn>
            <v-btn tile color="success" dark @click="checkReset">리셋</v-btn>
        </v-col>
        <v-expansion-panels
            v-model="panel"
            multiple
            class="panel"
        > 
            <v-expansion-panel v-for="(bar,i) in comments" :key="i">
                <v-expansion-panel-header class="font-weight-bold" >
                    <div>
                        {{bar.title}}
                    </div>
                    <div style="text-align:end;">
                        {{'댓글 ' + bar.comments.length}}
                    </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content >
                    <v-layout wrap v-for="(item, idx) in bar.comments" :key="idx" class="pa-0" >
                        <v-layout wrap  class="comments_area">
                            <v-col cols="10" class="pa-0 d-flex justify-start">
                                <v-list-item-avatar  class="mr-1 profile_img40">
                                    <v-img :src="!item.comment.img ? '' : '/api/img/get_img/member/' + item.comment.img" 
                                    class="profile_back">
                                        <v-icon v-if="!item.comment.img" size="30">mdi-dog</v-icon>
                                    </v-img>
                                </v-list-item-avatar>
                                <div class="comment d-flex align-center">
                                    <div>
                                        <div>
                                            {{!item.comment.nickname ? item.comment.email : item.comment.nickname}}
                                        </div>
                                        <div>
                                            {{getDate(item.comment.date)}}
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="2" class="pa-0 d-flex justify-end">
                                <v-checkbox :ref="item.comment.num"  @change="getCheckId(item.comment.num, item.in_comments)"></v-checkbox>
                            </v-col>
                        </v-layout>
                        <v-card width="100%" title elevation="0">
                            <v-textarea 
                                v-model="item.comment.comment"
                                class="comment"
                                dence auto-grow rows="1" dense
                                row-height="5"
                                :label="!item.comment.reply ? null : !item.comment.nickname ? '@' + item.comment.reply : '@'+ item.comment.nickname"
                                readonly
                                hide-details
                            ></v-textarea>
                            <div class="good_bad d-flex align-center">
                                <v-icon>mdi-thumb-up-outline</v-icon>
                                {{item.comment.good}}
                                <v-icon class="pl-2">mdi-thumb-down-outline</v-icon>
                                {{item.comment.bad}}
                            </div>
                        </v-card>
                        <v-list class="comments_area" dense v-if="item.in_comments.length">
                            <v-card tile >
                                <v-list-group :value="false" class="py-1 px-0" eager :ref="'btn'+item.comment.num">
                                    <template v-slot:activator >
                                        <v-list-item-title >댓글 {{item.in_comments.length}}</v-list-item-title>
                                    </template>
                                    <v-list-item  class="py-1 px-0" 
                                        v-for="(item, index) in item.in_comments" :key="index">
                                        <v-layout wrap class="in_comment_area">
                                            <v-layout wrap  class="comments_area">
                                                <v-col cols="10" class="pa-0 d-flex justify-start">         
                                                    <v-list-item-avatar  class="mr-1 profile_img40">
                                                        <v-img :src="!item.img ? '' : '/api/img/get_img/member/' + item.img" 
                                                        class="profile_back">
                                                            <v-icon v-if="!item.img" size="30">mdi-dog</v-icon>
                                                        </v-img>
                                                    </v-list-item-avatar>
                                                    <div class="comment d-flex align-center">
                                                        <div>
                                                            <div>
                                                                {{!item.nickname ? item.email : item.nickname}}
                                                            </div>
                                                            <div>
                                                                {{getDate(item.date)}}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </v-col>
                                                <v-col cols="2" class="pa-0 d-flex justify-end">
                                                    <v-checkbox :ref="item.num"   @change="getCheckId(item.num)"></v-checkbox>
                                                </v-col>
                                            </v-layout>
                                            <v-card width="100%" title elevation="0">
                                                <v-textarea 
                                                    v-model="item.comment"
                                                    class="comment"
                                                    dence auto-grow rows="1" dense
                                                    row-height="5"
                                                    :label="!item.reply ? null : !item.nickname ? '@' + item.reply : '@'+ item.nickname"
                                                    readonly
                                                    hide-details
                                                ></v-textarea>
                                                <div class="good_bad d-flex align-center">
                                                    <v-icon>mdi-thumb-up-outline</v-icon>
                                                    {{item.good}}
                                                    <v-icon class="pl-2">mdi-thumb-down-outline</v-icon>
                                                    {{item.bad}}
                                                </div>
                                            </v-card>
                                        </v-layout>
                                    </v-list-item>
                                </v-list-group>
                            </v-card>
                        </v-list>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-dialog
          v-model="load_dialog"
          hide-overlay
          persistent
          width="300"
        >
        <v-card color="primary" dark>
          <v-card-text>
            잠시만 기다려 주세요...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
</template>
<script>
export default {
    props:['comments'],
    data:() => ({
        panel:[],
        offset_height:null,
        settings:[],
        delete_comments:[],
    }),
    methods:{
        deleteReq(){
            console.log(this.delete_comments)
            if(this.delete_comments.length > 0){
                if(confirm(`총 ${this.delete_comments.length}개의 댓글을 삭제 하시겠습니까?`) == true){
                    this.load_dialog = true;
                    this.$http.post('/api/media/drop_comments', {num:this.delete_comments}).then(res => {
                        if(res.data.code === 1){
                            alert('삭제가 완료 되었습니다.');
                            this.checkReset();
                            this.$emit('child');
                            return;
                        }else if(res.data.code === 2){
                            alert('장시간 동작이 없어 로그아웃되었습니다. 다시 로그인 해주세요.');
                        }else{
                            alert('삭제 과정에서 문제가 발생했습니다.')
                        }
                        this.$router.push('/');
                    }).catch(err => {
                        alert('삭제 과정에서 문제가 발생했습니다.');
                        console.log(err);
                        this.$router.push('/');
                    }).finally(()=>{ 
                        this.load_dialog = false;
                    })
                }else{
                    return ;
                }
            }else{
                alert('선택된 댓글이 없습니다.');
            }
        }, 
        spliceDeleteComments(id){
            for(let i = 0; i < this.delete_comments.length; i++){
                if(id === this.delete_comments[i]){
                    this.delete_comments.splice(i, 1);
                    break;
                }
            }
        },
        pushDeleteComments(id){
            let bl = true;
            for(let i = 0; i < this.delete_comments.length; i++){
                if(id === this.delete_comments[i]){
                    bl = false;
                    break;
                }
            }
            if(bl){
                this.delete_comments.push(id);
            }
        },
        getCheckId(id, arr){
            this.$refs[id][0].value = !this.$refs[id][0].value;
            let bl = this.$refs[id][0].value;
            if(bl){
                this.pushDeleteComments(id);
            }else{
                this.spliceDeleteComments(id);
            }
            if(!!arr){
                for(let i = 0; i<arr.length; i++){
                    this.$refs[arr[i].num][0].value = bl;
                    this.$refs[arr[i].num][0].disabled = bl;
                    if(bl){
                        this.pushDeleteComments(arr[i].num);
                    }else{
                        this.spliceDeleteComments(arr[i].num);
                    }
                }
            }
        },
        checkReset(){
            const arr = this.delete_comments;
            for(let i = 0; i < arr.length; i++){
                this.$refs[arr[i]][0].value = false;
                this.$refs[arr[i]][0].disabled = false;
            }
            this.delete_comments = [];
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
        },
    },
}
</script>

<style scoped>
@import '../../css/member/comments.css';
</style>