<template>
    <q-btn :style="{ color: textColor, 'background-color': backgroundColor }" round :size="size" :icon="icon"
        @click="openLink(link)">
        <q-tooltip>
            {{ tooltip }}
        </q-tooltip>
    </q-btn>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SocialMediaLink',
    props: {
        size: {
            type: String,
            default: 'lg'
        },
        icon: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        backgroundColor: {
            type: String,
            required: true,
        },
        textColor: {
            type: String,
            required: true,
        },
        tooltip: {
            type: String,
            required: false
        },
    },
    methods: {
        openLink(link) {
            window.open(link, '_blank');
        }
    }
});
</script>
