<h2>소개</h2>
<li><a href="http://54.180.93.116/">배포중인 웹</a> 입니다.</li>
<li>Vue js와 Node js 기반으로 견주들을 위한 반응형 웹 어플리케이션을 만들어 보았습니다.</li><br>

<h2>간략한 설명</h2>
<li>해당 프로젝트는 Vue Cli를 이용하여 생성한 웹팩을 express에 run build한 프로젝트로 해당 레포지토리는 프론트 소스코드 입니다.</li>
<li>모바일에서도 서비스 가능하게끔 반응형 웹 디자인에 신경섰습니다.</li>
<li>express(node js)와 프로젝트의 상세정보는 <a href="https://github.com/SangkyuGoodboyYesDoitsgoi/HappyPuppy">여기</a>를 클릭하세요.</li>
<br>
-웹팩에서 사용한 라이브러리 및 UI 컴포넌트의 대략적인 정보는다음과 같습니다.<br>
<li>npm 6.13.4</li>
<li>vue/cli 4.1.2</li>
<li>vuex 3.1.2</li>
<li>jquery 3.5.1</li>
<li>vue-masonry 0.12.0</li>
<li>UI component : Vuetify js 2.2.11</li>
<li>jspdf 1.5.3</li>
<li>api: 카카오 맵</li>
<li>자세한 모듈 정보와 버전은 package.json를 참고하세요.</li>
<li>서버사이드에 관한 모듈 정보는 <a href="https://github.com/SangkyuGoodboyYesDoitsgoi/HappyPuppy/blob/master/package.json">여기</a>를 참고하세요.</li>

<h2>실행 전</h2>
<li>해당 레포지토리는 HappyPuppy 프로젝트의 Vue js 코드를 분리하는 것으로 서버사이드 코드가 필요합니다.</li>
<li><a href="https://github.com/SangkyuGoodboyYesDoitsgoi/HappyPuppy">여기</a>를 클릭하여 서버를 실행시키세요.</li>
<li>소스코드를 수정하고 서버에 run build 할거라면 vue.config.js를 수정하세요.</li>

    module.exports = { 
      devServer: { 
        proxy: { 
          '/api': { 
            target: 'http://localhost:<your sever local port>/api',
            changeOrigin: true, 
            pathRewrite: { 
              '^/api': ''
            } 
          } 
        } 
      },
      outputDir: '<your sever directory path>/public',
    }
      

<h2>실행</h2>
<li>npm install</li>
<li>npm run serve</li>
<li>코드 수정 서버 반영: npm run build</li>

<br>
<h2>감사합니다.</h2>
