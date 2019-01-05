<template>
  <v-flex xs12 sm12 md12>
    <div class="display-3 font-weight-bold">Spotify Playlist Sorter</div>
    <p>
      Source code:
      <a
        href="https://github.com/ymcatar/spotify-playlist-sorter"
        target="_new"
      >https://github.com/ymcatar/spotify-playlist-sorter</a>
    </p>
    <br>
    <v-divider></v-divider>
    <br>
    <div class="font-weight-medium">
      <p>
        This is a tool (inspired by
        <a
          href="http://sortyourmusic.playlistmachinery.com/"
          target="_new"
        >Sort Your Music</a>) to sort a Spotify list according to particular attributes, e.g. BPM, Length, Popularity. Just select playlist, and sort a playlist with musical attributes.
      </p>
      <p>But first, access to your Spotify playlist data is needed. Note that the access token will be stored in your browser only.</p>
    </div>
    <v-divider></v-divider>
    <br>
    <v-btn class="confirm-btn" color="primary" @click="onClick">Grant permission</v-btn>
  </v-flex>
</template>

<script>
export default {
  methods: {
    onClick: function() {
      window.location = `https://accounts.spotify.com/authorize?client_id=${
        process.env.VUE_APP_SPOTIFY_CLIENT_KEY
      }&redirect_uri=${encodeURIComponent(
        window.location.origin + window.location.pathname
      )}playlist&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public&response_type=token&state=123`;
    }
  }
};
</script>

<style>
.v-card.theme--dark {
  border: 1px solid #555 !important;
  border-radius: 10px;
}

.v-btn.confirm-btn {
  border-radius: 20px !important;
  font-weight: bold !important;
}
</style>