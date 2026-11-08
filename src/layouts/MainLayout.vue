<template>
  <q-layout view="hHh Lpr lff" class="app-shell">
    <q-header class="app-header text-dark">
      <q-toolbar class="site-toolbar q-px-md q-px-lg-xl">
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="lt-md"
          aria-label="Abrir menú"
          @click="drawerOpen = !drawerOpen"
        />
        <router-link to="/" class="brand-link row items-center no-wrap">
          <q-avatar rounded color="primary" text-color="dark" icon="handshake" size="50px" />
          <span class="q-ml-sm text-h6 text-weight-bolder brand-name">eBay rt24007</span>
        </router-link>
        <q-input
          v-model="search"
          dense
          outlined
          rounded
          clearable
          placeholder="Que buscaba joven..."
          class="header-search q-ml-lg gt-sm"
          @update:model-value="updateSearch"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <q-space />
        <div class="row items-center q-gutter-xs gt-sm">
          <q-btn flat no-caps label="Inicio" to="/" />
          <q-btn flat no-caps label="Estadísticas" to="/estadisticas" />
          <q-btn
            color="primary"
            text-color="dark"
            unelevated
            rounded
            no-caps
            icon="add"
            label="Publicar anuncio"
            to="/nuevo"
            class="q-ml-sm"
          />
        </div>
        <q-btn
          flat
          round
          icon="shopping_cart"
          aria-label="Carrito"
          class="q-ml-sm"
          @click="cartOpen = true"
        >
          <q-badge v-if="cartCount" color="dark" text-color="white" floating>{{
            cartCount
          }}</q-badge>
        </q-btn>
      </q-toolbar>
      <q-toolbar class="lt-md q-pt-none q-pb-sm"
        ><q-input
          v-model="search"
          dense
          outlined
          rounded
          clearable
          placeholder="Buscar celulares..."
          class="full-width"
          @update:model-value="updateSearch"
          ><template #prepend><q-icon name="search" /></template></q-input
      ></q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" bordered :breakpoint="900" class="drawer-panel">
      <div class="q-pa-md">
        <div class="text-overline text-grey-7">MENÚ</div>
        <q-list padding>
          <q-item clickable v-ripple to="/" exact active-class="nav-active"
            ><q-item-section avatar><q-icon name="storefront" /></q-item-section
            ><q-item-section>Inicio</q-item-section></q-item
          >
          <q-item clickable v-ripple to="/nuevo" active-class="nav-active"
            ><q-item-section avatar><q-icon name="add_circle_outline" /></q-item-section
            ><q-item-section>Nuevo anuncio</q-item-section></q-item
          >
          <q-item clickable v-ripple to="/estadisticas" active-class="nav-active"
            ><q-item-section avatar><q-icon name="query_stats" /></q-item-section
            ><q-item-section>Estadísticas</q-item-section></q-item
          >
        </q-list>
        <q-separator spaced />
      </div>
    </q-drawer>

    <q-page-container><router-view /></q-page-container>

    <q-dialog v-model="cartOpen" position="right">
      <q-card class="cart-card"
        ><q-card-section class="row items-center">
          <div class="text-h6">Mi carrito</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup
        /></q-card-section>
        <q-separator />
        <q-card-section v-if="cartCount" class="text-body2">
          Tienes {{ cartCount }} {{ cartCount === 1 ? 'celular' : 'celulares' }} en tu carrito.
          <div class="text-caption text-grey-7 q-mt-sm">
            <!-- Boton para vaciar carrito -->
            <q-btn flat color="positive" label="Comprar" @click="comprar" />
          </div>
        </q-card-section>
        <q-card-section v-else class="text-center text-grey-7 q-py-xl"
          ><q-icon name="shopping_cart" size="40px" class="q-mb-sm" />
          <div>Tu carrito está vacío</div></q-card-section
        >
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cart } from '@/stores/products'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const drawerOpen = ref(false)
const cartOpen = ref(false)
const search = ref(String(route.query.q || ''))
const cartCount = computed(() => cart.value.length)
let searchTimer
watch(
  () => route.query.q,
  (value) => {
    search.value = String(value || '')
  },
)
function updateSearch(value) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const query = { ...route.query }
    if (value?.trim()) query.q = value.trim()
    else delete query.q
    router.replace({ query })
  }, 250)
}

function comprar() {
  cart.value = []

  $q.notify({
    type: 'negative',
    message: '¡Felicidades, usted ha sido estafado!',
    position: 'top-right',
    timeout: 3000,
  })
}
</script>

<style lang="scss" scoped>
.app-shell {
  background: #faf9f6;
}

.app-header {
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #eee9dc;
}

.site-toolbar {
  min-height: 72px;
  max-width: 1600px;
  margin: 0 auto;
}

.brand-link {
  color: $dark;
}

.brand-name {
  letter-spacing: -0.5px;
}

.header-search {
  width: min(390px, 32vw);
}

.drawer-panel {
  background: #fff;
}

.nav-active {
  background: #fff6da;
  color: $dark;
  font-weight: 700;
}

.cart-card {
  width: min(390px, 92vw);
  height: 100%;
}

@media (max-width: 599px) {
  .site-toolbar {
    min-height: 62px;
  }
}

@media (max-width: 599px) {
  .brand-name {
    font-size: 19px;
  }
}
</style>
