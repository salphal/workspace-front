import { registerSW } from 'virtual:pwa-register';

/**
 *
 */

const updateSW = registerSW({
  onOfflineReady() {
    // show a ready to work offline to user
    console.log('App is ready to work offline!');
  },
  onNeedRefresh() {
    // show a prompt to user
  },
});

updateSW();
