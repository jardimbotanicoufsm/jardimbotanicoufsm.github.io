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
    {
        title: 'Acervo',
        icon: 'ion-filing',
        link: '/collection',
    },
    /*
    {
        title: 'Visitas',
        icon: 'ion-clipboard',
        link: '/visits',
        textColor: 'text-grey-6'
    },
    {
        title: 'Atividades',
        icon: 'ion-bulb',
        link: '/activities',
        textColor: 'text-grey-6'
    },
    {
        title: 'Coleções',
        icon: 'ion-filing',
        link: '/colections',
        textColor: 'text-grey-6'
    },
    {
        title: 'Social',
        icon: 'ion-people',
        link: '/social',
        textColor: 'text-grey-6'
    },
    {
        title: 'Configurações',
        icon: 'ion-settings',
        link: '/settings',
        textColor: 'text-grey-6'
    },
    */
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
  