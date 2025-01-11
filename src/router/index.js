import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Home2View from "@/views/Home2View.vue";
import Home3View from "@/views/Home3View.vue";
import Home4View from "@/views/Home4View.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home3View,
  },
  {
    path: "/home2",
    name: "home2",
    component: Home2View,
  },
  {
    path: "/home3",
    name: "home3",
    component: HomeView,
  },
  {
    path: "/home4",
    name: "home34",
    component: Home4View,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
