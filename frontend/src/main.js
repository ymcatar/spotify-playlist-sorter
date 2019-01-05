import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
Vue.config.productionTip = false;

import "./plugins/vuetify";

import App from "./App.vue";
import Authorize from "./components/Authorize";
import SelectPlaylist from "./components/SelectPlaylist";

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Authorize },
    { path: "/playlist", component: SelectPlaylist }
  ]
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
