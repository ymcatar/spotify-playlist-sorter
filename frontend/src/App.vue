<template>
  <v-app dark>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md8>
            <router-view></router-view>
          </v-flex>
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
@import url("https://fonts.googleapis.com/css?family=Barlow:300,300i,400,400i,500,500i,700,700i");
</style>

<style lang="stylus">
$color-pack = false;
$body-font-family = 'Barlow';

@import '~vuetify/src/stylus/main';
</style>