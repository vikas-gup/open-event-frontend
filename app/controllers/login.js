import Controller from '@ember/controller';

export default Controller.extend({
  newUser : true,

  actions: {
    getStarted() {
        this.set('errorMessage', null);
        this.set('isLoading', true);
        let payload = {
          'email': this.get('email')
        };
        this.get('loader')
          .post('/users/checkEmail', payload)
          .then((response) => {
            if (response.result == "False"){
              this.set('newUser', false)
              this.set('identification', this.get('email'));
              this.set('successMessage', this.get('l10n').t('Already registered user with this email.'));
            }
            else {
              this.transitionToRoute('register')
            }
          })
          .catch(reason => {
            this.set('errorMessage', this.get('l10n').t('An unexpected error occurred.'));
          })
          .finally(() => {
            this.set('isLoading', false);
          });

    }
  }
});
