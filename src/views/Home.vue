<template> 
    <v-container fluid v-resize="onResize" style="padding:0px; height:100%;"> 
        <v-item-group v-model="window"  class="shrink h_in" v-if="lg"
            mandatory tag="v-flex" id="window_wrap h_in">
            <div id="item_groups">
                <v-item  v-for="n in length" :key="n" 
                v-slot:default="{ active, toggle }" ref="button">
                    <div>
                        <v-btn :input-value="active" icon @click="toggle">
                            <v-icon>mdi-record</v-icon>
                        </v-btn>
                    </div>
                </v-item>
            </div>
            <v-window  v-model="window" class="elevation-1 h_in"  vertical tile>
                <v-window-item class="h_in">
                    <v-img height="100%" :max-height="innerHeight" src="../images/main_large00.jpg"></v-img>
                </v-window-item>
                <v-window-item class="h_in" :max-height="innerHeight"  style="background-color:#E0F2F1"> 
                    <div class="h_in main_about d-flex align-center" >
                        <v-layout wrap >
                            <v-col cols="4" style="position:relative;">
                                <v-img height="450px" src="../images/event_dog.jpg" style="opacity:0.8; position:relative; top:-5%;" ></v-img>
                                <div class="main_abouts mata">
                                    <div class="about_img_text_area about_img_color1"></div>
                                    <div class="about_text_area about_text_wep">
                                        <div class="d-flex align-center" >
                                            <div style="width:100%; text-align:center; color:white;">
                                                <div>
                                                    <h1 class="about_title">애견 행사</h1>
                                                </div>
                                                <div class="about_content">
                                                        국내에 반려견과 반려인이 <br>
                                                        함께 참여 할 수 있는<br>
                                                        다양한 이벤트를 회원들과 <br>
                                                        공유하실 수 있습니다.
                                                </div>
                                                <v-btn dark rounded color="purple lighten-3"
                                                    @click="$router.push('/event')">
                                                    바로가기
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="4" style="position:relative;">
                                <v-img height="450px"  src="../images/media_dog.jpg" style="opacity:0.8; position:relative; top:5%;"></v-img>
                                <div class="main_abouts mati">
                                    <div class="about_img_text_area about_img_color2"></div>
                                    <div class="about_text_area about_text_wep">
                                        <div class="d-flex align-center" >
                                            <div style="width:100%; text-align:center; color:white;">
                                                <div>
                                                    <h1 class="about_title">미디어</h1>
                                                </div>
                                                <div class="about_content">
                                                    동영상 공유 플랫폼 서비스로 <br>
                                                    회원들과 정보를 공유 및<br>
                                                    커뮤니케이션을 제공합니다.<br>
                                                </div>
                                                <v-btn dark rounded color="blue lighten-3"
                                                    @click="$router.push('/education/home')">
                                                    바로가기
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="4" style="position:relative;">
                                <v-img height="450px"  src="../images/lost_dog.jpg" style="opacity:0.8; position:relative; top:-5%;"></v-img>
                                <div class="main_abouts mata">
                                    <div class="about_img_text_area about_img_color3"></div>
                                    <div class="about_text_area about_text_wep">
                                        <div class="d-flex align-center">
                                            <div style="width:100%; text-align:center; color:white;">
                                                <div>
                                                    <h1 class="about_title">실종 반려견</h1>
                                                </div>
                                                <div class="about_content">
                                                    잃어버린 반려견 전단지 PDF파일 <br>
                                                    무료제작 서비스로 <br>
                                                    집으로의 안전 귀가를 도와드립니다. <br>
                                                </div>
                                                <v-btn dark rounded color="green lighten-3"
                                                    @click="$router.push('/abandonedDog')">
                                                    바로가기
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                        </v-layout>
                    </div>
                </v-window-item>
            </v-window>
        </v-item-group>
        <div v-if="md">
            <v-card width="100%" tile elevation="0" :height="innerHeight">
                <v-img height="100%" src="../images/main_middle00.jpg">
                </v-img>
            </v-card>
            <v-card width="100%" tile elevation="0" :height="innerHeight">
                <div style="padding:24px; height:100%; background-color:#E0F2F1;">
                    <v-layout wrap style="height:50%;">
                        <v-col cols="6" class="pa-0" style="position:relative;">
                            <v-img height="100%" src="../images/event_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                            <div class="main_abouts mats">
                                <div class="about_img_text_area about_img_color1"></div>
                                <div class="about_text_area about_text_wep">
                                    <div class="d-flex align-center" >
                                        <div style="width:100%; text-align:center; color:white;">
                                            <div>
                                                <h2 class="about_title">애견 행사</h2>
                                            </div>
                                            <div class="about_content">
                                                    국내에 반려견과 반려인이 <br>
                                                    함께 참여 할 수 있는<br>
                                                    다양한 이벤트를 회원들과 <br>
                                                    공유하실 수 있습니다.
                                            </div>
                                            <v-btn dark rounded color="purple lighten-3"
                                                @click="$router.push('/event')">
                                                바로가기
                                            </v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="6" class="pa-0" style="position:relative;">
                            <v-img height="100%" src="../images/media_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                            <div class="main_abouts mats">
                                <div class="about_img_text_area about_img_color2"></div>
                                <div class="about_text_area about_text_wep">
                                    <div class="d-flex align-center" >
                                        <div style="width:100%; text-align:center; color:white;">
                                            <div>
                                                <h2 class="about_title">미디어</h2>
                                            </div>
                                            <div class="about_content">
                                                동영상 공유 플랫폼 서비스로 <br>
                                                회원들과 정보를 공유 및<br>
                                                커뮤니케이션을 제공합니다.<br>
                                            </div>
                                            <v-btn dark rounded color="blue lighten-3"
                                                @click="$router.push('/education/home')">
                                                바로가기
                                            </v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-layout>
                    <v-layout class="d-flex justify-center " style="height:50%;">
                        <v-col cols="12" class="pa-0" style="position:relative;">
                            <v-img height="100%" src="../images/lost_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                            <div class="main_abouts matl">
                                <div class="about_img_text_areal about_img_color3"></div>
                                <div class="about_text_area about_text_wep">
                                    <div class="d-flex align-center" >
                                        <div style="width:100%; text-align:center; color:white;">
                                           <div>
                                                <h2 class="about_title">실종 반려견</h2>
                                            </div>
                                            <div class="about_content">
                                                잃어버린 반려견 포스터 PDF파일 <br>
                                                무료제작 서비스로 <br>
                                                집으로의 안전 귀가를 도와드립니다. <br>
                                            </div>
                                            <v-btn dark rounded color="green lighten-3"
                                                @click="$router.push('/abandonedDog')">
                                                바로가기
                                            </v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-layout>
                </div>
            </v-card>
        </div>
        <div v-if="xs">
            <v-card width="100%" tile elevation="0" :height="innerHeight">
                <v-img height="100%" src="../images/main_small00.jpg"></v-img>
            </v-card>
            <v-card width="100%" tile elevation="0">
                <v-col cols="12" class="pa-0" style="position:relative;">
                    <v-img height="100%" src="../images/event_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                    <div class="main_abouts matl">
                        <div class="about_img_text_areal about_img_color1"></div>
                        <div class="about_text_area about_text_wep">
                            <div class="d-flex align-center" >
                                <div style="width:100%; text-align:center; color:white;">
                                    <div>
                                        <h3 class="about_title_m">애견 행사</h3>
                                    </div>
                                    <div class="about_content_m">
                                        국내에 반려견과 반려인이 <br>
                                        함께 참여 할 수 있는<br>
                                        다양한 이벤트를 회원들과 <br>
                                        공유하실 수 있습니다.
                                    </div>
                                    <v-btn dark rounded color="purple lighten-3"
                                        @click="$router.push('/event')">
                                        바로가기
                                    </v-btn>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-card>
            <v-card width="100%" tile elevation="0">
                <v-col cols="12" class="pa-0" style="position:relative;">
                    <v-img height="100%" src="../images/media_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                    <div class="main_abouts matl">
                        <div class="about_img_text_areal about_img_color2"></div>
                        <div class="about_text_area about_text_wep">
                            <div class="d-flex align-center" >
                                <div style="width:100%; text-align:center; color:white;">
                                    <div>
                                        <h3 class="about_title_m">미디어</h3>
                                    </div>
                                    <div class="about_content_m">
                                        동영상 공유 플랫폼 서비스로 <br>
                                        회원들과 정보를 공유 및<br>
                                        커뮤니케이션을 제공합니다.<br>
                                    </div>
                                    <v-btn dark rounded color="blue lighten-3"
                                        @click="$router.push('/education/home')">
                                        바로가기
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-card>
            <v-card width="100%" tile elevation="0">
                <v-col cols="12" class="pa-0" style="position:relative;">
                    <v-img height="100%" src="../images/lost_dog.jpg" style="opacity:0.8; position:relative;"></v-img>
                    <div class="main_abouts matl">
                        <div class="about_img_text_areal about_img_color3"></div>
                        <div class="about_text_area about_text_wep">
                            <div class="d-flex align-center" >
                                <div style="width:100%; text-align:center; color:white;">
                                   <div>
                                        <h3 class="about_title_m">실종 반려견</h3>
                                    </div>
                                    <div class="about_content_m">
                                        잃어버린 반려견 포스터 PDF파일 <br>
                                        무료제작 서비스로 <br>
                                        집으로의 안전 귀가를 도와드립니다. <br>
                                    </div>
                                    <v-btn dark rounded color="green lighten-3"
                                        @click="$router.push('/abandonedDog')">
                                        바로가기
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-card>
        </div>
    </v-container>
