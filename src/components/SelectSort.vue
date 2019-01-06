<template>
  <v-flex xs12 sm12 md12>
    <div v-if="!loaded">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="loaded">
      <!-- confirm button -->
      <v-btn color="primary" @click="submit" dark fixed bottom right fab>
        <v-icon v-if="!updating">check</v-icon>
        <v-progress-circular v-if="updating" indeterminate color="white"></v-progress-circular>
      </v-btn>
      <div class="display-3 font-weight-bold">
        <a @click="goBack">←</a>&nbsp;
        Select a sort order
      </div>
      <br>
      <v-divider></v-divider>
      <br>
      <div class="headline">
        <v-avatar v-if="playlist.images.length > 0">
          <img :src="playlist.images[0].url">
        </v-avatar>&nbsp;
        <span class="font-weight-bold">{{playlist.name}}</span>
      </div>
      <br>
      <v-divider></v-divider>
      <br>
      <p>Click the table header to apply your sorting and hit the confirm button in the bottom right corner.</p>
      <ul>
        <li>
          <b>Acousticness:</b> the higher the value, the more acoustic the track is;
        </li>
        <li>
          <b>Dancability:</b> the higher the value, the more danceable the track is (i.e. higher beat strength, rhythm stability, etc.);
        </li>
        <li>
          <b>Energy:</b> the higher the value, the more intense / noisy / loud the track is;
        </li>
        <li>
          <b>Instrumentalness:</b> the higher the value, the more vocal content the track has ("ooh" and "aah" sounds are exclued);
        </li>
        <li>
          <b>Liveness:</b> the higher the value, the more likely the track is a live recording;
        </li>
        <li>
          <b>Valence:</b> the higher the value, the more postive the modd the track is (i.e. happy, cheerful, etc);
        </li>
      </ul>
      <br>You might need to scroll the table horizontally to see all the columns.
      <br>
      <br>
      <track-table :items="tracks" :pagination.sync="pagination"></track-table>
    </div>
  </v-flex>
</template>

<script>
import _ from "lodash";
import axios from "axios";

import TrackTable from "./TrackTable";

// source: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

export default {
  components: { TrackTable },
  data: () => ({
    playlist: null,
    loaded: false,
    updating: false,
    tracks: [],
    pagination: {}
  }),
  mounted: async function() {
    await this.getSongs();
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    getSongs: async function() {
      try {
        // get the playlist from Spotify
        let playlist = (playlist = (await axios.get(
          `https://api.spotify.com/v1/playlists/${this.playlistId}`,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        )).data);
        // get the tracks page by page
        let tracks = playlist.tracks;
        while (tracks.next) {
          tracks = (await axios.get(tracks.next, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          })).data;
          playlist.tracks.items = playlist.tracks.items.concat(tracks.items);
        }
        // done
        this.loaded = true;
        this.playlist = playlist;
        this.tracks = this.playlist.tracks.items.map((item, index) => {
          return {
            index,
            metadata: {
              id: item.track.id,
              album: item.track.album.name,
              artists: item.track.artists.map(i => i.name).join(", "),
              name: item.track.name,
              releaseDate: item.track.album.release_date,
              addedAt: item.added_at,
              addedBy: item.added_by.id
            },
            features: {}
          };
        });
        // get audio features for all the tracks in the playlist
        // one query can have at most 100 ids only, so partition the track ids by 100
        const requestsParam = _.chunk(
          this.tracks.map(({ metadata: { id } }) => id),
          100
        );
        let tracksWithFeatures = await Promise.all(
          requestsParam.map(ids =>
            axios.get(`https://api.spotify.com/v1/audio-features`, {
              headers: { Authorization: `Bearer ${this.accessToken}` },
              params: { ids: ids.join(",") }
            })
          )
        );
        tracksWithFeatures = _.flatten(
          tracksWithFeatures.map(i => i.data.audio_features)
        ); // flatten the response
        // merge the feature info to the tracks
        tracksWithFeatures.forEach((item, i) => {
          this.tracks[i].features = _(item)
            .pick([
              "acousticness",
              "danceability",
              "energy",
              "instrumentalness",
              "liveness",
              "valence"
            ])
            .mapValues(i => parseFloat((i * 100).toFixed(1)))
            .merge({
              duration_ms: item["duration_ms"],
              tempo: parseInt(item["tempo"])
            })
            .value();
        });
      } catch (e) {
        alert("Unexpected problem, please try again.");
        this.$router.push("/");
      }
    },
    submit: async function() {
      try {
        this.updating = true;
        const { sortBy, descending } = this.pagination;
        // gather all the ids
        const currTrackIds = this.tracks.map(i => i.metadata.id);
        const newTrackIds = _.clone(this.tracks)
          .sort((a, b) => {
            a = _.get(a, sortBy);
            b = _.get(b, sortBy);
            if (_.isString(a)) {
              return descending ? b.localeCompare(a) : b.localeCompare(a);
            } else {
              return descending ? b - a : a - b;
            }
          })
          .map(i => i.metadata.id);
        // gather all the deltas
        let todoIds = _.clone(newTrackIds);
        let lastSnapshotId = null;

        while (todoIds.length > 0) {
          // pop one delta from the stack
          const id = todoIds.shift();
          const oldPos = currTrackIds.indexOf(id);
          const newPos = newTrackIds.indexOf(id);
          // move the item from oldPos to newPos in the local copy
          if (oldPos != newPos) {
            array_move(currTrackIds, oldPos, newPos);
            // commit the change to the acutal playlist
            const body = {
              range_start: oldPos,
              range_length: 1,
              insert_before: newPos
            };
            if (lastSnapshotId) {
              body.lastSnapshotId = lastSnapshotId;
            }
            lastSnapshotId = (await axios.put(
              `https://api.spotify.com/v1/playlists/${this.playlistId}/tracks`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${this.accessToken}`,
                  "Content-Type": "application/json"
                }
              }
            )).data["snapshot_id"];
          }
        }
        // refresh the playlist
        await this.getSongs();
        this.updating = false;
      } catch (e) {
        alert("Unexpected problem, please try again.");
        this.$router.push("/");
      }
    }
  },
  computed: {
    playlistId: function() {
      return this.$route.params.playlistId;
    },
    accessToken: function() {
      return this.$route.params.accessToken;
    }
  }
};
</script>
