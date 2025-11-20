import router from '@/router/index.js'; // Import the original router
import CustomOverview from '@/env/views/Overview/Overview.vue';

// Find the 'overview' route and replace its component
const overviewRoute = router.options.routes.find(r => r.name === 'overview');
if (overviewRoute) {
  overviewRoute.component = CustomOverview;
}

export default router;