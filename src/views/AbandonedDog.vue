<template>
  <v-container fluid style="padding:0px;"> 
    <ADContent/>
  </v-container>
</template>

<script>
  import ADContent from '../components/abandoneddog/AbandonedDog_cards';
  export default {
      components: {
          ADContent,
      }
  }
</script>