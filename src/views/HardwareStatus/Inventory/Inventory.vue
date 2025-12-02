<template>
  <b-container fluid="xl">
    <page-title />

    <!-- Service indicators -->
    <service-indicator />

    <!-- Quicklinks section -->
    <page-section :section-title="$t('pageInventory.quicklinkTitle')">
      <b-row class="w-75">
        <b-col v-for="column in quicklinkColumns" :key="column.id" xl="4">
          <div v-for="item in column" :key="item.id">
            <b-link
              :href="item.href"
              :data-ref="item.dataRef"
              @click.prevent="scrollToOffset"
            >
              <jump-link /> {{ item.linkText }}
            </b-link>
          </div>
        </b-col>
      </b-row>
    </page-section>

    <!-- System table -->
    <table-system ref="system" />

    <!-- BMC manager table -->
    <table-bmc-manager ref="bmc" />

    <!-- Chassis table -->
    <table-chassis ref="chassis" />

    <!-- DIMM slot table -->
    <table-dimm-slot v-if="showDimms" ref="dimms" />

    <!-- Fans table -->
    <table-fans v-if="showFans" ref="fans" />

    <!-- Power supplies table -->
    <table-power-supplies v-if="showPowerSupplies" ref="powerSupply" />

    <!-- Processors table -->
    <table-processors v-if="showProcessors" ref="processors" />

    <!-- Assembly table -->
    <table-assembly v-if="showAssemblies" ref="assembly" />
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import ServiceIndicator from './InventoryServiceIndicator';
import TableSystem from './InventoryTableSystem';
import TablePowerSupplies from './InventoryTablePowerSupplies';
import TableDimmSlot from './InventoryTableDimmSlot';
import TableFans from './InventoryTableFans';
import TableBmcManager from './InventoryTableBmcManager';
import TableChassis from './InventoryTableChassis';
import TableProcessors from './InventoryTableProcessors';
import TableAssembly from './InventoryTableAssembly';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import JumpLink16 from '@carbon/icons-vue/es/jump-link/16';
import JumpLinkMixin from '@/components/Mixins/JumpLinkMixin';
import { chunk } from 'lodash';
import { useI18n } from 'vue-i18n';
import i18n from '@/i18n';

export default {
  components: {
    PageTitle,
    ServiceIndicator,
    TableDimmSlot,
    TablePowerSupplies,
    TableSystem,
    TableFans,
    TableBmcManager,
    TableChassis,
    TableProcessors,
    TableAssembly,
    PageSection,
    JumpLink: JumpLink16,
  },
  mixins: [LoadingBarMixin, JumpLinkMixin],
  beforeRouteLeave(to, from, next) {
    // Hide loader if user navigates away from page
    // before requests complete
    this.hideLoader();
    next();
  },
  data() {
    return {
      $t: useI18n().t,
      showDimms: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showFans: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showPowerSupplies: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showProcessors: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      showAssemblies: process.env.VUE_APP_ENV_NAME !== 'onlogic',
      links: [
        {
          id: 'system',
          dataRef: 'system',
          href: '#system',
          linkText: i18n.global.t('pageInventory.system'),
        },
        {
          id: 'bmc',
          dataRef: 'bmc',
          href: '#bmc',
          linkText: i18n.global.t('pageInventory.bmcManager'),
        },
        {
          id: 'chassis',
          dataRef: 'chassis',
          href: '#chassis',
          linkText: i18n.global.t('pageInventory.chassis'),
        },
        // DIMM quicklink hidden for onlogic via computed filter
        // Fans quicklink hidden via computed filter
        // Power supplies quicklink hidden via computed filter
        // Processors quicklink hidden via computed filter
        // Assemblies quicklink hidden via computed filter
      ],
    };
  },
  computed: {
    quicklinkColumns() {
      // Chunk links array to 3 array's to display 3 items per column
      const filtered = this.links.filter((l) => {
        if (!this.showDimms && l.id === 'dimms') return false;
        if (!this.showFans && l.id === 'fans') return false;
        if (!this.showPowerSupplies && l.id === 'powerSupply') return false;
        if (!this.showProcessors && l.id === 'processors') return false;
        if (!this.showAssemblies && l.id === 'assembly') return false;
        return true;
      });
      return chunk(filtered, 3);
    },
  },
  created() {
    this.startLoader();
    const bmcManagerTablePromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-bmc-manager-complete', () => resolve());
    });
    const chassisTablePromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-chassis-complete', () => resolve());
    });
    let dimmSlotTablePromise;
    if (this.showDimms) {
      dimmSlotTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-dimm-slot-complete', () => resolve());
      });
    }
    let fansTablePromise;
    if (this.showFans) {
      fansTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-fans-complete', () => resolve());
      });
    }
    let powerSuppliesTablePromise;
    if (this.showPowerSupplies) {
      powerSuppliesTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-power-supplies-complete', () =>
          resolve(),
        );
      });
    }
    let processorsTablePromise;
    if (this.showProcessors) {
      processorsTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-processors-complete', () => resolve());
      });
    }
    const serviceIndicatorPromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-service-complete', () => resolve());
    });
    const systemTablePromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-system-complete', () => resolve());
    });
    let assemblyTablePromise;
    if (this.showAssemblies) {
      assemblyTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-assembly-complete', () => resolve());
      });
    }
    // Combine all child component Promises to indicate
    // when page data load complete
    const promises = [
      bmcManagerTablePromise,
      chassisTablePromise,
      serviceIndicatorPromise,
      systemTablePromise,
    ];
    if (fansTablePromise) promises.push(fansTablePromise);
    if (powerSuppliesTablePromise) promises.push(powerSuppliesTablePromise);
    if (processorsTablePromise) promises.push(processorsTablePromise);
    if (assemblyTablePromise) promises.push(assemblyTablePromise);
    if (dimmSlotTablePromise) promises.push(dimmSlotTablePromise);
    Promise.all(promises).finally(() => this.endLoader());
  },
};
</script>
