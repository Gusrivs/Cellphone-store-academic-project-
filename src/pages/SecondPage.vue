<script setup>
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const $q = useQuasar()

const filesImages = ref(null)
const couchStatus = ref('')
const uploadingImages = ref(false)
const uploadedImages = ref([])

async function probarCouchDB() {
  couchStatus.value = 'Conectando…'

  try {
    const response = await api.get('/')
    couchStatus.value = `Conexión correcta: HTTP ${response.status}`
  } catch (error) {
    const status = error.response?.status
    couchStatus.value = status
      ? `CouchDB respondió HTTP ${status}`
      : 'No se pudo conectar. Revisa la consola y la pestaña Network del navegador.'
    console.error('Prueba GET CouchDB falló:', status || error.code || error.message)
  }
}

function onRejected(rejectedEntries) {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  })
}

const newUser = ref({
  first: '',
  last: '',
  born: null,
})

async function agregar() {
  // Validación básica por si intentan enviar campos vacíos
  if (!newUser.value.first || !newUser.value.last || !newUser.value.born) {
    console.error('Por favor rellena todos los campos')
    return
  }

  try {
    // 2. Pasamos los datos dinámicos que el usuario escribió en el formulario
    const docRef = await addDoc(collection(db, 'users'), {
      first: newUser.value.first,
      last: newUser.value.last,
      // Aseguramos que el año se guarde como número
      born: Number(newUser.value.born),
    })

    console.log('Document written with ID: ', docRef.id)

    // 3. Limpiamos el formulario para que quede listo para otro registro
    newUser.value = { first: '', last: '', born: null }

    // Opcional: Actualizamos la lista automáticamente al terminar de guardar
    await leer()
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const users = ref([])
async function leer() {
  const querySnapshot = await getDocs(collection(db, 'users'))
  users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
async function setImagen() {
  const files = Array.from(filesImages.value || [])
  if (files.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'No se han seleccionado imágenes para subir.',
    })
    return
  }

  const databasePath = '/'
  uploadingImages.value = true
  uploadedImages.value = []
  couchStatus.value = 'Creando documento de prueba…'

  try {
    // CouchDB necesita que exista el documento padre antes de adjuntar archivos.
    const docResponse = await api.post(databasePath, {
      type: 'prueba-imagenes',
      createdAt: new Date().toISOString(),
    })
    const idDocumento = docResponse.data.id
    let currentRev = docResponse.data.rev

    for (const [index, file] of files.entries()) {
      const extension = file.name.includes('.') ? `.${file.name.split('.').pop().toLowerCase()}` : ''
      const attname = `imagen-${index + 1}${extension}`
      const url = `${databasePath}${encodeURIComponent(idDocumento)}/${encodeURIComponent(attname)}`
      couchStatus.value = `Subiendo imagen ${index + 1} de ${files.length}…`
      const response = await api.put(
        `${url}?rev=${encodeURIComponent(currentRev)}`,
        file,
        {
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        },
      )
      currentRev = response.data.rev
      uploadedImages.value.push({
        name: file.name,
        url: `${api.defaults.baseURL}${url}`,
      })
    }

    couchStatus.value = `${uploadedImages.value.length} imagen(es) guardada(s) en CouchDB. Documento: ${idDocumento}`
    $q.notify({ type: 'positive', message: 'Imagen(es) guardada(s) en CouchDB.' })
  } catch (error) {
    const detail = error.response?.data?.reason || error.response?.data?.error || error.message
    couchStatus.value = `Falló la subida: ${detail}`
    console.error('Fallo al guardar imágenes en CouchDB:', error.response?.data || error)
    $q.notify({ type: 'negative', message: 'No se pudieron guardar las imágenes.', caption: detail })
  } finally {
    uploadingImages.value = false
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h3>Segunda Página (Pruebas de todo lo que se cruce)</h3>
      <h3>Agregar Documento (Firebase)</h3>
      <q-input v-model="newUser.first" label="Primer Nombre" outlined />
      <q-input v-model="newUser.last" label="Apellido" outlined />
      <q-input v-model="newUser.born" label="Año de Nacimiento" outlined />
      <q-btn color="primary" @click="agregar" label="Agregar Documento" />
      <q-btn color="accent" @click="leer" label="Leer Documentos" />
      <h3 v-if="users.length > 0">Lista de Usuarios</h3>
      <q-card v-for="user in users" :key="user.id" class="my-card">
        <q-card-section>
          <div class="text-h6">{{ user.first }} {{ user.last }}</div>
          <div class="text-subtitle2">Born: {{ user.born }}</div>
        </q-card-section>
      </q-card>
    </div>
    <!--Aqui pondre pruebas de couchDB para guardar imagenes-->
    <div class="q-mt-md">
      <h3 style="color: red">Pruebas de CouchDB</h3>
      <q-file
        style="max-width: 300px"
        v-model="filesImages"
        color="positive"
        filled
        rounded
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        @rejected="onRejected"
      />
      <br />
      <q-btn @click="setImagen" color="primary" label="Subir imágenes" :loading="uploadingImages" :disable="uploadingImages" />
      <q-btn class="q-ml-sm" @click="probarCouchDB" color="info" label="Probar conexión CouchDB" />
      <div v-if="couchStatus" class="q-mt-sm" role="status">{{ couchStatus }}</div>
      <div v-if="uploadedImages.length" class="row q-gutter-md q-mt-md">
        <div v-for="image in uploadedImages" :key="image.url" class="column items-center">
          <q-img :src="image.url" :alt="image.name" width="180px" height="140px" fit="contain" />
          <span>{{ image.name }}</span>
        </div>
      </div>
      <br />
      <span>Que mas querias bro?</span>
    </div>
  </q-page>
</template>
