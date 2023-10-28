<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <img src="assets/img/jbsm-negative-180x180.png">
        </q-avatar>
        <q-toolbar-title>
          <text class="myriad-pro-regular">Jardim Botânico</text> <text class="zapf-humnst-regular">UFSM</text>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer elevated style="padding-bottomom: 50px;">
      <q-tabs switch-indicator>
        <q-route-tab name="acervo" icon="ion-filing" exact to="/collection" />
        <q-route-tab name="map" icon="ion-map" exact to="/" />
        <q-route-tab name="menu" icon="ion-menu" exact to="/menu" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout'
})
</script>

<style>
.q-header {
  height: 50px
}

.q-footer {
  height: 60px
}
</style>

