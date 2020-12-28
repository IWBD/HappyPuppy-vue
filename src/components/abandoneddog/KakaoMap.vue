<template>
    <v-dialog v-model="map_dialog" fullscreen hide-overlay 
    transition="dialog-bottom-transition" v-resize="onResize" eager>
        <v-card tile color="#F2F2F2" style="overflow:hidden">
            <div class="close_btn" v-if="!layout_item">
                <v-btn color="error" fab x-large dark @click="backward">
                <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
            <div id="map_header" style="background-color:#F2F2F2;"
            :class="layout_item ? dynamic_style.mb_h : dynamic_style.wep_h">
                <v-toolbar flat :id="layout_item ? dynamic_style.mb_t : dynamic_style.wep_t" height='auto'>
                  <span style="padding-right:16px;" v-if="layout_item">
                      <v-btn color="#1E88E5" dark @click="backwardBtn" style="padding-right:16px;" >
                      <v-icon v-if="map_header_switch">mdi-close</v-icon>
                      <v-icon v-else>mdi-arrow-left</v-icon>
                      </v-btn>
                  </span>
                  <v-text-field 
                  v-model="keyword"
                  ref="keyword"
                  height="36" hide-details="auto" 
                  prepend-inner-icon="mdi-map-marker"
                  label="장소, 주소 검색"
                  single-line
                  clearable
                  @focus="searchFocus"
                  @keyup.up.down="keywordSelect"
                  @keyup.enter="searchPlaces"
                  @input="getRelevants"
                  >
                  </v-text-field>
                  <v-btn icon color="#1E88E5" @click="searchPlaces">
                      <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <div v-if="!layout_item" style="position:absolute; left:348px; z-index:999;">
                      <v-btn v-if="!layout_item" x-small tile height=60 color="white" elevation="0" @click="showMapList">
                      <v-icon >{{ps_icon}}</v-icon>
                      </v-btn>
                  </div>
                </v-toolbar>  
                <div id="map_search_list" style="display:none;">
                    <v-card style="margin:0.5%;" tile subheader >
                        <v-list-item-group v-model="relevant_select" class="font-weight-bold" > 
                            <v-list-item v-for="(bar, index) in keyword_relevants" :key="index" v-text="bar" @click="relevantClick(index)"></v-list-item>
                        </v-list-item-group>
                    </v-card>
                </div>
                <div id="map_ps_list" ref="map_ps_list" :style="dynamic_style.ps_list_st + ps_st ">
                    <v-card tile class="ma-1" outlined
                    v-for="(bar, index) in map_list" :key="bar.id"
                    :id="bar.id" @mouseover="showInfowindow(index, bar)">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>
                                <v-icon style="margin-bottom:1%; color:#2E9AFE;">{{category_icon[bar.category_group_code]}}</v-icon>
                                <strong style="color:#2E9AFE;">{{bar.place_name}}</strong> {{bar.category_name}}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                <div>{{bar.address_name}}
                                </div>
                                <div>{{bar.road_address_name}}
                                </div>
                                </v-list-item-subtitle>
                                
                            </v-list-item-content>
                            <v-list-item-avatar
                                v-if="map_imgs[bar.id]"
                                tile
                                size="80"
                            >
                                <img :src="map_imgs[bar.id]">
                            </v-list-item-avatar>
                        </v-list-item>
                        <v-card-actions>
                            <div style="width:100%; height:20%;" class="d-flex justify-center" >
                                <v-btn class="ma-1" tile outlined style="width:33%;" @click="moveCenter(bar, index)">지도보기</v-btn>
                                <v-btn class="ma-1" tile outlined style="width:33%;" @click="showRoadview(bar)">로드뷰보기</v-btn>
                                <v-btn class="ma-1" tile outlined style="width:33%;" @click="selectPlace(bar.place_name, bar.address_name, bar.road_address_name)">선택</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                    <div style="margin-bottom:56px;">
                        <v-pagination v-if="map_list" v-model="map_list_page" :length="map_list_pnumber"></v-pagination>
                    </div>
                </div>
            </div>
            <div>
                <div id="map" style="width:100%; display:block; z-index:1;" @click="searchBlur">
                </div>
            </div>
            <div id="rv_container" style="width:100%; height:100vh; display:none; position:absolute; z-index:3;">
                <div :class="layout_item ? 'mrv_close_btn' : 'wrv_close_btn'">
                    <v-btn color="primary" fab dark @click="rvDrop">
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-bottom-navigation
            v-if="layout_item" scroll-target="#map" hide-on-scroll absolute
            horizontal :value="active_btn" style="position:fixed;">
                <v-btn text color="deep-purple accent-4" @click="showMap(layout_item)">
                <span class="font-weight-bold">지도</span>
                <v-icon>mdi-map</v-icon>
                </v-btn>
                <v-btn text color="deep-purple accent-4" @click="showList(layout_item)">
                <span class="font-weight-bold">목록</span>
                <v-icon>mdi-format-list-numbered</v-icon>
                </v-btn>
            </v-bottom-navigation>
        </v-card>
    </v-dialog>
