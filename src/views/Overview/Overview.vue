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
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import OverviewFirmware from './OverviewFirmware.vue';
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
    OverviewFirmware,
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
      // Hide power and server cards for onlogic environment
      showPower: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showServer: process.env.VUE_APP_ENV_NAME !== 'onlogic',
    };
  },
  created() {
    this.startLoader();
    const firmwarePromise = new Promise((resolve) => {
      this.$root.$on('overview-firmware-complete', () => resolve());
    });
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

    const promises = [firmwarePromise, networkPromise, quicklinksPromise];
    if (powerPromise) promises.push(powerPromise);
    if (serverPromise) promises.push(serverPromise);
    Promise.all(promises).finally(() => this.endLoader());
  },
};
</script>
