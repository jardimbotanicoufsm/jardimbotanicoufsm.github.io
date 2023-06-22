<template>
    <div class="q-pl-md q-pr-md">
        <h4 class="text-grey-9">Apresentação</h4>
        <p>
            Somos o Jardim Botânico da Universidade Federal de Santa Maria,
            Órgão Suplementar do Centro de Ciências Naturais e Exatas da Universidade Federal de Santa Maria (CCNE/UFSM).
        </p>
        <p>
            Nossos telefones são:
        </p>
        <address>
            <ul>
                <li>Administração: <a href="tel:+555532208973">+55 55 3220-8973</a></li>
                <li>Visitações: <a href="tel:+5555991938183">+55 55 99193-8183</a></li>
            </ul>
        </address>
        <p>
            Acompanhe-nos nas redes:
        </p>
        <div class="q-pa-md q-gutter-lg row justify-center items-center">
            <SocialMediaLink v-for="socialMediaLink in socialMediaLinks" v-bind="socialMediaLink"
                v-bind:key="socialMediaLink.link" />
        </div>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import SocialMediaLink from 'src/components/SocialMediaLink.vue'

const socialMediaLinks = [
    {
        icon: 'ion-logo-instagram',
        link: 'https://www.instagram.com/jardimbotanicodaufsm',
        backgroundColor: 'white',
        textColor: '#FD1D1D',
        tooltip: 'Instagram'
    },
    {
        icon: 'ion-logo-facebook',
        link: 'https://m.facebook.com/JardimBotanicoDeSantaMaria',
        backgroundColor: 'white',
        textColor: '#0165E1',
        tooltip: 'Facebook'
    },
    {
        icon: 'ion-logo-youtube',
        link: 'https://www.youtube.com/@JardimBotanicodaUFSM',
        backgroundColor: 'white',
        textColor: 'red',
        tooltip: 'Youtube'
    },
    {
        icon: 'ion-home',
        link: 'https://www.ufsm.br/orgaos-suplementares/jardim-botanico',
        backgroundColor: 'white',
        textColor: 'green',
        tooltip: 'Website'
    },
]

export default defineComponent({
    name: 'AboutPage',
    components: {
        SocialMediaLink
    },
    setup() {
        return {
            socialMediaLinks: socialMediaLinks
        }
    }
})
</script>