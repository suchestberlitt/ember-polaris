import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, find, focus, blur, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import buildNestedSelector from '../../helpers/build-nested-selector';

const buttonGroupSelector = '[data-test-button-group]';
const buttonGroupItemSelector = '[data-test-button-group-item]';
const buttonSelector = buildNestedSelector(
  buttonGroupItemSelector,
  'button.Polaris-Button'
);

module('Integration | Component | polaris button group', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct HTML with default attributes', async function(assert) {
    await render(hbs`
      {{#polaris-button-group}}
        {{polaris-button text="Button 1"}}
        {{polaris-button text="Button 2"}}
      {{/polaris-button-group}}
    `);

    const buttonGroups = findAll(buttonGroupSelector);
    assert.equal(buttonGroups.length, 1, 'renders one button group');

    const buttons = findAll(buttonSelector);
    assert.equal(
      buttons.length,
      2,
      'renders the correct number of wrapped buttons'
    );
  });

  test('it renders the correct HTML with segmented attribute', async function(assert) {
    this.set('segmented', true);
    await render(hbs`{{polaris-button-group segmented=segmented}}`);

    const buttonGroup = find(buttonGroupSelector);
    assert
      .dom(buttonGroup)
      .hasClass(
        'Polaris-ButtonGroup--segmented',
        'segmented=true - adds the segmented class'
      );

    this.set('segmented', false);
    assert
      .dom(buttonGroup)
      .hasNoClass(
        'Polaris-ButtonGroup--segmented',
        'segmented=true - does not add the segmented class'
      );
  });

  test('it renders the correct HTML with fullWidth attribute', async function(assert) {
    this.set('fullWidth', true);
    await render(hbs`{{polaris-button-group fullWidth=fullWidth}}`);

    const buttonGroup = find(buttonGroupSelector);
    assert
      .dom(buttonGroup)
      .hasClass(
        'Polaris-ButtonGroup--fullWidth',
        'fullWidth=true - adds the fullWidth class'
      );

    this.set('fullWidth', false);
    assert
      .dom(buttonGroup)
      .hasNoClass(
        'Polaris-ButtonGroup--fullWidth',
        'fullWidth=false - does not add the fullWidth class'
      );
  });

  test('it renders the correct HTML with connectedTop attribute', async function(assert) {
    this.set('connectedTop', true);
    await render(hbs`{{polaris-button-group connectedTop=connectedTop}}`);

    const buttonGroup = find(buttonGroupSelector);
    assert
      .dom(buttonGroup)
      .hasClass(
        'Polaris-ButtonGroup--connectedTop',
        'connectedTop=true - adds the connectedTop class'
      );

    this.set('connectedTop', false);
    assert
      .dom(buttonGroup)
      .hasNoClass(
        'Polaris-ButtonGroup--connectedTop',
        'connectedTop=false - does not add the connectedTop class'
      );
  });

  test('it renders the correct HTML in block usage', async function(assert) {
    await render(hbs`
      {{#polaris-button-group as |buttonGroup|}}
        {{#buttonGroup.item plain=true}}
          Plain block item
        {{/buttonGroup.item}}

        {{buttonGroup.item text="Inline item"}}

        {{polaris-button text="Magically wrapped button"}}
      {{/polaris-button-group}}
    `);

    const buttonGroupItems = findAll(buttonGroupItemSelector);
    assert.equal(
      buttonGroupItems.length,
      3,
      'renders the correct number of button group items'
    );

    // Check the first item.
    let buttonGroupItem = buttonGroupItems[0];
    assert
      .dom(buttonGroupItem)
      .hasClass(
        'Polaris-ButtonGroup__Item--plain',
        'first group item - has plain class'
      );
    assert
      .dom(buttonGroupItem)
      .hasText(
        'Plain block item',
        'first group item - renders the correct content'
      );

    // Check the second item.
    buttonGroupItem = buttonGroupItems[1];
    assert
      .dom(buttonGroupItem)
      .hasNoClass(
        'Polaris-ButtonGroup__Item--plain',
        'second group item - does not have plain class'
      );
    assert
      .dom(buttonGroupItem)
      .hasText(
        'Inline item',
        'second group item - renders the correct content'
      );

    // Check the third item.
    buttonGroupItem = buttonGroupItems[2];
    assert
      .dom(buttonGroupItem)
      .hasNoClass(
        'Polaris-ButtonGroup__Item--plain',
        'third group item - does not have plain class'
      );
    assert
      .dom(buttonGroupItem)
      .hasText(
        'Magically wrapped button',
        'third group item - renders the correct content'
      );
  });

  test('it handles focused buttons correctly', async function(assert) {
    await render(hbs`
      {{#polaris-button-group as |buttonGroup|}}
        {{#buttonGroup.item}}
          {{polaris-button text="Focus me please!"}}
        {{/buttonGroup.item}}
      {{/polaris-button-group}}
    `);

    const buttonGroupItem = find(buttonGroupItemSelector);
    assert.ok(buttonGroupItem, 'renders the button group item');

    assert
      .dom(buttonGroupItem)
      .hasNoClass(
        'Polaris-ButtonGroup__Item--focused',
        'before focus - group item does not have focused class'
      );

    await focus('.Polaris-Button');
    assert
      .dom(buttonGroupItem)
      .hasClass(
        'Polaris-ButtonGroup__Item--focused',
        'after focus - group item has focused class'
      );

    await blur('.Polaris-Button');
    assert
      .dom(buttonGroupItem)
      .hasNoClass(
        'Polaris-ButtonGroup__Item--focused',
        'after blur - group item does not have focused class'
      );
  });
});
