import Component from '@ember/component';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { classify } from '@ember/string';
import layout from '../templates/components/polaris-stack';

/**
 * Polaris stack component.
 * See https://polaris.shopify.com/components/structure/stack
 */
export default Component.extend({
 classNames: ['Polaris-Stack'],
 classNameBindings: [
   'vertical:Polaris-Stack--vertical',
   'spacingClassName',
   'alignmentClassName',
   'distributionClassName',
   'noWrapClassName'
 ],

 layout,

 /*
  * Public attributes.
  */
 /**
  * Elements to display inside stack
  *
  * @property text
  * @type {string}
  * @default null
  */
 text: null,

 /**
  * Stack the elements vertically
  *
  * @property vertical
  * @type {boolean}
  * @default false
  */
 vertical: false,

 /**
  * Adjust spacing between elements
  *
  * @property spacing
  * @type {enum}
  * @default null
  */
 spacing: null,

 /**
  * Adjust alignment of elements
  *
  * @property alignment
  * @type {enum}
  * @default null
  */
 alignment: null,

 /**
  * Adjust distribution of elements
  *
  * @property distribution
  * @type {enum}
  * @default baseline
  */
 distribution: 'baseline',

 /**
  * Adjust the elements dont wrap
  *
  * @property nowrap
  * @type {boolean}
  * @default false
  */
 nowrap: false,

 /*
  * Internal properties.
  */
 spacingClassName: computed('spacing', function() {
   const spacing = this.get('spacing');
   if (isBlank(spacing)) {
     return null;
   }

   return `Polaris-Stack--spacing${classify(spacing)}`;
 }).readOnly(),

 alignmentClassName: computed('alignment', function() {
   const alignment = this.get('alignment');
   if (isBlank(alignment)) {
     return null;
   }

   return `Polaris-Stack--alignment${classify(alignment)}`;
 }).readOnly(),

 distributionClassName: computed('distribution', function() {
   const distribution = this.get('distribution');
   if (isBlank(distribution) || distribution === 'baseline') {
     return null;
   }

   return `Polaris-Stack--distribution${classify(distribution)}`;
 }).readOnly(),

 noWrapClassName: computed('nowrap', function() {
  const nowrap = this.get('nowra');
  if (isBlank(noWrapClassName) || nowrap === true) {
    return null;
  }

  return 'Polaris-Stack--noWrap';
 })

 /**
  * Lifecycle hooks.
  */
 didRender() {
   this._super(...arguments);

   // Wrap each child element that isn't already a stack item.
   this.$().children()
     .not('div.Polaris-Stack__Item')
     .wrap('<div class="Polaris-Stack__Item"></div>');
 },
});
