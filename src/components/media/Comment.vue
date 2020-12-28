<template>
    <v-col cols="12" ref="area" :class="mb_cols" >
        <div v-for="(bar, i) in comments" :key="i">
            <v-divider class="mb-2"></v-divider>
            <v-layout wrap>
                <v-card width="50px" title color="#F5F5F5" elevation="0">
                    <div class="d-flex justify-center">
                        <v-list-item-avatar  class="ma-0 profile_img40">
                            <v-img :src="!bar.img ? '' : '/api/img/get_img/member/' + bar.img" 
                            style="background-color:#A9E2F3">
                                <v-icon v-if="!bar.img" size="30">mdi-dog</v-icon>
                            </v-img>
                        </v-list-item-avatar>
                    </div>
                </v-card>
                <v-card :width="offset_width - 100" title color="#F5F5F5" elevation="0">
                    <div class="comment">
                        {{!bar.nickname ? bar.email + '/' + getDate(bar.date) : bar.nickname + '/' + getDate(bar.date)}}
                    </div>
                    <v-textarea 
                        v-model="bar.comment"
                        class="comment"
                        dence auto-grow rows="1" dense
                        row-height="5"
                        :label="!bar.reply ? null : !bar.nickname ? '@' + bar.reply : '@'+ bar.nickname"
                        readonly
                        hide-details
                    ></v-textarea>
                    <div style="margin:5px 0;" class="comment_btns">
                        <v-btn tile icon color="#F5F5F5" outlined
                            @click="myCommentsThink(1, bar.num, i, setCommentsThink)">
                            <v-icon color="#BDBDBD">mdi-thumb-up-outline</v-icon>
                        </v-btn>
                        {{!bar.good ? '0' : bar.good }}
                        <v-btn tile icon color="#F5F5F5" outlined
                            @click="myCommentsThink(0, bar.num, i, setCommentsThink)">
                            <v-icon color="#BDBDBD">mdi-thumb-down-outline</v-icon>
                        </v-btn>
                        {{!bar.bad ? '0' : bar.bad }}
                        <v-menu offset-y>
                            <template v-slot:activator="{ attrs, on }">
                               <v-btn icon 
                               v-bind="attrs"
                                v-on="on">
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                            </template>
                            <v-list dense>
                                <v-list-item dence link @click="openCommentFild(true, i)">
                                    <v-list-item-title v-text="'댓글'"></v-list-item-title>
                                </v-list-item>
                                <v-list-item dence link :disabled="my_info.email !== bar.email"
                                    @click="deleteComment(i, bar.num, deleteCallback)" >
                                    <v-list-item-title 
                                        v-text="'삭제'"
                                        ></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <div class="comment_fild" ref="comment_fild" >
                            <InputComment
                                ref="input"
                                v-bind:my_info="my_info"
                                v-bind:num="bar.num"
                                v-bind:mb_cols="'pa-0'"
                                v-bind:offset_width="offset_width - 50"
                                v-bind:in_comment="i+1"
                                @parents="parentsClose"
                                @child="inInputComment"
                            />
                        </div>
                    </div>
                    <div style="width:100%" v-if="!!bar.c_comments && !!bar.c_comments.length">
                        <v-list width=100% dense color="#F5F5F5">
                            <v-list-group :value="false" class="py-1 px-0">
                                <template v-slot:activator>
                                    <v-list-item-title >댓글 {{bar.c_comments.length}}</v-list-item-title>
                                </template>
                                <v-list-item  class="py-1 px-0"
                                    v-for="(item, idx) in bar.c_comments" :key="idx">
                                    <CommentInComment
                                        v-bind:comment_idx="i"
                                        v-bind:this_idx="idx"
                                        v-bind:comments="item"
                                        v-bind:offset_width="offset_width - 150"
                                        @child="openInFild"
                                        @parents="commentInCommentThink"
                                        @cd="deleteChildComment"
                                    />
                                </v-list-item>
                            </v-list-group>
                        </v-list>
                    </div>
                </v-card>
            
            </v-layout>
        </div>
    </v-col>
