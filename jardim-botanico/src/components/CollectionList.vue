<template>
    <q-list bordered separator>
        <CollectionListItem v-for="collectionListItem in collectionList" v-bind="collectionListItem"
            v-bind:key="collectionListItem.nome" />
    </q-list>
</template>
  
<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'
import CollectionListItem from 'src/components/CollectionListItem.vue'

export default defineComponent({
    name: 'CollectionList',
    components: {
        CollectionListItem
    },
    beforeMount() {
        this.readSpreadsheet();
    },
    data() {
        return {
            collectionList: []
        }
    },
    methods: {
        readSpreadsheet() {
            // SpreadsheetId of altered copy
            const spreadsheetId = '1SELKTKPVt44lT-Go6mOJ9L43viJ2GXC9aco19VEf2A4';

            // Original spreadsheetId
            //const spreadsheetId = '1-3t23mTmuvJaVK6NAN-ivBr9fbE8NGZ6RNMQPwvd_oc';

            const apiKey = 'AIzaSyA_LT1DlQ_iArm1fGqxIK-YpjAOUSoZgZo';

            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/acervo-a-importar-de-pdf?key=${apiKey}`;
            api.get(url)
                .then((response) => {
                    const rows = response.data.values;

                    this.createCollection(rows[0], rows.slice(1));
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

        createCollection(header, data) {
            data.forEach(row => {
                const collectionItem = {};
                row.forEach((value, index) => {
                    collectionItem[header[index]] = value;
                });

                this.collectionList.push(collectionItem);
            });
        },

    }
})
</script>
  