<template>
  <div>
    <div v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="loaded">
      <div class="display-3 font-weight-thin">Select a playlist</div>
      <br>
      <v-divider></v-divider>
      <br>
      <v-list two-line>
        <template v-for="(item, index) in playlists">
          <v-list-tile :key="`playlist-tile-${index}`" avatar @click="onSelectPlaylist(item.id)">
            <v-list-tile-avatar :key="`playlist-avatar-${index}`">
              <v-avatar color="teal">
                <img :src="item.images[0].url">
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-bold">{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>
                <span v-if="item.collaborative">
                  <b>Collaborative -</b>
                </span>
                {{item.owner.display_name}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script>
import queryString from "query-string";
import axios from "axios";

export default {
  data: () => ({
    loaded: false,
    playlists: []
  }),
  mounted: async function() {
    await this.getPlaylists();
  },
  methods: {
    getPlaylists: async function() {
      const playlists = (await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }
      )).data.items;
      this.loaded = true;
      this.playlists = playlists;
      console.log(this.playlists);
    },
    onSelectPlaylist: function(playlistId) {
      alert(playlistId);
    }
  },
  computed: {
    accessToken: function() {
      return queryString.parse(window.location.hash).access_token;
    }
  }
};
</script>

<style>
.v-list {
  background: transparent !important;
}
</style>