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
            ><div class="text-h6 text-weight-bold">Información del equipo</div>
            <div class="text-caption text-grey-7">
              Cuéntales a los compradores lo esencial.
            </div></q-card-section
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
              v-model="files"
              outlined
              multiple
              use-chips
              accept="image/*"
              max-files="4"
              max-file-size="500000"
              max-total-size="2000000"
              label="Seleccionar fotos"
              hint="JPG o PNG. Máximo 4 imágenes y 500 KB por foto."
              @update:model-value="updatePreviews"
              ><template #prepend><q-icon name="add_photo_alternate" /></template
            ></q-file>
            <div v-if="previews.length" class="row q-col-gutter-sm q-mt-md">
              <div v-for="(preview, index) in previews" :key="preview" class="col-6 col-sm-3">
                <q-img :src="preview" ratio="1" class="preview-image"
                  ><q-btn
                    round
                    dense
                    color="white"
                    text-color="negative"
                    icon="close"
                    size="sm"
                    class="absolute-top-right q-ma-xs"
                    aria-label="Quitar foto"
                    @click="removeImage(index)"
                /></q-img>
              </div>
            </div> </q-card-section
        ></q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card flat bordered class="form-card sticky-card"
          ><q-card-section
            ><div class="text-h6 text-weight-bold">Precio y contacto</div>
            <div class="text-caption text-grey-7">
              Los compradores podrán contactarte directamente.
            </div></q-card-section
          ><q-separator /><q-card-section class="q-gutter-y-md">
            <q-input
              v-model.number="form.price"
              outlined
              type="number"
              label="Precio *"
              prefix="$"
              min="1"
              step="0.01"
              :rules="[required, positive]"
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
            <div class="row items-center text-caption text-grey-7">
              <q-icon name="verified_user" color="positive" size="18px" class="q-mr-sm" />La
              información del anuncio se guarda en Firebase.
            </div>
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
const previews = ref([])
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
function updatePreviews(selected) {
  previews.value = (selected || []).map((file) => URL.createObjectURL(file))
}
function removeImage(index) {
  URL.revokeObjectURL(previews.value[index])
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
}
async function submitForm() {
  const valid = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    await addProduct({
      ...form,
      price: Number(form.price),
      screen: Number(form.screen),
      storage: Number(form.storage),
      ram: Number(form.ram),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    previews.value.forEach((preview) => URL.revokeObjectURL(preview))
    previews.value = []
    files.value = []
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
    $q.notify({
      type: 'positive',
      message: 'Tu anuncio se creó correctamente',
      caption: 'Ya aparece en el catálogo.',
      icon: 'check_circle',
      color: 'positive',
      timeout: 2200,
      position: 'top',
    })
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

@media (max-width: 900px) {
  .page-wrap {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