</template>

<script>
import InputComment from "./InputComment";
import CommentInComment from "./CommentInComment";
export default {
  props:['comments', 'my_info', 'offset_width', 'fild_bls'],
  data: () => ({
    comment_width:null,
    reply:{},
  }),
  methods:{
    commentInCommentThink(data){
        this.myCommentsThink(data.think, data.num, data.comment_idx, 
        this.setCommentsInCommentsThink, data.this_idx);
    },
    setCommentsInCommentsThink(code, think, index, this_idx){
        const keys = !!think ? ['good', 'bad'] : ['bad', 'good'];
        const comments = this.comments;
        if(code === 1){
            comments[index].c_comments[this_idx][keys[0]] ++;
        }else if(code === 3){
            comments[index].c_comments[this_idx][keys[0]] --;
        }else if(code === 4){
            comments[index].c_comments[this_idx][keys[0]] ++;
            comments[index].c_comments[this_idx][keys[1]] --;
        }

    },
    deleteCallback(idx){
        this.comments.splice(idx, 1);
    },
    delectChildCallback(c_idx, this_idx){
        this.comments[c_idx].c_comments.splice(this.idx, 1);
    },
    deleteChildComment(data){
        this.deleteComment(data.comment_idx, data.num, this.delectChildCallback, data.this_idx);
    },
    deleteComment(idx, num, callback, this_idx){
        this.$http.post('/api/media/drop_comments', {num:num}).then(res => {
            if(res.data.code === 1){
                if(!this_idx){
                    callback(idx);
                }else{
                    callback(idx, this_idx);
                }
            }else{  
                alert('작성자 본인만 삭제할 수 있습니다.');
            }
        }).catch(err => {
            alert('삭제 과정에서 문제가 발생했습니다.');
            console.log(err);
        })
    },
    inInputComment(data){
        this.$emit('child', data);
    },
    onResize(){
        const {offsetWidth} = this.$refs.area;
        const width = offsetWidth > 1600 ? 1600 :offsetWidth;
        this.comment_width = offsetWidth - 95 + 'px';
    },
    parentsClose(data){
        this.openCommentFild(false, data-1);
    },  
    openCommentFild(bl, i, reply){
        const input = this.$refs.input[i];
        if(!!reply){
            let c = !reply.nickname ? '@' + reply.email + '에게 답글' : '@' + reply.nickname  + '에게 답글';
            input.label = c;
            input.reply = reply
        }else{
            input.label = '댓글 남기기';
            input.reply = reply;
        }
        this.fild_bls[i] = !bl;
        this.$refs.comment_fild[i].style.display = bl ? 'block' : 'none';
        this.$refs.input[i].$refs.comment.focus();
    },
    myCommentsThink(think, num, index, callback, this_idx){
        const url = `/api/media/my_comment_think/${num}/${think}`;
        this.$http.get(url).then(res => {
            if(!res.data.code){
                alert('댓글 좋아요 혹은 싫어요에 실패하였습니다.');
            }else if(res.data.code === 2){
                alert('로그인이 안돼있거나, 세션이 만료되었습니다. 로그인 해주세요.');
            }else{
                callback(res.data.code, think, index, this_idx);
            }
        }).catch(err => {
            alert('댓글 좋아요 혹은 싫어요에 실패하였습니다.');
            console.log(err);
        })
    },
    setCommentsThink(code, think, index){
        const k = !!think ? 'good' : 'bad';
        const keys = !!think ? ['good', 'bad'] : ['bad', 'good'];
        if(code === 1){
            this.comments[index][keys[0]] ++;
        }else if(code === 3){
            this.comments[index][keys[0]] --;
        }else if(code === 4){
            this.comments[index][keys[0]] ++;
            this.comments[index][keys[1]] --;
        }
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
    openInFild(data){
        this.openCommentFild(data.bl, data.i, data.reply);
    }
  },
  components:{
    InputComment, CommentInComment
  }
}
</script>


