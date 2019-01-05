<template>
  <v-flex xs12 sm12 md12>
    <div v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="loaded">
      <div class="display-3 font-weight-bold">
        <a @click="goBack">←</a>&nbsp;
        Select a sort order
      </div>
      <br>
      <v-divider></v-divider>
      <br>
      <div class="headline">
        <v-avatar>
          <img :src="playlist.images[0].url">
        </v-avatar>&nbsp;
        <span class="font-weight-bold">{{playlist.name}}</span>
      </div>
      <br>
      <v-divider></v-divider>
      <br>
      <v-data-table
        :pagination.sync="pagination"
        :headers="headers"
        :items="tracks"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            <b>{{ props.item.index }}</b>
          </td>
          <td>
            <b>{{ props.item.name }}</b>
          </td>
          <td>{{ props.item.artists }}</td>
          <td>{{ props.item.album }}</td>
          <td>{{ props.item.popularity }}</td>
          <td>{{ props.item.addedBy }}</td>
          <td>{{ toHumanTimestamp(props.item.addedAt).fromNow() }}</td>
        </template>
      </v-data-table>
    </div>
  </v-flex>
</template>

<script>
import queryString from "query-string";
import axios from "axios";
import moment from "moment";

export default {
  data: () => ({
    playlist: null,
    loaded: false,
    tracks: [],
    headers: [
      {
        text: "#",
        value: "index",
        width: "10px"
      },
      {
        text: "Track Name",
        align: "left",
        sortable: true,
        value: "name",
        width: "250px"
      },
      { text: "Artists", value: "artists", width: "250px" },
      { text: "Album Name", value: "album", width: "250px" },
      { text: "Popularity", value: "popularity", width: "10px" },
      { text: "Added By", value: "addedBy", width: "50px" },
      { text: "Date", value: "addedAt", width: "150px" }
    ],
    pagination: {
      rowsPerPage: -1
    }
  }),
  mounted: async function() {
    await this.getSongs();
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    toHumanTimestamp: function(date) {
      return moment(date);
    },
    getSongs: async function() {
      const playlist = (await axios.get(
        `https://api.spotify.com/v1/playlists/${this.playlistId}`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }
      )).data;
      this.loaded = true;
      this.playlist = playlist;
      this.tracks = this.playlist.tracks.items.map((item, index) => {
        return {
          index,
          id: item.track.id,
          album: item.track.album.name,
          artists: item.track.artists.map(i => i.name).join(", "),
          name: item.track.name,
          popularity: item.track.popularity,
          addedAt: item.added_at,
          addedBy: item.added_by.id
        };
      });
    }
  },
  computed: {
    playlistId: function() {
      return this.$route.params.playlistId;
    },
    accessToken: function() {
      return queryString.parse(window.location.hash).access_token;
    }
  }
};
</script>