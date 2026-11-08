<template>
  <q-page class="page-wrap q-px-md q-px-lg-xl q-py-lg">
    <div class="row items-end q-mb-lg">
      <div class="col">
        <div class="text-overline text-primary">
          RESUMEN DE TODO LO QUE NECESITAMOS SABER POR AHORA
        </div>
        <div class="text-h4 text-weight-bolder">Estadísticas</div>
      </div>
      <q-btn outline no-caps icon="storefront" label="Ver catálogo" to="/" class="gt-xs" />
    </div>
    <div class="column q-gutter-lg">
      <div class="col-12">
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
      <div class="col-12">
        <q-card flat bordered class="stats-panel full-height"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Rango de precios</div>
            <div class="text-caption text-grey-7">
              Precio promedio de los anuncios
            </div></q-card-section
          ><q-separator /><q-card-section
            ><div class="price-highlight text-center q-pa-lg">
              <q-icon name="sell" size="32px" color="primary" />
              <div class="text-overline text-grey-7 q-mt-sm">Precio promedio</div>
              <div class="text-h2 text-weight-bolder">{{ money(averagePrice) }}</div>
            </div>
            <div class="price-range q-mt-md">
              <div class="price-endpoint">
                <span class="text-caption text-grey-7">Más económico</span
                ><strong>{{ money(minPrice) }}</strong>
              </div>
              <div class="price-endpoint">
                <span class="text-caption text-grey-7">Más costoso</span
                ><strong>{{ money(maxPrice) }}</strong>
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
  border-radius: 0;
  background: #fff;
}

.stat-card {
  height: 100%;
  border-radius: 0;
}

.stats-panel {
  overflow: hidden;
}

.price-highlight {
  border-radius: 0;
  background: #fff8e2;
}

.price-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #e5e1d8;
  border-bottom: 1px solid #e5e1d8;
}

.price-endpoint {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 16px;
}

.price-endpoint + .price-endpoint {
  border-left: 1px solid #e5e1d8;
}

.price-endpoint strong {
  font-size: 1.2rem;
}

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