</template>



<script>
export default {
  data: () => ({
    map_imgs : {},
    active_btn: 0,
    map_dialog:false,
    keyword: null, //검색 키워드
    keyword_relevants:[], //연관 검색어 리스트
    keyword_Guard:null, //연관 검색어를 불러오는 과정에서 동기화를 위한 변수
    map_header_switch:false,
    map_switch:false,
    map: null,
    map_list:null, //검색 결과
    map_list_page:1,
    map_container:null, //맵 태그
    map_relayout_bl:false,
    map_markers:[],
    map_ps:null,
    map_infowindow:null,
    category_icon : {
      "" : 'mdi-map-marker',
      MT1 : 'mdi-cart',//대형마트 
      CS2 : 'mdi-store-24-hour',//편의점
      PS3 : 'mdi-baby-face',//어린이집, 유치원
      SC4 : 'mdi-school',//학교
      AC5 : 'mdi-teach',//학원
      PK6 : 'mdi-parking',//주차장
      OL7 : 'mdi-gas-station',//주유소, 충전소
      SW8 : 'mdi-train',//지하철역
      BK9 : 'mdi-bank',//은행
      CT1 : 'mdi-movie-open',//문화시설
      AG2 : 'mdi-home-currency-usd',//중개업소
      PO3 : 'mdi-account-check',//공공기관
      AT4 : 'mdi-map-check',//관광명소
      AD5 : 'mdi-bed',//숙박
      FD6 : 'mdi-silverware-fork-knife',//음식점
      CE7 : 'mdi-coffee',//카페
      HP8 : 'mdi-hospital-box',//병
      PM9 : 'mdi-pill',//약국
    },
    relevant_select : -1,
    searched_keywords : {},
    map_list_pnumber : 5,
    map_pagination : null,
    map_bounds : null,
    ps_icon : "mdi-arrow-right",
    dynamic_style:{
      mb_h : "mb_header",
      wep_h : "wep_header",
      mb_t : "mb_toolbar",
      wep_t : "wep_toolbar",
      ps_list_st : ""
    },
    ps_st:"display:none;",
    layout_item : false, //모바일 or 웹 레이아웃을 구별해줄 변수, true(모바일) flase(웹),
    rv_container : null,
    rv_num : null,
    mo_idx : null,
  }),
  computed :{
    
  },
  methods:{
    resetDialog(){
      this.map_dialog = false;
      this.map_header_switch = false;
      this.map_switch = false;
      this.map_relayout_bl = false;
      this.layout_item = false;
      this.map_imgs = null;
      this.keyword = null;
      this.keyword_Guard = null;
      this.map = null;
      this.map_list = null;
      this.map_container = null;
      this.map_ps = null;
      this.map_infowindow = null;
      this.map_pagination = null;
      this.map_bounds = null;
      this.rv_container = null;
      this.rv_num = null;
      this.mo_idx = null;
      this.map_imgs = {};
      this.active_btn = 0;
      this.keyword_relevants = [];
      this.map_list_page = 1;
      this.map_markers = [];
      this.relevant_select = -1;
      this.searched_keywords = {};
      this.map_list_pnumber = 5;
      this.ps_icon = "mdi-arrow-right";
    },
    //window의 사이즈가 변경될때 마다 보여줄 레이아웃 변수를 재정의 하고
    //windowHeight함수를 실행
    onResize(){
      if(this.map_dialog){
        var height = window.innerHeight;
        const bl = window.innerWidth <= 700 ? true : false;
        this.layout_item = bl;
        if(bl){//mb
          this.dynamic_style.ps_list_st = "height:auto;";
          height = `${height - 66}px`;
          this.map_list ? this.showList(bl) : this.showMap(bl);
        }else{//pc
          const ph = `${height - 60}px`;
          this.dynamic_style.ps_list_st = `overflow:auto; height:${ph};`;
          height = "100vh";
          this.map_switch ? this.showList(bl) : this.showMap(bl);
          if(this.rv_num){
            this.map_infowindow.close();     
            this.map_infowindow.open(this.map, this.map_markers[this.rv_num]);
          }
        }
        console.log(`height : ${height}`);
        this.map_container.style.height = height;
        this.map.relayout();
      }
    },
    //header안의 연관 검색어와 검색 결과 태그의 dispaly속성을 재설정
    headerControl(sl, pl){
      document.getElementById('map_search_list').style.display = sl;
      // document.getElementById('map_ps_list').style.display = pl;
      this.ps_st = 'display:' + pl + ';'
    },
    //검색 결과 목록을 보여주는 함수
    showList(bl){
      console.log('showList')
      if(!this.map_list){
        alert("검색된 결과가 없습니다.")
        this.showMap();
        return
      }
      this.$refs["keyword"].blur();
      this.map_header_switch = false;
      this.map_switch = true;
      this.active_btn = 1;
      //mb일 경우 맵도 가림
      if(bl){
        this.map_container.style.display = 'none';
      }else{
        const width = window.innerWidth - 350;
        let mc = this.map_container;
        mc.style.width = `${width}px`;
        mc.style.left = '350px';
        mc.style.display = 'block';
        setTimeout(()=>{
          this.map.setBounds(this.map_bounds);
        },500)
      }
      this.headerControl('none', 'block');
      this.ps_icon = "mdi-arrow-left";
      this.map.relayout();
    },
    showMapList(){
      console.log('showMapList');
      if(this.map_switch){
        this.showMap(this.layout_item);
      }else{
        if(this.map_list){
          this.showList(this.layout_item);
          this.map.setBounds(this.map_bounds);
        }else{
          alert("검색된 결과가 없습니다.")
        }
      }
    },
    //map을 보여주는 함수
    showMap(bl){
      console.log('showMap!!')
      this.$refs["keyword"].blur();
      this.map_switch = false;
      this.active_btn = 0;
      this.map_header_switch = false;
      this.headerControl('none', 'none');
      let mc = this.map_container;
      mc.style.left = "0px";
      mc.style.width = "100%";
      mc.style.display = 'block';
      this.ps_icon = "mdi-arrow-right";
        this.map.relayout();
      if(this.rv_num){
        this.map_infowindow.close();     
        this.map_infowindow.open(this.map, this.map_markers[this.rv_num]);
      }
      if(this.map_list){
        this.map.setBounds(this.map_bounds);
      }
    },
    //검색어 입력 태그에 foucs시 연관 검색 목록을 보여주는 함수
    searchFocus(){
      this.map_header_switch = true;
      if(this.layout_item) this.map_container.style.display = 'none';

      this.headerControl('block', 'none');
    },
    //검색어 입력 중 다른 태크 클릭시 연관검색 목록을 닫는 함수
    searchBlur(event){
      if(event.target.tagName !== "INPUT"){
        if(!this.layout_item && this.map_header_switch){
          !this.map_list || this.showList(this.layout_item);
        }
      }
    },
    //지도 화면을 닫음
    backward(){
      this.map_dialog = false;
    },
    //모바일레이아웃 상황에서 toolbar에 버튼을 누르면 실행
    //지도 화면을 닫거나 연관 검색 목록을 닫음
    backwardBtn(){
      if(this.map_header_switch){
        if(this.map_list){
            this.showList(this.layout_item);
          }else{
            this.showMap(this.layout_item);
          }
        this.map_header_switch = false;
      }else{
        this.backward();
      }
    },
    //검색창에 input이 들어 갈경우 연관검색어를 backend서버에 요청
    getRelevants(){
      if(!!this.keyword){
        this.rv_num = null;
        this.relevant_select = -1;
        const k = this.keyword;
        if(this.searched_keywords[k] === undefined){
          this.$http.get(`api/relevant/map/${k}`).then((res) => {
              if(res.data.length === 0){
                this.keyword_relevants = [];
                return
              }
              this.searched_keywords[k] = res.data;
              this.keyword_relevants = res.data;
           }
          ).catch(err => {
            alert("연관검색어를 불러오는 과정에서 문제가 발생했습니다. 관리자에게 문의하세요.")
          })
        }else{
          this.keyword_relevants = this.searched_keywords[k];
        }
      }else{
        this.relevant_select = -1;
        this.keyword_relevants = [];
      }
    },
    //방향키 이벤트를 정의한 메소드로 연관검색어에서
    //검색할 검색어를 방향키로 고를 수 있게 해주는 함수
    keywordSelect(event){
      this.searchFocus();
      if(this.keyword_relevants === undefined) return

      const item = event.keyCode;
      const relevants_length = this.keyword_relevants.length;
      if(relevants_length > 0){

        if(item === 38){
          if(this.relevant_select > 0)
            this.relevant_select --;
        }else{
          if(this.relevant_select < relevants_length-1)
            this.relevant_select ++;
        }
        
        this.keyword = this.keyword_relevants[this.relevant_select];
      }
    },
    //연관 검색어 클릭시 실행될 함수d
    //선택한 연관 검색어로 검색을 실행
    relevantClick(index){
      this.keyword = this.keyword_relevants[index];
      this.searchPlaces();
    },
    //여기서 부터 지도 조작 및 검색 실행에 대한 메소드
    //입력된 키워드를 파마리터로 placeSearchCB 메소드 호출
    searchPlaces(){
      const keyword = this.keyword;
      if(!keyword){
        alert("검색어를 입력해주세요.");
         return; 
      }
      if(!keyword.replace(/^\s+|\s+$/g, '')){
        alert("공백만 입력하셨습니다.");
        return;
      }
      this.$refs["keyword"].blur();
      this.map_list_page = 1;
      this.map_ps.keywordSearch(keyword, this.placeSearchCB);
    },
    //장소 검색이 완료됐을 때 호출되는 콜백함수
    //검색이 정장 완료 됐으면 마커와 페이지 번호를 표출
    placeSearchCB(data, status, pagination){
      if(status === kakao.maps.services.Status.OK) {
        this.map_pagination = pagination;
        this.map_list_pnumber = pagination.last;
        this.map_list = data;
        for(let i = 0; i<data.length; i++){
          this.map_list[i].category_name = this.splitCategory(data[i].category_name);
        }
        this.map_header_switch = false;
        this.showList(this.layout_item);
        this.displayPlaces(data);
      }else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색결과가 존재하지 않습니다.")
        // this.map_list = null;
        return;

      }else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 과정에서 문제가 발생했습니다. 관리자에게 문의하세요.")
        // this.map_list = null;
        return;
      }
    },
    //검색결과의 목록별 카테고리 문자열 파싱
    splitCategory(data){
      if(!data) return;
      let item = data.split('>');
      return item[item.length - 1];
    },
    // 검색 결과 마커를 표출
    displayPlaces(places){
      var bounds = new kakao.maps.LatLngBounds();
      this.removeMarker();
      const displayInfowindow = this.displayInfowindow;
      const map_infowindow = this.map_infowindow;
      let i = 0;
      var n = null;
      for(let item of places){
        let j = i++;
        const place_position = new kakao.maps.LatLng(item.y, item.x),
        marker = this.addMarker(place_position, item);
        bounds.extend(place_position);
        (function(marker, item){
          kakao.maps.event.addListener(marker, 'click', function() {
            if(n!==j){
              n = j;
              map_infowindow.close();
              displayInfowindow(marker, item, j);
            }else{
              n = null;
              map_infowindow.close();
            }
          });
        })(marker, item);

      }
      this.setPlacesImg(places);
      this.map_bounds = bounds;
      this.map.setBounds(bounds);
    },
    //마커를 도출한뒤 마커객체를 리턴해주는 함수
    addMarker(position, idx, title){
      const marker = new kakao.maps.Marker({position: position});
      marker.setMap(this.map);
      this.map_markers.push(marker);
      return marker;
    },
    infoEl(data, bl){
      let el = "<div style='width:320px; hight:200px;'><div tabindex='-1' class='v-list-item v-list-item--three-line theme--light'><div class='v-list-item__content'><div class='v-list-item__title'><i aria-hidden='true' class='v-icon notranslate mdi " + 
      this.category_icon[data.category_group_code] + " theme--light' style='margin-bottom: 1%;'></i><strong>"+ data.place_name + 
      "</strong>"+ data.category_name + "</div><div class='v-list-item__subtitle'><div>" + data.address_name + "</div><div>"+ data.road_address_name + "</div></div></div>";
      if(!!this.map_imgs[data.id]){
        el  += "<div class='v-avatar v-list-item__avatar v-avatar--tile' id='9113903' style='height: 80px; min-width: 80px; width: 80px;'><img src='"+ this.map_imgs[data.id] +"'></div>";
      }
      return el;
    },
    displayInfowindow(marker, place, idx){
      this.rv_num = idx;
      const el = this.infoEl(place, true);
      this.map_infowindow.setContent(el);
      this.map_infowindow.open(this.map, marker);
    },
    showInfowindow(idx, place){
      if(this.mo_idx !== idx && !this.layout_item){
        this.mo_idx = idx;
        this.displayInfowindow(this.map_markers[idx], place, idx)
      }
    },
    removeMarker(){
      for(let item of this.map_markers){
        item.setMap(null);
      }
      this.map_markers = [];
    },
    setPlacesImg(places){
      let arr = new Array();
      for(let i of places){
        if(i.category_group_code !== "SW8" && i.category_group_code !== "PK6")
          arr.push(i.id);
      }
      this.$http.post('api/relevant/mapImg', arr).then(
        (res) => {
            this.map_imgs = res.data;
          }
        ).catch(err => {
          alert("장소 이미지를 불러오는 과정에서 문제가 발생했습니다. 관리자에게 문의하세요.")
      })
    },
    showRoadview(data){
      if(this.layout_item){
        this.showMap(this.layout_item);
      }
      let rvc = document.createElement('div');
      rvc.id = "roadview";
      var roadview = new kakao.maps.Roadview(rvc);
      var roadviewClient = new kakao.maps.RoadviewClient();
      var position = new kakao.maps.LatLng(data.y, data.x);
      roadviewClient.getNearestPanoId(position, 130, function(panoId) {
          roadview.setPanoId(panoId, position);
      });
      let rv_container = document.getElementById("rv_container");
      rv_container.style.display = "block";
      rv_container.append(rvc);
      this.rv_container = rvc;
      const content = this.infoEl(data);

      kakao.maps.event.addListener(roadview, 'init', function() {
      // 로드뷰에 올릴 마커를 생성합니다.
        var rMarker = new kakao.maps.Marker({
            position: position,
            map: roadview //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
        });
        rMarker.setRange(130); //마커가 보일 수 있는 범위를 설정합니다. (단위는 m입니다.)
        rMarker.ba.src = "https://cdn.pixabay.com/photo/2020/04/29/16/50/navigation-5109662_960_720.png";
        // 로드뷰에 올릴 장소명 인포윈도우를 생성합니다.
        var rLabel = new kakao.maps.InfoWindow({
            content: content
        });
        rLabel.setRange(130); //마커가 보일 수 있는 범위를 설정합니다. (단위는 m입니다.)
        rLabel.open(roadview, rMarker); // open시 마커를 넣어주면, 마커의 altitude와 position값을 모두 따라 갑니다.
        // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정합니다.
        var projection = roadview.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.
        // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
        var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
        roadview.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
      });
      this.map_container.style.display = "none";
    },
    rvDrop(){
      document.getElementById("rv_container").style.display = "none";
      this.rv_container.parentNode.removeChild(this.rv_container);
      this.map_container.style.display = "block";
      if(this.layout_item){
        this.showList(this.layout_item);
        this.map_infowindow.close();
        this.map_infowindow.open(this.map, this.map_markers[this.rv_num]); 
      }
    },
    moveCenter(place, idx){
      !this.layout_item || this.showMap();
      var b = new kakao.maps.LatLngBounds();
      b.extend(new kakao.maps.LatLng(place.y, place.x));
      this.map.setBounds(b);
      this.displayInfowindow(this.map_markers[idx], place, idx)
    },
    //지도페이지를 여는 메소드
    openMap(){
      this.map_dialog = true;
      this.map_relayout_bl = false;
      this.onResize();
    },
    selectPlace(name, address_name, road_address_name){
      this.$emit("child",{
          name : name,
          address_name : address_name,
          road_address_name : road_address_name,
      })
      this.backward();
    },
    //지도 생성
    createMap(){
      this.map_container = document.getElementById("map");
      const map_option = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
      }
      this.map = new kakao.maps.Map(this.map_container, map_option);
      this.map_ps = new kakao.maps.services.Places();
      this.map_infowindow = new kakao.maps.InfoWindow({zIndex:1});
    },
  },
  watch : {
    //페이지 번호 클릭시 실행되는 함수
    map_list_page : function(hook){
      this.map_infowindow.close();
      this.map_pagination.gotoPage(hook);
    },
  },
  mounted(){
    this.createMap();
  },
  updated(){
    //지도페이지를 여는 순간 지도가 생성 되고나서 한번만 실행
    //지도의 사이즈를 다시 설정하고 레이아웃을 재설정
    if(!this.map_relayout_bl){
      this.onResize();
      this.map_relayout_bl = true;
    }
  },
  
}

</script>

<style>
  @import '../../css/abandoned/kakaomap.css';
</style>
