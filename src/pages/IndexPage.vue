<template>
  <q-page class="page-wrap q-px-md q-px-lg-xl q-py-lg">
    <section class="hero-panel q-pa-lg q-pa-md-xl q-mb-lg">
      <div class="row items-center">
        <div class="col-12 col-md-7">
          <q-badge color="dark" text-color="white" rounded class="q-mb-md q-px-sm q-py-xs"
            >COMPRA Y VENDE CON CONFIANZA</q-badge
          >
          <div class="text-h3 text-weight-bolder hero-title">
            Tu próximo celular<br class="gt-xs" />
            está aquí.
          </div>
          <div class="text-subtitle1 q-mt-md text-grey-8">
            Encuentra buenas opciones cerca de ti o publica tu anuncio gratis.
          </div>
          <q-btn
            unelevated
            rounded
            color="dark"
            text-color="white"
            no-caps
            label="Explorar celulares"
            icon-right="arrow_downward"
            class="q-mt-lg"
            @click="scrollToCatalog"
          />
        </div>
        <div class="col-12 col-md-5 gt-sm hero-art">
          <div class="hero-orbit orbit-one"></div>
          <div class="hero-orbit orbit-two"></div>
          <q-icon name="smartphone" class="hero-phone" />
        </div>
      </div>
    </section>

    <div id="catalog" class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5 text-weight-bold">Celulares disponibles</div>
        <div class="text-caption text-grey-7">
          {{ filteredProducts.length }} anuncios encontrados
        </div>
      </div>
      <q-btn
        outline
        rounded
        no-caps
        icon="tune"
        label="Filtros"
        class="lt-md"
        @click="filtersOpen = true"
      />
    </div>

    <div class="row q-col-gutter-lg">
      <aside class="col-12 col-md-3 col-lg-2 gt-sm">
        <q-card flat bordered class="filter-card"
          ><q-card-section class="row items-center"
            ><div class="text-subtitle1 text-weight-bold">Filtros</div>
            <q-space /><q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Limpiar"
              @click="resetFilters" /></q-card-section
          ><q-separator /><q-card-section>
            <div class="filter-label">Estado</div>
            <q-option-group
              v-model="filters.condition"
              :options="conditionOptions"
              type="checkbox"
              color="primary"
              dense
            />
            <q-separator spaced />
            <div class="filter-label">Marca</div>
            <q-option-group
              v-model="filters.brand"
              :options="brandOptions"
              type="checkbox"
              color="primary"
              dense
            />
            <q-separator spaced />
            <div class="filter-label">Sistema</div>
            <q-option-group
              v-model="filters.system"
              :options="systemOptions"
              type="checkbox"
              color="primary"
              dense
            />
            <q-separator spaced />
            <div class="filter-label q-mb-sm">Precio máximo</div>
            <q-slider
              v-model="filters.maxPrice"
              :min="50"
              :max="1000"
              :step="10"
              label
              color="primary"
              :label-value="`$${filters.maxPrice}`"
            />
            <div class="row justify-between text-caption text-grey-7">
              <span>$50</span><span>$1,000+</span>
            </div>
          </q-card-section></q-card
        >
      </aside>

      <div class="col-12 col-md-9 col-lg-10">
        <q-card flat bordered class="sort-bar q-mb-md"
          ><q-card-section class="row items-center q-gutter-sm"
            ><div class="text-caption text-grey-7 gt-xs">Ordenar por</div>
            <q-select
              v-model="sortBy"
              dense
              outlined
              options-dense
              :options="sortOptions"
              emit-value
              map-options
              class="sort-select" /><q-space />
            <div class="text-caption text-grey-7 gt-xs">Mostrar</div>
            <q-select
              v-model="perPage"
              dense
              outlined
              options-dense
              :options="[8, 12, 24]"
              class="per-page-select" /></q-card-section
        ></q-card>

        <div v-if="pageProducts.length" class="product-grid">
          <q-card
            v-for="product in pageProducts"
            :key="product.id"
            flat
            bordered
            class="product-card cursor-pointer"
            @click="openProduct(product.id)"
          >
            <div class="product-image-wrap">
              <q-img :src="product.image" ratio="1.25" class="product-image"
                ><template #error
                  ><div class="absolute-full flex flex-center placeholder-phone">
                    <q-icon name="smartphone" size="64px" /></div></template></q-img
              ><q-badge floating color="white" text-color="dark" class="condition-badge">{{
                product.condition
              }}</q-badge
              ><q-btn
                round
                dense
                color="white"
                text-color="dark"
                icon="favorite_border"
                class="favorite-btn"
                aria-label="Guardar favorito"
                @click.stop="favorite(product.title)"
              />
            </div>
            <q-card-section class="q-px-md q-pt-md q-pb-sm"
              ><div class="text-h6 text-weight-bolder text-primary">{{ money(product.price) }}</div>
              <div class="product-title text-weight-medium q-mt-xs">{{ product.title }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ product.storage }} GB · {{ product.ram }} GB RAM · {{ product.color }}
              </div>
              <div class="row items-center q-mt-md">
                <q-icon name="place" size="16px" color="grey-6" /><span
                  class="text-caption text-grey-7 q-ml-xs"
                  >El Salvador</span
                ><q-space /><span class="text-caption text-grey-6">{{ product.createdAt }}</span>
              </div></q-card-section
            >
          </q-card>
        </div>
        <q-card v-else flat bordered class="empty-state text-center q-pa-xl"
          ><q-icon name="search_off" size="52px" color="grey-5" />
          <div class="text-h6 q-mt-md">No encontramos celulares</div>
          <div class="text-body2 text-grey-7">Prueba con otros filtros o cambia tu búsqueda.</div>
          <q-btn
            flat
            color="primary"
            no-caps
            label="Limpiar filtros"
            class="q-mt-sm"
            @click="resetFilters"
        /></q-card>

        <div v-if="filteredProducts.length" class="row justify-center q-mt-xl">
          <q-pagination
            v-model="currentPage"
            :max="maxPages"
            direction-links
            boundary-links
            color="primary"
            active-color="dark"
            active-text-color="white"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="filtersOpen" position="right"
      ><q-card class="mobile-filter-card"
        ><q-card-section class="row items-center"
          ><div class="text-h6">Filtros</div>
          <q-space /><q-btn flat round dense icon="close" v-close-popup /></q-card-section
        ><q-separator /><q-card-section>
          <div class="filter-label">Estado</div>
          <q-option-group
            v-model="filters.condition"
            :options="conditionOptions"
            type="checkbox"
            color="primary"
            dense
          /><q-separator spaced />
          <div class="filter-label">Marca</div>
          <q-option-group
            v-model="filters.brand"
            :options="brandOptions"
            type="checkbox"
            color="primary"
            dense
          /><q-separator spaced />
          <div class="filter-label">Sistema</div>
          <q-option-group
            v-model="filters.system"
            :options="systemOptions"
            type="checkbox"
            color="primary"
            dense
          /><q-separator spaced />
          <div class="filter-label q-mb-sm">Precio máximo: ${{ filters.maxPrice }}</div>
          <q-slider
            v-model="filters.maxPrice"
            :min="50"
            :max="1000"
            :step="10"
            label
            color="primary"
          />
          <q-btn
            color="dark"
            text-color="white"
            unelevated
            rounded
            no-caps
            label="Ver resultados"
            class="full-width q-mt-lg"
            v-close-popup
          /><q-btn
            flat
            color="primary"
            no-caps
            label="Limpiar filtros"
            class="full-width q-mt-xs"
            @click="resetFilters"
          /> </q-card-section></q-card
    ></q-dialog>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '@/stores/products'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const filtersOpen = ref(false)
