<template>
    <div class="q-pl-md q-pr-md">
        <h5>Apresentação</h5>
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
        icon: 'img:assets/icons/instagram.svg',
        link: 'https://www.instagram.com/jardimbotanicodaufsm',
        backgroundColor: '#49654D',
        textColor: '#FD1D1D',
        tooltip: 'Instagram'
    },
    {
        icon: 'img:assets/icons/facebook.svg',
        link: 'https://m.facebook.com/JardimBotanicoDeSantaMaria',
        backgroundColor: '#49654D',
        textColor: '#0165E1',
        tooltip: 'Facebook'
    },
    {
        icon: 'img:assets/icons/youtube.svg',
        link: 'https://www.youtube.com/@JardimBotanicodaUFSM',
        backgroundColor: '#49654D',
        textColor: 'red',
        tooltip: 'Youtube'
    },
    {
        icon: 'img:assets/icons/website.svg',
        link: 'https://www.ufsm.br/orgaos-suplementares/jardim-botanico',
        backgroundColor: '#49654D',
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