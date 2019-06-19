// @flow

import type { Hero } from "../types";

export const Heroes: Hero[] = [
  { id: "saitama", name: "One punch man", photo: require("./onepunch.jpg") },
  { id: "garou", name: "Garou", photo: require("./garou.png") },
  { id: "genos", name: "Genos", photo: require("./genos.jpg") },
  { id: "silverfang", name: "Silverfang", photo: require("./silverfang.png") },
  {
    id: "metalknight",
    name: "Metal knight",
    photo: require("./metalknight.jpg")
  },
  { id: "tatsumaki", name: "Tatsumaki", photo: require("./tatsumaki.png") },
  { id: "watchdog", name: "Watchdog man", photo: require("./watchdog.png") },
  { id: "king", name: "King", photo: require("./king.jpg") },
  {
    id: "atomicsamurai",
    name: "Atomic samurai",
    photo: require("./atomicsamurai.jpg")
  },
  {
    id: "puripuri",
    name: "Puri Puri",
    photo: require("./puripuri.png")
  },
  {
    id: "metalbat",
    name: "Metal bat",
    photo: require("./metalbat.jpg")
  }
];
