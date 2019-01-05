<template>
  <v-app dark>
    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "spotify-playlist-sorter"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Overpass:300,300i,400,400i,500,500i,700,700i");
</style>

<style lang="stylus">
$color-pack = false;
$body-font-family = 'Overpass';

@import '~vuetify/src/stylus/main';
</style>