</template>

<script>

export default {
    data: () => ({
        window : 0,
        windowSize: { 
            x: 0,
            y: 0,
        },
        window : 0,
        length : 2,
        active_number : 0,
        active_bl : true, 
        innerHeight : null,
        innerWidth :null,
        lg : true,
        md : false,
        xs : false,
    }),
    methods:{
        onResize(){
            this.windowSize = { x: window.innerWidth, y: window.innerHeight * 0.6} 
            const {innerWidth, innerHeight} = window;
            this.innerWidth = `${window.innerWidth}px`;

            if(innerWidth > 999){
                this.lg = true;
                this.md = false;
                this.xs = false;
                this.innerHeight = `${innerHeight - 61}px`;
            }else if(innerWidth > 599){
                this.innerHeight = `${innerHeight * 0.8}px`;
                this.md = true;
                this.lg = false;
                this.xs = false;
            }else{
                this.innerHeight = `${innerHeight * 0.6}px`;
                this.xs = true;
                this.lg = false;
                this.md = false;
            }
        },
        windowPageMove(bl){ 
            this.window = bl ? 0 : 1;
            setTimeout(() => { this.active_bl = true; }, 250);
        },
        mousewheelEvent(){
            window.addEventListener('mousewheel', (delta) => {
               if(this.lg && this.active_bl){
                    this.active_bl = false;
                    if(delta.wheelDelta > 0 ){
                        this.windowPageMove(true);
                    }else if(delta.wheelDelta ){
                        this.windowPageMove(false);
                    }
               }
            })    
        },

    },
    created(){
        this.onResize(); this.mousewheelEvent();
    },
}
</script>

