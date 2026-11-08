import { ref, watch } from 'vue'
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { api } from '@/boot/axios'

const announcementsCollection = collection(db, 'announcements')
const couchCollectionPath = '/imagenesfpi/'
const fallbackImage =
  'https://images.unsplash.com/photo-1511707445398-1eeda22e6b1b?auto=format&fit=crop&w=900&q=85'

function couchImageUrl(documentId, attachmentName) {
  return `${api.defaults.baseURL}${couchCollectionPath}${encodeURIComponent(documentId)}/${encodeURIComponent(attachmentName)}`
}

const seedProducts = [
  {
    id: 'phone-1',
    title: 'Samsung Galaxy A54 5G',
    brand: 'Samsung',
    model: 'Galaxy A54',
    condition: 'Usado',
    screen: 6.4,
    system: 'Android',
    storage: 128,
    ram: 8,
    color: 'Grafito',
    price: 245,
    seller: 'María López',
    phone: '7123-4567',
    description:
      'Excelente estado, pantalla AMOLED y batería en muy buenas condiciones. Incluye cargador y funda.',
    image:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-10',
  },
  {
    id: 'phone-2',
    title: 'iPhone 13, 128 GB',
    brand: 'Apple',
    model: 'iPhone 13',
    condition: 'Usado',
    screen: 6.1,
    system: 'iOS',
    storage: 128,
    ram: 4,
    color: 'Azul',
    price: 395,
    seller: 'Carlos Mejía',
    phone: '7890-1234',
    description:
      'iPhone 13 desbloqueado, Face ID funcionando y 88% de salud de batería. Se entrega con cable.',
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-09',
  },
  {
    id: 'phone-3',
    title: 'Xiaomi Redmi Note 12',
    brand: 'Xiaomi',
    model: 'Redmi Note 12',
    condition: 'Nuevo',
    screen: 6.7,
    system: 'Android',
    storage: 256,
    ram: 8,
    color: 'Azul hielo',
    price: 189,
    seller: 'Tecno Store',
    phone: '2200-1000',
    description:
      'Nuevo y sellado. Pantalla AMOLED de 120 Hz, gran almacenamiento y garantía de tienda.',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-08',
  },
  {
    id: 'phone-4',
    title: 'Samsung Galaxy S22',
    brand: 'Samsung',
    model: 'Galaxy S22',
    condition: 'Usado',
    screen: 6.1,
    system: 'Android',
    storage: 128,
    ram: 8,
    color: 'Negro',
    price: 320,
    seller: 'Ana Rivera',
    phone: '7012-8899',
    description:
      'Equipo liberado en buen estado. Cámaras nítidas, pantalla sin manchas y caja original.',
    image:
      'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-07',
  },
  {
    id: 'phone-5',
    title: 'Huawei Nova 9',
    brand: 'Huawei',
    model: 'Nova 9',
    condition: 'Usado',
    screen: 6.6,
    system: 'HarmonyOS',
    storage: 128,
    ram: 8,
    color: 'Plata',
    price: 175,
    seller: 'José Castillo',
    phone: '7734-5612',
    description: 'Muy cuidado, con protector desde el primer día. Incluye cargador SuperCharge.',
    image:
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-06',
  },
  {
    id: 'phone-6',
    title: 'iPhone 12 mini',
    brand: 'Apple',
    model: 'iPhone 12 mini',
    condition: 'Usado',
    screen: 5.4,
    system: 'iOS',
    storage: 64,
    ram: 4,
    color: 'Blanco',
    price: 260,
    seller: 'Sofía Hernández',
    phone: '7666-4411',
    description: 'Compacto y rápido. Liberado para cualquier compañía, batería al 86%.',
    image:
      'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-04',
  },
  {
    id: 'phone-7',
    title: 'Motorola Edge 40 Neo',
    brand: 'Motorola',
    model: 'Edge 40 Neo',
    condition: 'Nuevo',
    screen: 6.5,
    system: 'Android',
    storage: 256,
    ram: 12,
    color: 'Verde',
    price: 299,
    seller: 'Movil Center',
    phone: '2233-9080',
    description: 'Nuevo, potente y resistente al agua. Incluye cargador, funda y garantía.',
    image:
      'https://images.unsplash.com/photo-1511707445398-1eeda22e6b1b?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-10-02',
  },
  {
    id: 'phone-8',
    title: 'Nokia G42 5G',
    brand: 'Nokia',
    model: 'G42',
    condition: 'Usado',
    screen: 6.6,
    system: 'Android',
    storage: 128,
    ram: 6,
    color: 'Gris',
    price: 145,
    seller: 'Ernesto Díaz',
    phone: '7456-9012',
    description:
      'Teléfono confiable, pantalla amplia y batería que dura todo el día. Muy buen estado.',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-09-30',
  },
]

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export const products = ref(seedProducts)
export const cart = ref(readSaved('cellphone-cart-v1', []))
watch(cart, (value) => localStorage.setItem('cellphone-cart-v1', JSON.stringify(value)), {
  deep: true,
})

function fromFirestore(document) {
  const data = document.data()
  const images = (data.attachments || []).map((name) => couchImageUrl(document.id, name))
  return {
    ...data,
    id: document.id,
    image: images[0] || data.image || fallbackImage,
    images,
  }
}

export async function loadProducts() {
  const snapshot = await getDocs(announcementsCollection)
  const savedProducts = snapshot.docs.map(fromFirestore)
  products.value = [...savedProducts, ...seedProducts]
  return savedProducts
}

export async function addProduct(product, files = []) {
  const announcement = Object.fromEntries(
    Object.entries(product).filter(([key]) => !['id', 'image', 'images', 'files'].includes(key)),
  )
  const document = await addDoc(announcementsCollection, { ...announcement, attachments: [] })
  let currentRev
  const uploadedAttachments = []
  let photoError = null

  for (const [index, file] of files.entries()) {
    const extension = file.name.includes('.') ? `.${file.name.split('.').pop().toLowerCase()}` : ''
    const attachmentName = `foto-${index + 1}${extension}`
    const url = `${couchCollectionPath}${encodeURIComponent(document.id)}/${encodeURIComponent(attachmentName)}`

    try {
      const response = await api.put(
        currentRev ? `${url}?rev=${encodeURIComponent(currentRev)}` : url,
        file,
        { headers: { 'Content-Type': file.type || 'application/octet-stream' } },
      )
      currentRev = response.data.rev
      uploadedAttachments.push(attachmentName)
      await updateDoc(document, { attachments: [...uploadedAttachments] })
    } catch (error) {
      photoError = error
      console.error(`No se pudo subir la foto ${index + 1} a CouchDB:`, error.response?.data || error.message)
      break
    }
  }

  const images = uploadedAttachments.map((name) => couchImageUrl(document.id, name))
  const savedProduct = {
    ...announcement,
    attachments: uploadedAttachments,
    id: document.id,
    image: images[0] || fallbackImage,
    images,
  }
  products.value.unshift(savedProduct)
  return { product: savedProduct, uploadedCount: uploadedAttachments.length, totalFiles: files.length, photoError }
}
export function addToCart(productId) {
  cart.value.push(productId)
}
export function getProduct(productId) {
  return products.value.find((item) => item.id === productId)
}
