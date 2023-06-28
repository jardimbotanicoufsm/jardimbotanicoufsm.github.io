<template>
    <q-page class="flex flex-center">
        <q-list padding class="rounded-borders">
            <MenuListItem v-for="menuLink in menuLinks" v-bind="menuLink" v-bind:key="menuLink.title" />
        </q-list>
    </q-page>
</template>
  
<script>
import { defineComponent } from 'vue'
import MenuListItem from 'src/components/MenuListItem.vue'

export default defineComponent({
    name: 'MenuList',
    components: {
        MenuListItem
    },
    props: {
        menuLinks: {
            type: Array,
            default: () => []
        },
    }
})
</script>
  