const filters = reactive({ condition: [], brand: [], system: [], maxPrice: 1000 })
const sortBy = ref('newest')
const perPage = ref(8)
const currentPage = ref(1)
const conditionOptions = ['Nuevo', 'Usado'].map((label) => ({ label, value: label }))
const brandOptions = ['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Motorola', 'Nokia'].map((label) => ({
  label,
  value: label,
}))
const systemOptions = ['Android', 'iOS', 'HarmonyOS'].map((label) => ({ label, value: label }))
const sortOptions = [
  { label: 'Más recientes', value: 'newest' },
  { label: 'Menor precio', value: 'price-asc' },
  { label: 'Mayor precio', value: 'price-desc' },
]
const filteredProducts = computed(() => {
  const query = String(route.query.q || '').toLocaleLowerCase('es')
  const result = products.value.filter((product) => {
    const matchesQuery =
      !query ||
      `${product.title} ${product.brand} ${product.model}`.toLocaleLowerCase('es').includes(query)
    return (
      matchesQuery &&
      product.price <= filters.maxPrice &&
      (!filters.condition.length || filters.condition.includes(product.condition)) &&
      (!filters.brand.length || filters.brand.includes(product.brand)) &&
      (!filters.system.length || filters.system.includes(product.system))
    )
  })
  if (sortBy.value === 'price-asc') result.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-desc') result.sort((a, b) => b.price - a.price)
  else result.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  return result
})
const maxPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / Number(perPage.value))),
)
const pageProducts = computed(() =>
  filteredProducts.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value,
  ),
)
watch([filteredProducts, perPage], () => {
  currentPage.value = 1
})
function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
function resetFilters() {
  filters.condition = []
  filters.brand = []
  filters.system = []
  filters.maxPrice = 1000
}
function openProduct(id) {
  router.push(`/producto/${id}`)
}
function favorite(title) {
  $q.notify({
    message: `${title} guardado en favoritos`,
    icon: 'favorite',
    color: 'dark',
    position: 'top',
  })
}
function scrollToCatalog() {
  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.page-wrap {
  max-width: 1500px;
  margin: 0 auto;
}

.hero-panel {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  border-radius: 28px;
  background: linear-gradient(120deg, #fff0b5 0%, #ffdc6a 53%, #f7c43e 100%);
}

.hero-title {
  line-height: 1.08;
  letter-spacing: -1.5px;
}

.hero-art {
  min-height: 225px;
  position: relative;
}

.hero-orbit {
  position: absolute;
  border: 1px solid rgba(70, 54, 10, 0.16);
  border-radius: 50%;
}

.orbit-one {
  width: 330px;
  height: 230px;
  right: 10%;
  top: 0;
  transform: rotate(-28deg);
}

.orbit-two {
  width: 260px;
  height: 340px;
  right: 22%;
  top: -35px;
  transform: rotate(38deg);
}

.hero-phone {
  position: absolute;
  font-size: 230px;
  right: 24%;
  top: -10px;
  color: #342d1c;
  filter: drop-shadow(20px 18px 0 rgba(80, 59, 4, 0.13));
  transform: rotate(8deg);
}

.filter-card,
.sort-bar {
  border-radius: 18px;
  background: #fff;
}

.filter-card {
  position: sticky;
  top: 92px;
}

.filter-label {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
}

.sort-select {
  width: 175px;
}

.per-page-select {
  width: 82px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.product-card {
  overflow: hidden;
  border-radius: 17px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(43, 37, 17, 0.1);
}

.product-image-wrap {
  position: relative;
  background: $dark-page;
}

.product-image {
  background: $dark-page;
}

.product-image :deep(.q-img__image) {
  transition: transform 0.35s ease;
}

.product-card:hover :deep(.q-img__image) {
  transform: scale(1.04);
}

.condition-badge {
  top: 12px;
  left: 12px;
  right: auto;
  padding: 6px 9px;
  font-weight: 700;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 2px 8px #0002;
}

.product-title {
  min-height: 44px;
  line-height: 1.35;
}

.placeholder-phone {
  background: linear-gradient(145deg, #f8f4e9, #ece4d2);
  color: #c8b579;
}

.empty-state {
  border-radius: 20px;
}

.mobile-filter-card {
  width: min(390px, 92vw);
  height: 100%;
  border-radius: 18px 0 0 18px;
}

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 599px) {
  .hero-panel {
    min-height: 250px;
    border-radius: 20px;
  }
}

@media (max-width: 599px) {
  .hero-title {
    font-size: 34px;
  }
}

@media (max-width: 599px) {
  .product-grid {
    gap: 10px;
  }
}

@media (max-width: 599px) {
  .product-card {
    border-radius: 13px;
  }
}

@media (max-width: 599px) {
  .product-card :deep(.q-card__section) {
    padding-left: 10px;
    padding-right: 10px;
  }
}

@media (max-width: 599px) {
  .product-title {
    font-size: 14px;
    min-height: 38px;
  }
}

@media (max-width: 599px) {
  .sort-bar :deep(.q-card__section) {
    padding: 10px;
  }
}
</style>
