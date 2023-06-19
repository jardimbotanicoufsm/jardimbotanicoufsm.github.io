<template>
    <MenuList :menuLinks="menuLinks" />
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
    {
        title: 'Visitas',
        icon: 'ion-clipboard',
        link: '/visits'
    },
    {
        title: 'Atividades',
        icon: 'ion-bulb',
        link: '/activities'
    },
    {
        title: 'Social',
        icon: 'ion-people',
        link: '/social'
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
  