<style >
.main_abouts{
    position:absolute; 
    width:70%; 
    height:100%; 
}
.mata{
    top:30%; 
    left:15%; 
}
.mati{
    top:-12.5%; 
    left:15%; 
}
.mats{
    top:10%;
    left:15%;
}
.matl{
    top:10%;
    left:15%;
    height:90%; 
}
.about_title{
    padding-bottom:5%;
}
.about_title_m{
    padding-bottom:10px;
}
.about_img_text_areal{
    position: absolute; width:100%; height:90%; z-index:1; opacity:0.4;
}
.about_content{
    font-size:1em; opacity: 0.8; padding-bottom:10%; min-height:131px;
}
.about_content_m{
    font-size:14px; opacity: 0.8; padding-bottom:15px; min-height:60px;
}
.about_img_text_area{
    position: absolute; top:0px; left:0px; width:100%; height:80%; z-index:1; opacity:0.4
}
.about_img_color1{
    background-image: linear-gradient(183deg, rgb(163,10,137),rgb(191,54,160),rgb(97,239,229));
}
.about_img_color2{
    background-image: linear-gradient(181deg, rgb(16,104,251),rgb(116,136,234),rgb(211,211,234));
}
.about_img_color3{
    background-image: linear-gradient(181deg, rgb(29,193,37),rgb(34,173,42),rgb(161,161,253));
}
.about_text_area{
    position: absolute; z-index:1; width:100%; transform:translate(-50%, -50%); text-align:center;
}
.about_text_wep{
    top:40%; left:50%; 
}
.main_about{
    width:100%;
    max-width:1500px;
    margin:0 auto;
}
.h_in{
    height:inherit;
}
#home_card div{
    margin: 2%;
}
#home_card button{
    border: 0;
}
#event_title h1{
    font-size : 3em
}
#event_title p{
    font-size : 2em
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
}
.poster_op{
    width:100%;
    height: 100%;
    position: absolute;
    opacity: 0.7;
    background-color: black;
}
#item_groups{
    position : absolute;
    left:96%;
    top:43%;
    z-index: 2;
}

</style>