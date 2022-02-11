import VueRouter from "vue-router";
import Vue from "vue";

import Upload from "./pages/Upload";

Vue.use(VueRouter);

const routes = [
  {
    name: "upload",
    path: "/",
    component: Upload
  }
];

export default new VueRouter({
  mode: "history", // removes hash from url
  routes
});
