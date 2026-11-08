<template>
  <q-page class="page-wrap q-px-md q-px-lg-xl q-py-lg">
    <div v-if="product">
      <q-breadcrumbs class="q-mb-lg text-grey-7"
        ><q-breadcrumbs-el label="Inicio" to="/" /><q-breadcrumbs-el
          :label="product.brand" /><q-breadcrumbs-el :label="product.model"
      /></q-breadcrumbs>
      <div class="row q-col-gutter-xl">
        <div class="col-12 col-lg-7">
          <q-card flat bordered class="gallery-card"
            ><q-img :src="activeImage" ratio="1.25" class="detail-image"
              ><template #error
                ><div class="absolute-full flex flex-center placeholder-phone">
                  <q-icon name="smartphone" size="96px" /></div></template
              ><q-btn
                round
                color="white"
                text-color="dark"
                icon="chevron_left"
                class="gallery-nav gallery-prev"
                aria-label="Foto anterior"
                @click="moveImage(-1)" /><q-btn
                round
                color="white"
                text-color="dark"
                icon="chevron_right"
                class="gallery-nav gallery-next"
                aria-label="Foto siguiente"
                @click="moveImage(1)" /></q-img
          ></q-card>
          <div class="row q-gutter-sm q-mt-sm" v-if="images.length > 1">
            <q-btn
              v-for="(image, index) in images"
              :key="image"
              flat
              dense
              class="thumbnail-btn"
              :class="{ 'thumbnail-active': activeIndex === index }"
              @click="activeIndex = index"
              ><q-img :src="image" width="72px" height="62px" fit="cover"
            /></q-btn>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <q-badge color="yellow-2" text-color="dark" rounded class="q-mb-md"
            >{{ product.condition }} · {{ product.brand }}</q-badge
          >
          <div class="text-h4 text-weight-bolder detail-title">{{ product.title }}</div>
          <div class="text-h3 text-weight-bolder text-primary q-mt-md">
            {{ money(product.price) }}
          </div>
          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              color="dark"
              text-color="white"
              unelevated
              rounded
              no-caps
              icon="shopping_cart"
              label="Agregar al carrito"
              class="col"
              @click="addToCart(product.id)"
            /><q-btn
              outline
              rounded
              no-caps
              icon="call"
              label="Llamar"
              :href="`tel:${product.phone}`"
            />
          </div>
          <q-card flat bordered class="seller-card q-mt-lg"
            ><q-card-section class="row items-center"
              ><q-avatar color="yellow-2" text-color="dark" icon="person" size="48px" />
              <div class="q-ml-md">
                <div class="text-overline text-grey-7">Vendedor</div>
                <div class="text-subtitle1 text-weight-bold">{{ product.seller }}</div>
              </div>
              <q-space /><q-btn
                flat
                round
                color="positive"
                icon="chat"
                aria-label="Contactar"
                :href="`https://wa.me/503${product.phone.replaceAll('-', '')}`"
                target="_blank" /></q-card-section
            ><q-separator /><q-card-section class="row items-center"
              ><q-icon name="phone" color="primary" /><a
                class="text-body2 text-dark q-ml-sm"
                :href="`tel:${product.phone}`"
                >{{ product.phone }}</a
              ><q-space /><q-badge
                color="green-1"
                text-color="green-9"
                label="Vendedor verificado" /></q-card-section
          ></q-card>
        </div>
      </div>
      <div class="row q-col-gutter-lg q-mt-lg">
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="detail-info-card"
            ><q-card-section
              ><div class="text-h6 text-weight-bold">Detalles del equipo</div></q-card-section
            ><q-separator /><q-list separator>
              <q-item v-for="spec in specs" :key="spec.label"
                ><q-item-section class="text-grey-7">{{ spec.label }}</q-item-section
                ><q-item-section side class="text-dark text-weight-medium">{{
                  spec.value
                }}</q-item-section></q-item
              >
            </q-list></q-card
          >
        </div>
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="detail-info-card"
            ><q-card-section
              ><div class="text-h6 text-weight-bold">Descripción</div>
              <div class="text-body1 text-grey-8 q-mt-sm description-text">
                {{ product.description }}
              </div></q-card-section
            ></q-card
          >
        </div>
      </div>
    </div>
    <q-card v-else flat bordered class="empty-state text-center q-pa-xl"
      ><q-icon name="search_off" size="56px" color="grey-5" />
      <div class="text-h6 q-mt-md">Este anuncio ya no está disponible</div>
      <q-btn
        color="dark"
        text-color="white"
        unelevated
        rounded
        no-caps
        label="Volver al catálogo"
        to="/"
        class="q-mt-md"
    /></q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { addToCart as addItemToCart, getProduct, loadProducts } from '@/stores/products'

const route = useRoute()
const $q = useQuasar()
const product = computed(() => getProduct(route.params.id))
onMounted(() => {
  if (!product.value) {
    loadProducts().catch((error) => {
      console.error('No se pudieron cargar los anuncios de Firebase:', error)
    })
  }
})
const activeIndex = ref(0)
const images = computed(() =>
  product.value
    ? product.value.images?.length
      ? product.value.images
      : [product.value.image]
    : [],
)
const activeImage = computed(() => images.value[activeIndex.value] || product.value?.image || '')
const specs = computed(() =>
  product.value
    ? [
        { label: 'Estado', value: product.value.condition },
        { label: 'Marca', value: product.value.brand },
        { label: 'Modelo', value: product.value.model },
        { label: 'Pantalla', value: `${product.value.screen} pulgadas` },
        { label: 'Sistema', value: product.value.system },
        { label: 'Almacenamiento', value: `${product.value.storage} GB` },
        { label: 'Memoria RAM', value: `${product.value.ram} GB` },
        { label: 'Color', value: product.value.color || 'No especificado' },
      ]
    : [],
)
function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
function moveImage(direction) {
  activeIndex.value = (activeIndex.value + direction + images.value.length) % images.value.length
}
function addToCart(id) {
  addItemToCart(id)
  $q.notify({
    message: 'Celular agregado al carrito',
    icon: 'shopping_cart',
    color: 'dark',
    position: 'top',
  })
}
</script>

<style lang="scss" scoped>
.page-wrap {
  max-width: 1500px;
  margin: 0 auto;
}

.detail-info-card,
.seller-card,
.gallery-card {
  border-radius: 18px;
  background: #fff;
}

.gallery-card {
  overflow: hidden;
  background: $dark-page;
}

.detail-image {
  background: $dark-page;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.gallery-prev {
  left: 16px;
}

.gallery-next {
  right: 16px;
}

.thumbnail-btn {
  padding: 3px;
  border: 2px solid transparent;
  border-radius: 9px;
  overflow: hidden;
}

.thumbnail-active {
  border-color: $accent;
}

.detail-title {
  line-height: 1.15;
}

.seller-card {
  overflow: hidden;
}

.seller-card :deep(a) {
  text-decoration: underline;
}

.detail-info-card {
  overflow: hidden;
}

.description-text {
  line-height: 1.75;
  white-space: pre-line;
}

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
