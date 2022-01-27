import VueRouter from "vue-router";
import Vue from "vue";

import Home from "./pages/Home";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  }
];

export default new VueRouter({
  mode: "history", // removes hash from url
  routes
});
