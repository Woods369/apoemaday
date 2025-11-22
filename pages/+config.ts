import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "My Vike App",

  description: "Discover a new poem every day. Grow. Share. Inspire.",
  extends: [vikeReact, vikePhoton],
  prerender: true,
} satisfies Config;
