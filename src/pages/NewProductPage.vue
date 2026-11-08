<template>
  <q-page class="page-wrap q-px-md q-px-lg-xl q-py-lg">
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" aria-label="Volver" to="/" />
      <div class="q-ml-sm">
        <div class="text-overline text-primary">VENTA SEGURA Y SENCILLA</div>
        <div class="text-h4 text-weight-bolder">Publica tu celular</div>
      </div>
    </div>
    <q-form ref="formRef" class="row q-col-gutter-lg" @submit="submitForm">
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="form-card"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Información del equipo</div> </q-card-section
          ><q-separator /><q-card-section class="q-gutter-y-md">
            <q-input
              v-model="form.title"
              outlined
              label="Título del anuncio *"
              hint="Ej. Samsung Galaxy S22, 128 GB"
              maxlength="80"
              counter
              :rules="[required, (v) => v?.length >= 5 || 'Escribe al menos 5 caracteres']"
            />
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.brand"
                  outlined
                  emit-value
                  map-options
                  label="Marca *"
                  :options="brandOptions"
                  :rules="[required]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="form.model" outlined label="Modelo *" :rules="[required]" />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.system"
                  outlined
                  emit-value
                  map-options
                  label="Sistema operativo *"
                  :options="systemOptions"
                  :rules="[required]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="form.screen"
                  outlined
                  type="number"
                  label="Pantalla (pulgadas) *"
                  suffix="pulg."
                  min="3"
                  max="9"
                  :rules="[required, (v) => (v >= 3 && v <= 9) || 'Ingresa un valor entre 3 y 9']"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model.number="form.storage"
                  outlined
                  type="number"
                  label="Almacenamiento *"
                  suffix="GB"
                  min="8"
                  :rules="[required, positive]"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model.number="form.ram"
                  outlined
                  type="number"
                  label="Memoria RAM *"
                  suffix="GB"
                  min="1"
                  :rules="[required, positive]"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input v-model="form.color" outlined label="Color" />
              </div>
            </div>
            <div>
              <div class="text-subtitle2 text-weight-medium q-mb-xs">Estado del equipo *</div>
              <q-option-group
                v-model="form.condition"
                :options="conditionOptions"
                type="radio"
                inline
                color="primary"
              />
            </div>
            <q-input
              v-model="form.description"
              outlined
              type="textarea"
              label="Descripción *"
              autogrow
              maxlength="700"
              counter
              hint="Incluye detalles del estado, accesorios y cualquier observación."
              :rules="[required, (v) => v?.length >= 20 || 'Escribe al menos 20 caracteres']"
            /> </q-card-section
        ></q-card>

        <q-card flat bordered class="form-card q-mt-lg"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Fotos del celular</div>
            <div class="text-caption text-grey-7">
              Puedes preparar hasta 4 fotos. El guardado de imágenes se conectará en el siguiente
              paso.
            </div></q-card-section
          ><q-separator /><q-card-section>
            <q-file
              v-model="pickerFiles"
              outlined
              multiple
              use-chips
              accept="image/*"
              max-files="4"
              max-file-size="500000"
              max-total-size="2000000"
              label="Seleccionar fotos"
              hint="JPG o PNG. Máximo 4 imágenes y 500 KB por foto."
              @update:model-value="addSelectedFiles"
              ><template #prepend><q-icon name="add_photo_alternate" /></template
            ></q-file>
            <div v-if="previews.length" class="q-mt-md mobile-photo-carousel">
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-caption text-grey-7">
                  Foto {{ activePhoto + 1 }} de {{ previews.length }}
                </div>
                <div class="row items-center q-gutter-xs">
                  <q-btn
                    v-if="previews.length > 1"
                    flat
                    round
                    dense
                    icon="chevron_left"
                    color="dark"
                    aria-label="Foto anterior"
                    @click="movePhoto(-1)"
                  />
                  <q-btn
                    v-if="previews.length > 1"
                    flat
                    round
                    dense
                    icon="chevron_right"
                    color="dark"
                    aria-label="Foto siguiente"
                    @click="movePhoto(1)"
                  />
                </div>
              </div>
              <q-carousel
                v-model="activePhoto"
                animated
                swipeable
                control-color="white"
                class="photo-carousel"
              >
                <q-carousel-slide
                  v-for="(preview, index) in previews"
                  :key="preview"
                  :name="index"
                  class="q-pa-none"
                >
                  <q-img :src="preview" fit="contain" class="carousel-photo" />
                  <q-btn
                    type="button"
                    round
                    dense
                    color="white"
                    text-color="negative"
                    icon="close"
                    size="sm"
                    class="absolute-top-right q-ma-sm photo-delete-button"
                    :aria-label="`Quitar foto ${index + 1}`"
                    @pointerdown.stop
                    @touchstart.stop
                    @click.stop.prevent="removeImage(index)"
                  />
                </q-carousel-slide>
              </q-carousel>
              <div v-if="previews.length > 1" class="row justify-center q-gutter-x-xs q-mt-sm">
                <q-btn
                  v-for="(preview, index) in previews"
                  :key="`dot-${preview}`"
                  round
                  dense
                  unelevated
                  :color="activePhoto === index ? 'primary' : 'grey-4'"
                  class="photo-dot"
                  :aria-label="`Ver foto ${index + 1}`"
                  @click="activePhoto = index"
                />
              </div>
            </div>
            <div v-if="previews.length" class="row q-col-gutter-sm q-mt-md desktop-photo-grid">
              <div v-for="(preview, index) in previews" :key="preview" class="col-6 col-sm-3">
                <div class="preview-image-wrap">
                  <q-img :src="preview" ratio="1" class="preview-image" />
                  <q-btn
                    type="button"
                    round
                    dense
                    color="white"
                    text-color="negative"
                    icon="close"
                    size="sm"
                    class="preview-delete-button"
                    :aria-label="`Quitar foto ${index + 1}`"
                    @pointerdown.stop
                    @touchstart.stop
                    @click.stop.prevent="removeImage(index)"
                  />
                </div>
              </div>
            </div> </q-card-section
        ></q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card flat bordered class="form-card sticky-card"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Precio y contacto</div> </q-card-section
          ><q-separator /><q-card-section class="q-gutter-y-md">
            <q-input
              v-model.number="form.price"
              outlined
              type="number"
              label="Precio *"
              prefix="$"
              min="1"
              step="0.01"
              :rules="[
                required,
                positive,
                (v) => v <= 1500 || 'Ingresa un valor menor o igual a 1,500',
              ]"
            />
            <q-input
              v-model="form.seller"
              outlined
              label="Nombre del vendedor *"
              :rules="[required]"
            />
            <q-input
              v-model="form.phone"
              outlined
              type="tel"
              label="Teléfono *"
              mask="####-####"
              hint="Número de 8 dígitos"
              :rules="[
                required,
                (v) => /^\d{4}-\d{4}$/.test(v || '') || 'Usa el formato 7000-0000',
              ]"
              ><template #prepend><q-icon name="phone" /></template
            ></q-input>
            <q-separator spaced />
            <div class="column q-gutter-sm q-mt-md">
              <q-btn
                type="submit"
                color="dark"
                text-color="white"
                unelevated
                rounded
                no-caps
                size="lg"
                label="Publicar anuncio"
                icon-right="arrow_forward"
                :loading="saving"
              /><q-btn flat color="grey-8" rounded no-caps label="Cancelar" to="/" />
            </div> </q-card-section
        ></q-card>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { addProduct } from '@/stores/products'

