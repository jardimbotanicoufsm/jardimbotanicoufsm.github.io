<template>
    <div class="q-pl-md q-pr-md">
        <MenuList :menuLinks="menuLinks" />
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import MenuList from 'src/components/MenuList.vue'

const menuLinks = [
    {
        title: 'Sobre',
        icon: 'ion-leaf',
        link: '/about'
    },
]

export default defineComponent({
    name: 'MenuPage',
    components: {
        MenuList
    },
    setup() {
        return {
            menuLinks: menuLinks,
        }
    }

})
</script>
  