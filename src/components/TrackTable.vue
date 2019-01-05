<template>
  <v-data-table
    :pagination.sync="pagination"
    :headers="headers"
    :items="items"
    class="elevation-1"
    must-sort
    hide-actions
    @update:pagination="onChange"
  >
    <template slot="items" slot-scope="props">
      <td>
        <b>{{ props.item.index + 1 }}</b>
      </td>
      <!-- metadata start -->
      <td>{{ props.item.metadata.addedBy }}</td>
      <td>{{ toHumanTimestamp(props.item.metadata.addedAt).format('ll') }}</td>
      <td>
        <b>{{ props.item.metadata.name }}</b>
      </td>
      <td>{{ props.item.metadata.artists }}</td>
      <!-- <td>{{ props.item.metadata.album }}</td> -->
      <!-- metadata end -->
      <!-- feature start -->
      <td class="text-xs-right">{{ toHumanDuration(props.item.features.duration_ms) }}</td>
      <td class="text-xs-right">{{ props.item.features.acousticness }}</td>
      <td class="text-xs-right">{{ props.item.features.danceability }}</td>
      <td class="text-xs-right">{{ props.item.features.energy }}</td>
      <!-- <td class="text-xs-right">{{ props.item.features.instrumentalness }}</td> -->
      <td class="text-xs-right">{{ props.item.features.liveness }}</td>
      <td class="text-xs-right">{{ props.item.features.tempo }}</td>
      <td class="text-xs-right">{{ props.item.features.valence }}</td>
      <!-- feature end -->
    </template>
  </v-data-table>
</template>

<script>
import _ from "lodash";
import moment from "moment";

export default {
  name: "track-table",
  props: ["items"],
  data: () => ({
    pagination: {
      rowsPerPage: -1
    },
    headers: [
      {
        text: "#",
        value: "metadata.index"
      },
      { text: "Added by", value: "metadata.addedBy" },
      { text: "Date", value: "metadata.addedAt" },
      {
        text: "Track Name",
        align: "left",
        sortable: true,
        value: "metadata.name"
      },
      // metadata
      { text: "Artists", value: "metadata.artists" },
      // { text: "Album Name", value: "metadata.album" },
      // features
      { text: "Duration", value: "features.duration_ms", align: "right" },
      { text: "Acousticness", value: "features.acousticness", align: "right" },
      { text: "Danceability", value: "features.danceability", align: "right" },
      { text: "Energy", value: "features.energy", align: "right" },
      // { text: "Instrumentalness", value: "features.instrumentalness", align: "right" },
      { text: "Liveness", value: "features.liveness", align: "right" },
      { text: "Tempo", value: "features.tempo", align: "right" },
      { text: "Valence", value: "features.valence", align: "right" }
    ]
  }),
  methods: {
    toHumanTimestamp: function(date) {
      return moment(date);
    },
    toHumanDuration: function(ms) {
      const seconds = Math.trunc(ms / 1000);
      return `${Math.trunc(seconds / 60)}:${_.padStart(seconds % 60, 2, "0")}`;
    },
    onChange: function(pagination) {
      this.$emit("update:pagination", pagination);
    }
  }
};
</script>

<style>
td,
th {
  padding: 0 5px 0 5px !important;
  height: 30px !important;
}
</style>