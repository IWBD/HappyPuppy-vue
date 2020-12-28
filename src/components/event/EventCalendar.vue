<template>
  <v-row class="fill-height" >
    <v-col align="center" >
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <div style="width:100%; max-width:800px; margin:0 auto;" class="d-flex align-center">
            <v-btn outlined tile class="mr-4" color="grey darken-2" @click="setToday" v-if="!$vuetify.breakpoint.xs">
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <div class="ml-2">
              {{title}}
            </div>
            <v-spacer></v-spacer>
          </div>
        </v-toolbar>
      </v-sheet>
        <v-sheet height="600" style="position:relative;">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @change="updateRange"
          >
          </v-calendar>
          <div v-if="more" style="width:100%; height:100%; position:absolute; top:0px; left:0px; z-index:10;">
            <v-card color="white" width="100%" height="100%" tile elevation="0">
              <div style="width:100%;">
                <div style="padding:2%;" class="d-flex align-center">
                  <v-spacer></v-spacer>
                  <div>
                    {{more_date}}
                  </div>
                  <div class="ml-10">
                    <v-btn tile outlined @click="more=false">달력 보기</v-btn>
                  </div>
                  <v-spacer></v-spacer>
                </div>
              </div>
              <div style="width:80%; height:80%; overflow:auto;">
                <div v-for="(bar, index) in more_arr" :key="index">
                    <v-btn tile width="100%" height="50px" @click="selectMore(bar)" dark :color="bar.color">
                        <div style="width:100%;" class="d-flex justify-center" >
                          <div v-if="bar.end">
                            <v-spacer></v-spacer>
                            {{bar.name}}
                            <v-spacer></v-spacer>
                            {{bar.start}} ~ {{bar.end}}
                            <v-spacer></v-spacer>
                          </div>
                          <div v-if="!bar.end" class="ma-2">
                            <v-spacer></v-spacer>
                            {{bar.name}}
                            <v-spacer></v-spacer>
                            {{bar.start}}
                            <v-spacer></v-spacer>
                          </div>
                        </div>
                    </v-btn>
                </div>
              </div>
            </v-card>
          </div>
        </v-sheet>
    </v-col>
    <v-dialog v-model="event_dialog" fullscreen hide-overlay>
      <div class="poster_tollbar">
        <v-col cols="12" class="d-flex align-center poster_title">
            {{event_name}}
          <div class="d-flex ml-auto">
              <v-btn color="whith" style="float: left;" dark width="80" text @click="movePage(event_url)">사이트방문</v-btn>
              <v-btn color="whith" style="float: left;" dark width="60" text @click="event_dialog = false">닫기</v-btn>
          </div>
        </v-col>
      </div>
      <v-card tile style="background-color:rgba(0,0,0,0.5);">
        <div class="position_center poster_div">
          <v-img style="width:100%;" :src="'/api/img/get_img/event/' + event_img">
          </v-img>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      focus: '',
      type: 'month', //컨트롤 인터페이스에 캘린더 형식
      start: null,
      end: null,
      events: [],
      events_info: null,
      colors: ['blue lighten-2', 'indigo lighten-2', 'deep-purple lighten-2', 'cyan lighten-2', 'green lighten-2', 'orange lighten-2', 'grey lighten-2'],
      today: null, //사용하는 부분 지웠는데도 없다고 에러떠서 그냥 널처리
      event_dialog: false,//디아로그 여부
      event_name:null,
      event_img:null,
      more:false,
      more_date:null,
      more_arr:[],
      event_url:null,
    }),
    computed: {
      title () {
        const start = this.start
        if (!start) {
          return ''
        }
        return `${start.year}년 ${this.monthFormatter(start)}`
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      getEventColor (event) {
        return event.color
      },
      //Today버튼을 클릭하면 실행
      //this.focus를 현재 날짜로 변경합니다.
      setToday () {
        this.focus = this.today
      },
      //title의 월을 이전 달로 이동
      prev () {
        //calendar의 내장함수를 호출합니다.
        this.$refs.calendar.prev()
      },
      //title의 월을 다음 달로 이동
      next () {
        //calendar의 내장함수를 호출합니다.
        this.$refs.calendar.next()
      },
      //달력에 이벤트를 클릭하면 실행
      showEvent ({event}) {
        this.event_name = event.name;
        const items = this.events_info, num = event.num;
        for(let item of items){
          if(item.num === num){
            this.event_img = item.ev_img;
            this.event_url = item.ev_url;
          };
        }
        this.event_dialog = true
        return false;
      },
      childEvent(item){
        this.event_name = item.ev_name;
        this.event_img = item.ev_img;
        this.event_url = item.ev_url;
        this.event_dialog = true;
        return false;
      },
      //more누르면 실행
      //해당 이벤트의 포스터를 보여줌
      viewDay ({date}){
        let bke = new Array();
        const events = this.events;
        for(let item of events){
          if(item.start <= date || date <= item.end){
            bke.push(item);
          }
        }
        console.log(date)
        console.log(bke);
        this.more_arr = bke;
        this.more_date = date;
        this.more = true;
      },
      //moreview 안에서 이벤트 클릭시 실행
      selectMore(item){
        const event = item;
        this.showEvent({event});
      },
      movePage(url){
        window.open(url,'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
      },
      //달력에 이벤트를 셋팅
      //여기서 start, end는 calendar에서의 start와 end임
      updateRange ({ start, end }) {
        const query = `/api/event/get_events/${start.date}/${end.date}`;
        this.$http.get(query).then(res => {
          const items = res.data.items, arr = new Array();
          const formatDate = this.formatDate;   
          for(const item of items){
            arr.push({
              num : item.num,
              name : item.ev_name,
              start : this.formatDate(new Date(item.ev_start_date)),
              end : item.ev_end_date ? this.formatDate(new Date(item.ev_end_date)) : null,
              color : this.rndc()
            })
          }
          this.start = start
          this.end = end
          this.events = arr; 
          this.events_info = items;
        }).catch(err =>{
          console.error(err);
          alert('이벤트 정보를 가져오는 중에 문제가 발생했습니다.');
        })
        
      },
      rndc(){
        return this.colors[this.rnd(0, this.colors.length - 1)]
      },
      //일수를 램덤으로 만들어 주는 함수인데 이건 db연결하면서 db에 맞게 변경해야함
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      formatDate (a, bl) {
        return bl ? `${a.getFullYear()}-${a.getMonth() + 1}` : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
      },
    },
  }
</script>

<style scoped>
@import '../../css/event/posterview.css';
</style>