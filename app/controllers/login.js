import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  newUser : true,
  torii : service(),

  actions: {
    toggleStarted() {
      this.set('newUser', true);
    },
    getStarted() {
      this.set('errorMessage', null);
      this.set('isLoading', true);
      let payload = {
        'email': this.get('email')
      };
      this.get('loader')
        .post('/users/checkEmail', payload)
        .then(response => {
          if (response.result === 'False') {
            this.set('successMessage', this.get('l10n').t('Already registered user with this email.'));
            this.set('newUser', false);
            this.set('identification', this.get('email'));
          } else {
            this.transitionToRoute('register');
          }
        })
        .catch(() => {
          this.set('errorMessage', this.get('l10n').t('An unexpected error occurred.'));
        })
        .finally(() => {
          this.set('isLoading', false);
        });

    },

    async auth(provider) {
      try {
        if (provider === 'facebook') {
          this.get('torii').open('facebook').then(authData => {
            this.get('loader').load(`/auth/oauth/login/${  provider  }/${  authData.authorizationCode  }/?redirect_uri=${  authData.redirectUri}`)
              .then(async response => {
                let credentials = {
                  'identification' : response.email,
                  'password' : response.facebook_login_hash
                };

                let authenticator = 'authenticator:jwt';
                this.get('session')
                  .authenticate(authenticator, credentials)
                  .then(async() => {
                    const tokenPayload = this.get('authManager').getTokenPayload();
                    if (tokenPayload) {
                      this.get('authManager').persistCurrentUser(
                        await this.get('store').findRecord('user', tokenPayload.identity)
                      );
                    }
                  });
              });
          });
        }
      } catch (error) {
        this.get('notify').error(this.get('l10n').t(error.message));
      }
    }
  }
});
