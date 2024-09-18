<script setup>
import { onMounted, ref } from 'vue'
import html2canvas from 'html2canvas'

const isDragging = ref(false)
const mouseXPos = ref(0)
const mouseYPos = ref(0)
const images = ref([])
const draggingImageIndex = ref(null)
const initialPosition = ref(0)
const file = ref(null)
const fileInput = ref(null)
const imageUrl = ref('')
const captureArea = ref(null)
const designs = ref([])

const emit = defineEmits(['saveDesigns'])

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    if (isDragging.value && draggingImageIndex.value !== null) {
      const diffX = e.clientX - mouseXPos.value
      const diffY = e.clientY - mouseYPos.value

      images.value[draggingImageIndex.value].x += diffX
      images.value[draggingImageIndex.value].y += diffY
    }

    mouseXPos.value = e.clientX
    mouseYPos.value = e.clientY
  })

  window.addEventListener('mouseup', () => {
    isDragging.value = false
    draggingImageIndex.value = null
  })
})

const onFileChange = (event) => {
  file.value = event.target.files[0]

  if (file.value) {
    imageUrl.value = URL.createObjectURL(file.value)
  }
}

const startDragging = (index) => {
  isDragging.value = true
  draggingImageIndex.value = index
}

const addImage = () => {
  if (imageUrl.value) {
    const newId = images.value.length + 1
    const position = initialPosition.value + 20
    initialPosition.value = position
    images.value.push({
      id: newId,
      x: position,
      y: position,
      src: imageUrl.value
    })
  }
}

const removeAllImages = () => {
  images.value = []
  file.value = null
  fileInput.value.value = ''
  imageUrl.value = ''
  initialPosition.value = 0
}

const captureScreenshot = () => {
  if (imageUrl.value !== '') {
    html2canvas(captureArea.value)
      .then((canvas) => {
        designs.value.push(canvas.toDataURL('image/png'))
        removeAllImages()
        emit('saveImages', designs.value)
      })
      .catch((error) => {
        console.error('Erro ao capturar a área:', error)
      })
  }
}

const deleteImage = (index) => {
  designs.value.splice(index, 1)
}
</script>

<template>
  <div class="mb-5">
    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Desenho <span class="text-red-500">*</span></label
    >
    <div class="flex flex-wrap mb-5">
      <div v-for="(design, index) in designs" :key="index" class="w-1/6 mr-2 text-center">
        <img :src="design" alt="" />
        <button class="text-red-700 mt-3" type="button" @click="deleteImage(index)">
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="flex">
        <button
          class="mr-2 flex items-center justify-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
          type="button"
          @click="addImage"
        >
          <svg
            class="h-3.5 w-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
            />
          </svg>
          Incluir
        </button>
        <button
          class="mr-2 flex items-center justify-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
          type="button"
          @click="removeAllImages"
        >
          <svg
            class="h-3.5 w-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 576 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"
            />
          </svg>
          Limpar
        </button>
        <button
          class="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          type="button"
          @click="captureScreenshot"
        >
          <svg
            class="h-3.5 w-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
            />
          </svg>
          Salvar
        </button>
      </div>

      <div>
        <input
          id="file_input"
          ref="fileInput"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          type="file"
          @change="onFileChange"
        />
      </div>
    </div>

    <div ref="captureArea" class="relative mt-5">
      <img
        alt="glasses"
        class="w-full border border-gray-900"
        src="../assets/images/background.png"
      />

      <img
        v-for="(image, index) in images"
        :key="image.id"
        :class="[isDragging && draggingImageIndex === index ? 'cursor-grabbing' : 'cursor-grab']"
        :src="image.src"
        :style="{
          left: `${image.x}px`,
          top: `${image.y}px`
        }"
        alt="logo"
        class="absolute w-8 h-8"
        draggable="false"
        @mousedown="startDragging(index)"
      />
    </div>
  </div>
</template>

<style scoped></style>
