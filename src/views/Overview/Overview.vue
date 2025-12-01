<template>
  <b-container fluid="xl">
    <page-title />
    <overview-quick-links class="mb-4" />
    <page-section
      :section-title="$t('pageOverview.systemInformation')"
      class="mb-1"
    >
      <b-card-group deck>
        <overview-server v-if="showServer" />
        <overview-firmware />
      </b-card-group>
      <b-card-group deck>
        <overview-network />
        <overview-power v-if="showPower" />
      </b-card-group>
    </page-section>
    <page-section :section-title="$t('pageOverview.statusInformation')">
      <b-card-group deck>
        <overview-events />
        <overview-inventory v-if="showInventory" />
        <overview-dumps v-if="showDumps" />
      </b-card-group>
    </page-section>
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import OverviewDumps from './OverviewDumps.vue';
import OverviewEvents from './OverviewEvents.vue';
import OverviewFirmware from './OverviewFirmware.vue';
import OverviewInventory from './OverviewInventory.vue';
import OverviewNetwork from './OverviewNetwork';
import OverviewPower from './OverviewPower';
import OverviewQuickLinks from './OverviewQuickLinks';
import OverviewServer from './OverviewServer';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Overview',
  components: {
    OverviewDumps,
    OverviewEvents,
    OverviewFirmware,
    OverviewInventory,
    OverviewNetwork,
    OverviewPower,
    OverviewQuickLinks,
    OverviewServer,
    PageSection,
    PageTitle,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      $t: useI18n().t,
      showDumps: process.env.VUE_APP_ENV_NAME === 'ibm',
      // Hide inventory card for onlogic environment; shown otherwise
      showInventory: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      // Hide power and server cards for onlogic environment
      showPower: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showServer: process.env.VUE_APP_ENV_NAME !== 'onlogic',
    };
  },
  created() {
    this.startLoader();
    const dumpsPromise = new Promise((resolve) => {
      this.$root.$on('overview-dumps-complete', () => resolve());
    });
    const eventsPromise = new Promise((resolve) => {
      this.$root.$on('overview-events-complete', () => resolve());
    });
    const firmwarePromise = new Promise((resolve) => {
      this.$root.$on('overview-firmware-complete', () => resolve());
    });
    let inventoryPromise;
    if (this.showInventory) {
      inventoryPromise = new Promise((resolve) => {
        this.$root.$on('overview-inventory-complete', () => resolve());
      });
    }
    const networkPromise = new Promise((resolve) => {
      this.$root.$on('overview-network-complete', () => resolve());
    });
    let powerPromise;
    if (this.showPower) {
      powerPromise = new Promise((resolve) => {
        this.$root.$on('overview-power-complete', () => resolve());
      });
    }
    const quicklinksPromise = new Promise((resolve) => {
      this.$root.$on('overview-quicklinks-complete', () => resolve());
    });
    let serverPromise;
    if (this.showServer) {
      serverPromise = new Promise((resolve) => {
        this.$root.$on('overview-server-complete', () => resolve());
      });
    }

    const promises = [
      eventsPromise,
      firmwarePromise,
      networkPromise,
      quicklinksPromise,
    ];
    if (powerPromise) promises.push(powerPromise);
    if (serverPromise) promises.push(serverPromise);
    if (inventoryPromise) promises.push(inventoryPromise);
    if (this.showDumps) promises.push(dumpsPromise);
    Promise.all(promises).finally(() => this.endLoader());
  },
};
</script>
