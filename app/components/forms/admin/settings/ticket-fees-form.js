import Component from '@ember/component';
import { computed } from '@ember/object';
import { countries } from 'open-event-frontend/utils/dictionary/demography';
import { paymentCountries, paymentCurrencies } from 'open-event-frontend/utils/dictionary/payment';
import { orderBy, filter } from 'lodash';

export default Component.extend({

  selectedCurrency: computed(function(currName) {
    return orderBy(filter(countries, country => paymentCurrencies.includes(curr.name)), currName);
  }),

  paymentCountries: computed(function() {
    return orderBy(filter(countries, country => paymentCountries.includes(country.code)), 'name');
  }),

  paymentCurrencies: computed(function() {
    return orderBy(paymentCurrencies, 'name');
  }),

  actions: {
    addNewTicket() {
      this.get('model').toArray().addObject(this.store.createRecord('ticket-fee', {
        maximumFee: 0.0,
        serviceFee: 0.0
      }));
    },
    deleteTicket(rec) {
      rec.deleteRecord();
      this.get('model').toArray().removeObject(rec);
    }
  }
});
