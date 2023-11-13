<template>
    <q-carousel :style="{ width: fullscreen ? 'auto' : '60vw' }" height="50vh" swipeable animated navigation v-model="slide"
        v-model:fullscreen="fullscreen">
        <q-carousel-slide :class="fullscreen ? 'uncropped-image' : ''" v-for="(image, index) in images" :name="index"
            :img-src="image" :key="index" />
        <template v-slot:control>
            <q-carousel-control position="bottom-right" :offset="[18, 18]">
                <q-btn push round dense color="white" text-color="primary"
                    :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="fullscreen = !fullscreen" />
            </q-carousel-control>
        </template>
    </q-carousel>
</template>
  
<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
    name: 'ImageGallery',
    props: {
        images: {
            type: Array,
            required: true
        },
    },
    setup() {
        return {
            slide: ref(0),
            fullscreen: ref(false),
        }
    }
})
</script>
<style>
.uncropped-image {
    /* Don't crop the image  */
    background-size: contain;
    /* Only show the image one time  */
    background-repeat: no-repeat;
    /* Color to fill empty space with  */
    background-color: black;
}
</style>