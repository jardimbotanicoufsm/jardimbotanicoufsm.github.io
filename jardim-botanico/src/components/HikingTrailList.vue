<template>
    <q-list padding>
        <HikingTrailListItem v-for="hikingTrailListItem in hikingTrailList" v-bind="hikingTrailListItem"
            v-bind:key="hikingTrailListItem.nome" @hiking-trail-list-item-click="handleHikingTrailClick" />
    </q-list>
</template>
  
<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'
import HikingTrailListItem from 'src/components/HikingTrailListItem.vue'

export default defineComponent({
    name: 'HikingTrailList',
    components: {
        HikingTrailListItem
    },
    beforeMount() {
        this.readSpreadsheet();
    },
    data() {
        return {
            hikingTrailList: []
        }
    },
    methods: {
        readSpreadsheet() {
            // SpreadsheetId of altered copy
            const spreadsheetId = '1SELKTKPVt44lT-Go6mOJ9L43viJ2GXC9aco19VEf2A4';

            // Original spreadsheetId
            //const spreadsheetId = '1-3t23mTmuvJaVK6NAN-ivBr9fbE8NGZ6RNMQPwvd_oc';

            const apiKey = 'AIzaSyA_LT1DlQ_iArm1fGqxIK-YpjAOUSoZgZo';

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/trilhas?key=${apiKey}`;
            api.get(url)
                .then((response) => {
                    const rows = response.data.values;

                    this.createHikingTrail(rows[0], rows.slice(1));
                })
                .catch((error) => {
                    this.$q.notify({
                        color: 'negative',
                        position: 'bottom',
                        message: `Impossível carregar dados: ${error.message}`,
                        icon: 'report_problem'
                    });
                })
        },

        createHikingTrail(header, data) {
            data.forEach(row => {
                const hikingTrail = {};
                row.forEach((value, index) => {
                    hikingTrail[header[index]] = value;
                });
                hikingTrail.pontos = hikingTrail.pontos.split(';').map(Number);
                this.hikingTrailList.push(hikingTrail);
            });
        },

        handleHikingTrailClick(hikingTrailPoints) {
            this.$router.push(`/hikingTrail/${JSON.stringify(hikingTrailPoints)}`);
        }

    }
})
</script>
  