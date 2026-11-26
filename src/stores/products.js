import { ref, watch } from 'vue'
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { api } from '@/boot/axios'

const announcementsCollection = collection(db, 'announcements')
const couchCollectionPath = '/imagenesfpi/'
const directAttachmentPath = '/'
const fallbackImage =
  'https://images.unsplash.com/photo-1511707445398-1eeda22e6b1b?auto=format&fit=crop&w=900&q=85'

function couchImageUrl(documentId, attachmentName, attachmentPath = couchCollectionPath) {
  return `${api.defaults.baseURL}${attachmentPath}${encodeURIComponent(documentId)}/${encodeURIComponent(attachmentName)}`
}

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export const products = ref([])
export const cart = ref(readSaved('cellphone-cart-v1', []))
watch(cart, (value) => localStorage.setItem('cellphone-cart-v1', JSON.stringify(value)), {
  deep: true,
})

function fromFirestore(document) {
  const data = document.data()
  const attachmentPath = data.attachmentStorage === 'database-root' ? directAttachmentPath : couchCollectionPath
  const images = (data.attachments || []).map((name) =>
    couchImageUrl(document.id, name, attachmentPath),
  )
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
  products.value = savedProducts
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

  if (files.length > 0) {
    try {
      const couchDocument = await api.put(`/${encodeURIComponent(document.id)}`, {
        type: 'announcement-images',
        firestoreId: document.id,
      })
      currentRev = couchDocument.data.rev
    } catch (error) {
      photoError = error
      console.error(
        'No se pudo crear el documento de imágenes en CouchDB:',
        error.response?.data || error.message,
      )
    }
  }

  for (const [index, file] of files.entries()) {
    if (photoError) break
    const extension = file.name.includes('.') ? `.${file.name.split('.').pop().toLowerCase()}` : ''
    const attachmentName = `foto-${index + 1}${extension}`
    const url = `${directAttachmentPath}${encodeURIComponent(document.id)}/${encodeURIComponent(attachmentName)}`

    try {
      const response = await api.put(
        currentRev ? `${url}?rev=${encodeURIComponent(currentRev)}` : url,
        file,
        { headers: { 'Content-Type': file.type || 'application/octet-stream' } },
      )
      currentRev = response.data.rev
      uploadedAttachments.push(attachmentName)
      await updateDoc(document, {
        attachments: [...uploadedAttachments],
        attachmentStorage: 'database-root',
      })
    } catch (error) {
      photoError = error
      console.error(
        `No se pudo subir la foto ${index + 1} a CouchDB:`,
        error.response?.data || error.message,
      )
      break
    }
  }

  const images = uploadedAttachments.map((name) =>
    couchImageUrl(document.id, name, directAttachmentPath),
  )
  const savedProduct = {
    ...announcement,
    attachments: uploadedAttachments,
    id: document.id,
    image: images[0] || fallbackImage,
    images,
  }
  products.value.unshift(savedProduct)
  return {
    product: savedProduct,
    uploadedCount: uploadedAttachments.length,
    totalFiles: files.length,
    photoError,
  }
}
export function addToCart(productId) {
  cart.value.push(productId)
}
export function getProduct(productId) {
  return products.value.find((item) => item.id === productId)
}
