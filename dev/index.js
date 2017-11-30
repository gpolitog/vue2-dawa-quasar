require(`quasar-framework/dist/quasar.mat.css`)

import Vue from 'vue'
import Quasar from 'quasar-framework'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework

require('quasar-extras/roboto-font')

import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: h => h(require('./App').default)
  })
})
