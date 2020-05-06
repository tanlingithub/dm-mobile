require('dotenv').config()

const env = process.env
const isProd = env.MODE == 'prod'

// 不能以斜杠结尾
// 构建发布有bug，先写死
let apiServer = process.env.API_SERVER

const metaJson = require('./meta.json')
const materialJson = require('../../material.json')
const outputDir = `dist${metaJson.hash}`
const ossPath = `http://serverless-platform.deepexi.top/materials/${materialJson.materialId}/${outputDir}`

const publicPath = process.env.NODE_ENV === 'production' ? ossPath : ''

const config = {
  aliIconFont: '',
  env: {
    mock: {
      '/security': 'http://yapi.deepexi.io:5002/mock/934',
      '/hsp-trade-center': 'http://yapi.deepexi.io:5002/mock/907',
      '/hsp-member-center': 'http://yapi.deepexi.io:5002/mock/952'
    },
    dev: {
      '/security': 'http://yapi.deepexi.io:5002/mock/934',
      '/hsp-trade-center': 'http://101.37.158.194:8000',
      '/hsp-member-center': 'http://101.37.158.194:8000',
      '/hsp-wechat-center': 'http://101.37.158.194:8000',
      '/hsp-datastatistics-center': 'http://101.37.158.194:8000'
    }
  }
}

let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  mode: 'spa',
  env: {
    NO_LOGIN: process.env.NO_LOGIN
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta', 'auth'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  generate: {
    dir: outputDir
  },
  build: {
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      // 自带loader
      // config.module.rules.push({
      //   test: /\.(graphql|gql)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'gql-loader',
      //     options: {
      //       baseDir: `${__dirname}/src/graphql`
      //     }
      //   }
      // })
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'deepexi_CDP',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'deepexi_CDP'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png'
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
      }
    ],
    script: [
      {src: 'https://unpkg.com/js-sha1@0.6.0/src/sha1.js'},
      {src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'}
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less'
    }
  ],
  srcDir: 'src/',
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/vant'
    },
    {src: '~/plugins/filter'},
    {src: '~/plugins/components'},
    {src: '~/plugins/wechat'}
  ],
  modules: [
    ['@nuxtjs/apollo'],
    ['@nuxtjs/axios'],
    ['@nuxtjs/dotenv', {path: './'}]
  ],
  axios,
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://127.0.0.1:7001/graphql'
      }
    }
  }
}
