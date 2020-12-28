<template>
    <div id="pdf">
        <div ref="poster" id="poster" :style="poster_style.p">
            <img style="width:100%;" :src="poster">
        </div>
        <v-dialog  v-model="loader_dialog" hide-overlay  persistent width="350">
            <v-card color="primary" dark>
                <v-card-text>PDF파일을 생성 중입니다. 잠시만 기다려 주세요.
                    <v-progress-linear  indeterminate color="white"  class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card> 
        </v-dialog>
    </div>
</template>


<script>
export default {
    props:['poster', 'poster_name'],
    data: () => ({
        poster_style : {
            p:'width:420px; height:594px;', b:'color:white; font-size:0.66em; z-index:10;',
            n:'width:100%; color:white; font-size:2em;', t:'width:100%; font-size:2em; color:red;', h:'font-size:1.25em',
            d:'width:80%; margin:0 auto; font-size:1em;', c:'width:100%; height:13%; font-size:0.8em;',
        } ,
        loader_dialog : false,
        poster:null,
    }),
    methods:{
        createPDF(){
            this.loader_dialog = true;
            setTimeout(()=>{
                const is_mobile = this.mobileCheck(window.navigator.userAgent);
                this.loader_dialog = false;
                let bl = true;
                
                if(is_mobile){
                    window.open(`/api/img/get_img/abandoned/${this.poster_name}`);
                    return;
                }
                
                var doc = new jsPDF({
                    'orientation': 'p',
                    'unit': 'mm',
                    'format': 'a4'
                });

                doc.addImage(this.poster, 'jpg', 0, 0, 210, 210 * 1.414);
                doc.save('실종 반려견.pdf');
                this.$emit("child",1);
            },200)
        },
        getElLocation(el) {
            let x = 0;
            let y = 0;
            if(el.offsetParent) {
                do {
                    x += el.offsetLeft - (el.scrollLeft !== 0 ? el.scrollLeft : 0);
                    y += el.offsetTop - (el.scrollTop !== 0 ? el.scrollTop : 0);
                } while (el = el.offsetParent);
            }
            return {x : x, y : y};
        },
        mobileCheck(agent){
            const mobileRegex = [
                /Android/i,
                /iPhone/i,
                /iPad/i,
                /iPod/i,
                /BlackBerry/i,
                /Windows Phone/i
            ]
            return mobileRegex.some(mobile => agent.match(mobile))
        },
    },
}

</script>

<style scoped>
@import '../../css/abandoned/poster.css';
</style>
