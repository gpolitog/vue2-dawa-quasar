<template>
    <q-layout ref="layout" view="hHr LpR lFF" :right-breakpoint="1100">
        <q-toolbar slot="header">
            <q-toolbar-title>
                Vue2 DAWA
                <span slot="subtitle"><br><small>For Quasar Framework</small></span>
            </q-toolbar-title>
        </q-toolbar>
        <div id="main_container" class="main">
                <vue-dawa @selectItem="selectItem"
                          v-model="addressData.oneLineAddress"
                          placeholder="Demo placeholder"
                          field-id="demo"
                          field-name="demo">
                </vue-dawa>
        </div>

        <q-toolbar slot="footer">
            <q-toolbar-title>
                Layout Footer
            </q-toolbar-title>
        </q-toolbar>
    </q-layout>
</template>

<script type="text/javascript">
import VueDawa from '../src/index.js'
import {QLayout, QToolbar, QToolbarTitle} from 'quasar-framework'
export default{
  components: {
    VueDawa,
    QLayout,
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
      addressData: {
        oneLineAddress: 'Tagensvej'
      }
    }
  },
  methods: {
    selectItem (event) {
      this.addressData = Object.assign({}, this.translateData(event))
    },
    translateData (address) {
      return {
        street: address.data.vejnavn,
        streetNumber: address.data.husnr,
        floor: address.data.etage,
        door: address.data.dør,
        zipCode: address.data.postnr,
        city: address.data.postnrnavn,
        oneLineAddress: address.tekst
      }
    }
  }
}
</script>
<style>
html, body {
  min-height: 100vh;
  height: 100%
}
#main_container {
  min-height: 100vh;
    max-width: 1024px;
    width: 100%;
    margin: auto;
    padding-top: 150px;
}
.field-container {
  margin-top: 150px;
}
footer {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>
