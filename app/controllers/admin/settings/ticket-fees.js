import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    updateSettings() {
      this.set('isLoading', true);
      let settings = this.get('model');
      let incorrect_settings = settings.filter(function(setting) {
        return (!setting.get('currency') || !setting.get('country'));
      });
      if (incorrect_settings.length > 0) {
        this.notify.error(this.get('l10n').t('Please fill required fields.'));
        this.set('isLoading', false);
      } else {
        settings.save()
          .then(() => {
            this.notify.success(this.get('l10n').t('Settings have been saved successfully.'));
          })
          .catch(() => {
            this.notify.error(this.get('l10n').t('An unexpected error has occurred. Settings not saved.'));
          })
          .finally(() => {
            this.set('isLoading', false);
          });
      }
    }
  }
});
