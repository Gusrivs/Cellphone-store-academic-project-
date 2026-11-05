<script setup>
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const $q = useQuasar()

const filesImages = ref(null)

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
const anuncio = ref() //hagamos de caso que este es el anuncio que se crea en firebase
async function setImagen() {
  if (!filesImages.value || filesImages.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'No se han seleccionado imágenes para subir.',
    })
    return
  }

  let coleccionCouchDB = '/imagenesfpi/'
  let idDocumento = anuncio.value[0].id // usamos el primer anuncio
  console.log('Colección CouchDB:', idDocumento)
  let rev = null

  for (let i = 0; i < filesImages.value.length; i++) {
    const file = filesImages.value[i]
    console.log(`Subiendo imagen ${i + 1}:`, file.name)
    let attname = 'archivo' + i + '.jpg' // nombre del attachment
    //subo la imagen a couchDB como attachement del documento idDocumento
    //hare peticion con await

    if (i === 0) {
      let response = await api.put(
        `${api.baseURL}${coleccionCouchDB}${idDocumento}/${attname}`,
        file,
        {
          headers: {
            'Content-Type': file.type,
          },
        },
      )
      if (response.status === 201) {
        rev = response.data.rev
        console.log(`Imagen ${i + 1} subida con éxito. Nueva revisión:`, rev)
      } else {
        console.error(`Error al subir la imagen ${i + 1}:`, response.statusText)
      }
    } else {
      let response = await api.put(
        `${api.baseURL}${coleccionCouchDB}${idDocumento}/${attname}?rev=${rev}`,
        file,
        {
          headers: {
            'Content-Type': file.type,
          },
        },
      )
      if (response.status === 201) {
        rev = response.data.rev
        console.log(`Imagen ${i + 1} subida con éxito. Nueva revisión:`, rev)
      } else {
        console.error(`Error al subir la imagen ${i + 1}:`, response.statusText)
      }
    }
  } //FIN DEL FOR (espero este bien
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
      <q-btn @click="setImagen" variant="primary">Subir Imagenes</q-btn>
      <q-btn @click="getImagen" variant="success">Obtener Imagenes</q-btn>
      <br />
      <span>Que mas querias bro?</span>
    </div>
  </q-page>
</template>