const router = useRouter()
const $q = useQuasar()
const formRef = ref(null)
const files = ref([])
const pickerFiles = ref([])
const previews = ref([])
const activePhoto = ref(0)
const saving = ref(false)
const form = reactive({
  title: '',
  brand: null,
  model: '',
  system: null,
  screen: null,
  storage: null,
  ram: null,
  color: '',
  condition: 'Usado',
  description: '',
  price: null,
  seller: '',
  phone: '',
})
const brandOptions = ['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Motorola', 'Nokia', 'Otra'].map(
  (label) => ({ label, value: label }),
)
const systemOptions = ['Android', 'iOS', 'HarmonyOS', 'Otro'].map((label) => ({
  label,
  value: label,
}))
const conditionOptions = [
  { label: 'Nuevo', value: 'Nuevo' },
  { label: 'Usado', value: 'Usado' },
]
const required = (value) =>
  (value !== null && value !== undefined && String(value).trim() !== '') ||
  'Este campo es obligatorio'
const positive = (value) => Number(value) > 0 || 'Ingresa un valor mayor que cero'
function addSelectedFiles(selected) {
  const incoming = Array.isArray(selected) ? selected : selected ? [selected] : []
  pickerFiles.value = []

  const uniqueIncoming = incoming.filter(
    (file) =>
      !files.value.some(
        (current) =>
          current.name === file.name &&
          current.size === file.size &&
          current.lastModified === file.lastModified,
      ),
  )
  const accepted = []
  let totalSize = files.value.reduce((total, file) => total + file.size, 0)

  for (const file of uniqueIncoming) {
    if (files.value.length + accepted.length >= 4) {
      $q.notify({ type: 'warning', message: 'Puedes agregar hasta 4 fotos.' })
      break
    }
    if (file.size > 500000) {
      $q.notify({ type: 'warning', message: `${file.name} supera el máximo de 500 KB.` })
      continue
    }
    if (totalSize + file.size > 2000000) {
      $q.notify({ type: 'warning', message: 'El tamaño total de las fotos no puede superar 2 MB.' })
      break
    }
    accepted.push(file)
    totalSize += file.size
  }

  files.value.push(...accepted)
  previews.value.push(...accepted.map((file) => URL.createObjectURL(file)))
  if (previews.value.length === accepted.length) activePhoto.value = 0
}
function removeImage(index) {
  URL.revokeObjectURL(previews.value[index])
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
  pickerFiles.value = []
  activePhoto.value = Math.min(activePhoto.value, Math.max(previews.value.length - 1, 0))
}
function movePhoto(direction) {
  if (!previews.value.length) return
  activePhoto.value =
    (activePhoto.value + direction + previews.value.length) % previews.value.length
}
async function submitForm() {
  const valid = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    const result = await addProduct({
      ...form,
      price: Number(form.price),
      screen: Number(form.screen),
      storage: Number(form.storage),
      ram: Number(form.ram),
      createdAt: new Date().toISOString().slice(0, 10),
    }, files.value)
    previews.value.forEach((preview) => URL.revokeObjectURL(preview))
    previews.value = []
    activePhoto.value = 0
    files.value = []
    pickerFiles.value = []
    Object.assign(form, {
      title: '',
      brand: null,
      model: '',
      system: null,
      screen: null,
      storage: null,
      ram: null,
      color: '',
      condition: 'Usado',
      description: '',
      price: null,
      seller: '',
      phone: '',
    })
    formRef.value.resetValidation()
    $q.notify(
      result.photoError
        ? {
            type: 'warning',
            message: 'El anuncio se guardó, pero algunas fotos no se subieron',
            caption: `${result.uploadedCount} de ${result.totalFiles} fotos disponibles. Puedes corregir las fotos después.`,
            position: 'top',
            timeout: 5000,
          }
        : {
            type: 'positive',
            message: 'Tu anuncio se creó correctamente',
            caption: 'Ya aparece en el catálogo.',
            icon: 'check_circle',
            color: 'positive',
            timeout: 2200,
            position: 'top',
          },
    )
    await router.push('/')
  } catch (error) {
    console.error('No se pudo guardar el anuncio en Firebase:', error)
    $q.notify({
      type: 'negative',
      message: 'No se pudo guardar el anuncio',
      caption: 'Revisa tu conexión e inténtalo de nuevo.',
      position: 'top',
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  max-width: 1500px;
  margin: 0 auto;
}

.form-card {
  border-radius: 18px;
  background: #fff;
}

.form-card {
  overflow: hidden;
}

.sticky-card {
  position: sticky;
  top: 92px;
}

.preview-image {
  overflow: hidden;
  border-radius: 12px;
}

.preview-image-wrap {
  position: relative;
}

.preview-delete-button {
  position: absolute;
  z-index: 5;
  top: 8px;
  right: 8px;
}

.mobile-photo-carousel {
  display: none;
}

.photo-carousel {
  height: min(72vw, 360px);
  min-height: 220px;
  border-radius: 14px;
  background: #171717;
}

.photo-delete-button {
  z-index: 5;
}

.carousel-photo {
  height: 100%;
}

.photo-dot {
  width: 8px;
  min-width: 8px;
  height: 8px;
  min-height: 8px;
  padding: 0;
}

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mobile-photo-carousel {
    display: block;
  }

  .desktop-photo-grid {
    display: none;
  }
}
</style>
