import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Event from '../views/Event.vue'
import Education from '../views/Education.vue'
import AbandonedDog from '../views/AbandonedDog.vue'
import page404 from '../views/404page.vue'
import MemberPage from '../views/MemberPage.vue'
import MemberEvent from '../components/memberPage/Event'
import MemberAbandoned from '../components/memberPage/Abandoned'
import MemberMedia from "../components/memberPage/Media";
import Channel from '../components/media/Channel'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/event',
    name: 'event',
    component: Event
  },
  {
    path: '/education/:tab/:keyword',
    name: 'education',
    component: Education
  },
  {
    path: '/education/:tab',
    name: 'education',
    component: Education
  },
  {
    path: '/abandonedDog',
    name: 'abandonedDog',
    component: AbandonedDog
  },
  {
    path: '/education',
    name: 'education',
    component: Education
  },
  {
    path: '/memberPage',
    name: 'memberPage',
    component: MemberPage
  },
  {
    path: '/memberEvent',
    name: 'memberEvent',
    component: MemberEvent
  },
  {
    path: '/memberAbandoned',
    name: 'memberAbandoned',
    component: MemberAbandoned
  },
  {
    path: '/memberMedia',
    name: 'memberMedia',
    component: MemberMedia
  },
  {
    path: '/channel/:email',
    name: 'channel',
    component: Channel
  },
  {
    path: '*',
    name : 'page404',
    component : page404
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
