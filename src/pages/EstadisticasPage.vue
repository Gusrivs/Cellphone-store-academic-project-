<template>
  <q-page class="page-wrap q-px-md q-px-lg-xl q-py-lg">
    <div class="row items-end q-mb-lg">
      <div class="col">
        <div class="text-overline text-primary">RESUMEN DEL MERCADO</div>
        <div class="text-h4 text-weight-bolder">Estadísticas</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          Una vista rápida de los anuncios disponibles.
        </div>
      </div>
      <q-btn outline rounded no-caps icon="storefront" label="Ver catálogo" to="/" class="gt-xs" />
    </div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="stat in summary" :key="stat.label" class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="stat-card"
          ><q-card-section class="row items-center"
            ><q-avatar
              :color="stat.color"
              :text-color="stat.textColor"
              :icon="stat.icon" /><q-space /><q-icon
              name="trending_up"
              color="positive" /></q-card-section
          ><q-card-section class="q-pt-none"
            ><div class="text-h4 text-weight-bolder">{{ stat.value }}</div>
            <div class="text-caption text-grey-7">{{ stat.label }}</div></q-card-section
          ></q-card
        >
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="stats-panel full-height"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Anuncios por marca</div>
            <div class="text-caption text-grey-7">
              Distribución de celulares publicados
            </div></q-card-section
          ><q-separator /><q-card-section class="q-gutter-md">
            <div v-for="brand in brandStats" :key="brand.name">
              <div class="row items-center q-mb-xs">
                <span class="text-body2">{{ brand.name }}</span
                ><q-space /><span class="text-caption text-grey-7">{{ brand.count }} anuncios</span>
              </div>
              <q-linear-progress
                rounded
                size="10px"
                :value="brand.ratio"
                color="primary"
                track-color="grey-3"
              />
            </div>
            <div v-if="!brandStats.length" class="text-center text-grey-7 q-pa-lg">
              Todavía no hay anuncios para mostrar.
            </div>
          </q-card-section></q-card
        >
      </div>
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="stats-panel full-height"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Rango de precios</div>
            <div class="text-caption text-grey-7">
              Precio promedio de los anuncios
            </div></q-card-section
          ><q-separator /><q-card-section
            ><div class="price-highlight text-center q-pa-lg">
              <q-icon name="sell" size="32px" color="primary" />
              <div class="text-h3 text-weight-bolder q-mt-sm">{{ money(averagePrice) }}</div>
              <div class="text-caption text-grey-7">promedio</div>
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col">
                <q-card flat class="price-chip q-pa-md text-center"
                  ><div class="text-caption text-grey-7">Más económico</div>
                  <div class="text-subtitle1 text-weight-bold">{{ money(minPrice) }}</div></q-card
                >
              </div>
              <div class="col">
                <q-card flat class="price-chip q-pa-md text-center"
                  ><div class="text-caption text-grey-7">Más costoso</div>
                  <div class="text-subtitle1 text-weight-bold">{{ money(maxPrice) }}</div></q-card
                >
              </div>
            </div></q-card-section
          ></q-card
        >
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { loadProducts, products } from '@/stores/products'

onMounted(() => {
  loadProducts().catch((error) => {
    console.error('No se pudieron cargar los anuncios de Firebase:', error)
  })
})

const summary = computed(() => [
  {
    label: 'Anuncios activos',
    value: products.value.length,
    icon: 'sell',
    color: 'yellow-2',
    textColor: 'dark',
  },
  {
    label: 'Marcas disponibles',
    value: new Set(products.value.map((p) => p.brand)).size,
    icon: 'category',
    color: 'orange-2',
    textColor: 'dark',
  },
  {
    label: 'Celulares nuevos',
    value: products.value.filter((p) => p.condition === 'Nuevo').length,
    icon: 'auto_awesome',
    color: 'green-2',
    textColor: 'dark',
  },
  {
    label: 'Precio promedio',
    value: money(averagePrice.value),
    icon: 'payments',
    color: 'blue-2',
    textColor: 'dark',
  },
])
const brandStats = computed(() => {
  const counts = products.value.reduce((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1
    return acc
  }, {})
  const max = Math.max(1, ...Object.values(counts))
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, ratio: count / max }))
})
const averagePrice = computed(() =>
  products.value.length
    ? Math.round(
        products.value.reduce((sum, item) => sum + Number(item.price), 0) / products.value.length,
      )
    : 0,
)
const minPrice = computed(() =>
  products.value.length ? Math.min(...products.value.map((p) => Number(p.price))) : 0,
)
const maxPrice = computed(() => Math.max(0, ...products.value.map((p) => Number(p.price))))
function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style lang="scss" scoped>
.page-wrap {
  max-width: 1500px;
  margin: 0 auto;
}

.stats-panel {
  border-radius: 18px;
  background: #fff;
}

.stat-card {
  height: 100%;
  border-radius: 18px;
}

.stats-panel {
  overflow: hidden;
}

.price-highlight {
  border-radius: 16px;
  background: #fff8e2;
}

.price-chip {
  border-radius: 12px;
  background: #f8f6f0;
}

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
