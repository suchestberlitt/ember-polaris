import Ember from 'ember';
import layout from '../../templates/components/polaris-layout/annotation';

const {
  Component,
} = Ember;

export default Component.extend({
  classNames: ['Polaris-Layout__Annotation'],

  layout,

  /*
   * Public attributes.
   */
  /**
   * Title for the section
   *
   * @property title
   * @type {string}
   * @default: null
   */
  title: null,

  /**
   * Description for the section
   *
   * @property description
   * @type {string}
   * @default: null
   */
  description: null,
});