import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
Vue.config.productionTip = false;

import "./plugins/vuetify";

import App from "./App.vue";
import Authorize from "./components/Authorize";
import SelectPlaylist from "./components/SelectPlaylist";
import SelectSort from "./components/SelectSort";

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    { path: "/playlist/:accessToken", component: SelectPlaylist },
    { path: "/sort/:accessToken/:playlistId", component: SelectSort },
    { path: "*", component: Authorize }
  ]
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
