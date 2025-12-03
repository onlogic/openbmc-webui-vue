<template>
  <main>
    <div class="login-container">
      <div class="login-main">
        <div>
          <div class="login-brand mb-5">
            <!-- Use static src for svg-inline; switch via v-if -->
            <img
              v-if="isOnlogic"
              class="onlogic-logo"
              width="201px"
              height="52px"
              src="@/env/assets/images/OnLogic_BMC_Horizontal-Logo_Color-01.svg"
              :alt="altLogo"
            />
            <img
              v-else
              svg-inline
              width="90px"
              src="@/assets/images/login-company-logo.svg"
              :alt="altLogo"
            />
          </div>
          <h1 v-if="customizableGuiName" class="h3 mb-5">
            {{ customizableGuiName }}
          </h1>
          <router-view class="login=form form-background" />
        </div>
      </div>
      <div class="login-aside">
        <div class="login-aside__logo-brand">
          <!-- Add Secondary brand logo if needed -->
        </div>
        <div class="login-aside__logo-bmc">
          <img
            v-if="!isOnlogic"
            svg-inline
            style="width: auto; height: 60px"
            src="@/assets/images/built-on-openbmc-logo.svg"
            alt="Built on OpenBMC"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'LoginLayout',
  data() {
    return {
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'OpenBMC',
      customizableGuiName: process.env.VUE_APP_GUI_NAME || '',
    };
  },
  computed: {
    isOnlogic() {
      return process.env.VUE_APP_ENV_NAME === 'onlogic';
    },
  },
  mounted() {
    // Set color on mount
    document.body.style.backgroundColor = '#ff8200';
  },
  beforeUnmount() {
    // Revert to default when leaving this page
    document.body.style.backgroundColor = '';
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  background: gray('100');
  display: flex;
  flex-direction: column;
  gap: $spacer * 2;
  max-width: 1400px;
  min-width: 320px;
  min-height: 100vh;
  justify-content: space-around;

  @include media-breakpoint-up('md') {
    background: $white;
    flex-direction: row;
    gap: 0; // Remove gap so orange panel touches main panel
  }
}

.login-main {
  min-height: 50vh;
  padding: $spacer * 3;

  @include media-breakpoint-up('md') {
    background: gray('100');
    display: flex;
    flex-direction: column;
    flex: 1 1 75%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
  }
}

.login-form {
  @include media-breakpoint-up('md') {
    max-width: 360px;
  }
}

.login-aside {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: $spacer * 1.5;
  // Remove margins so orange panel spans entire right side
  margin-right: 0;
  margin-bottom: 0;
  background-color: #ff8200;

  @include media-breakpoint-up('md') {
    min-height: 100vh;
    padding-bottom: $spacer;
    flex: 1 1 25%;
    margin-bottom: 0;
    // Ensure it stretches fully and no internal white shows
    padding-left: $spacer * 1.5;
    padding-right: $spacer * 1.5;
  }
}
</style>
