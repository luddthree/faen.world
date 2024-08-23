import {env} from 'node:process'
import dotenv from 'dotenv'
dotenv.config()
import { defineNuxtConfig } from 'nuxt/config'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss', "@vueuse/nuxt"
    // '@nuxtjs/tailwindcss', "@vueuse/nuxt", "@sidebase/nuxt-auth"
  ],
//   auth: {
//     provider: {
//         type: 'authjs'
//     }
// },
  
  ssr: false,

  runtimeConfig: {
    public: {
      gtagId: "G-Y9KX1S739M",
    },
    OPENAI_API_KEY: "",
    databaseFilePath: env.DATABASE_PATH,
  },

  devtools: { enabled: true }
  
})


