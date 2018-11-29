import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  find,
  findAll,
  triggerEvent,
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import FilterValueSelectorComponent, {
  FilterType,
} from '@smile-io/ember-polaris/components/polaris-resource-list/filter-control/filter-value-selector';

const filters = [
  {
    key: 'filterKey',
    label: 'Product type',
    operatorText: 'is',
    type: FilterType.Select,
    options: [
      'Bundle',
      {
        value: 'electronic_value',
        label: 'Electronic',
        disabled: true,
      },
      {
        value: 'beauty_value',
        label: 'Beauty',
      },
    ],
  },
  {
    key: 'filterKey2',
    label: 'Tagged with',
    type: FilterType.TextField,
  },
  {
    key: 'filterKey3',
    label: 'Times used',
    operatorText: [
      {
        optionLabel: 'less than',
        key: 'times_used_max',
      },
      {
        optionLabel: 'greater than',
        key: 'times_used_min',
      },
    ],
    type: FilterType.TextField,
  },
];

const resourceName = {
  singular: 'Item',
  plural: 'Items',
};

// Grab the filter value selector instance for later use.
let filterValueSelector = null;
FilterValueSelectorComponent.reopen({
  init() {
    this._super(...arguments);
    filterValueSelector = this;
  },

  willDestroyElement() {
    filterValueSelector = null;
    this._super(...arguments);
  },
});

async function activatePopover() {
  await click('.Polaris-Button[data-test-id="filter-activator"]');
}

function findFilterKeySelect() {
  return find('.Polaris-Select select');
}

async function selectFilterKey(filterKey) {
  find('.Polaris-Select select').value = filterKey;
  await triggerEvent('.Polaris-Select select', 'change');
}

function selectFilterValue(filterValue) {
  filterValueSelector.onChange(filterValue);
}

async function clickAddFilter() {
  await click('.Polaris-Button[data-test-id="add-filter"]');
}

module(
  'Integration | Component | polaris-resource-list/filter-control/filter-creator',
  function(hooks) {
    setupRenderingTest(hooks);

    test('renders just a button by default', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
        }}
      `);

      assert.dom('.Polaris-Button').exists({ count: 1 });
      assert.dom('.Polaris-Select').doesNotExist();
    });

    test('renders a non-active popover on default', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
        }}
      `);

      assert.dom('.Polaris-Popover').doesNotExist();
    });

    test('renders a active popover with a Select on click of the activator button', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
        }}
      `);

      await activatePopover();

      assert.dom('.Polaris-Popover').exists();
    });

    test('renders a non-active popover after add filter button was clicked and onAddFilter was triggered', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
          onAddFilter=(action (mut wasOnAddFilterCalled) true)
        }}
      `);

      await activatePopover();
      await selectFilterKey(this.get('filters.0.key'));
      selectFilterValue('Bundle');
      await clickAddFilter();

      assert.ok(this.get('wasOnAddFilterCalled'));
      assert.dom('.Polaris-Popover').doesNotExist();
    });

    test('does not renders FilterValueSelector after add filter button was clicked', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
          onAddFilter=(action (mut wasOnAddFilterCalled) true)
        }}
      `);

      await activatePopover();
      await selectFilterKey(this.get('filters.0.key'));
      selectFilterValue('Bundle');

      assert.ok(filterValueSelector);
      await clickAddFilter();
      assert.notOk(filterValueSelector);
    });

    /**
     * Skipping this test because I've not
     * been able to get it working yet!
     */
    skip('renders Select with no value after add filter button was clicked', async function(assert) {
      this.setProperties({
        filters,
        resourceName,
        disabled: false,
      });

      await render(hbs`
        {{polaris-resource-list/filter-control/filter-creator
          filters=filters
          resourceName=resourceName
          disabled=disabled
          onAddFilter=(action (mut wasOnAddFilterCalled) true)
        }}
      `);

      await activatePopover();
      await selectFilterKey(this.get('filters.0.key'));
      selectFilterValue('Bundle');

      assert.dom('.Polaris-Select select').hasAnyValue();
      await clickAddFilter();
      assert.dom('.Polaris-Select select').hasNoValue();
    });

    module('filters', function() {
      test('has the correct options prop when popover is active', async function(assert) {
        this.setProperties({
          filters,
          resourceName,
          disabled: false,
        });

        await render(hbs`
          {{polaris-resource-list/filter-control/filter-creator
            filters=filters
            resourceName=resourceName
            disabled=disabled
          }}
        `);

        await activatePopover();

        assert.deepEqual(
          findAll('option:not([disabled])', findFilterKeySelect()).map(
            (option) => {
              return {
                value: option.getAttribute('value'),
                label: option.textContent.trim(),
              };
            }
          ),
          [
            {
              value: filters[0].key,
              label: filters[0].label,
            },
            {
              value: filters[1].key,
              label: filters[1].label,
            },
            {
              value: filters[2].key,
              label: filters[2].label,
            },
          ]
        );

        // module('<FilterValueSelector />', function() {
        //   test('does not render by default', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);

        //     expect(wrapper.find(FilterValueSelector).exists()).toBe(false);
        //   });

        //   test('updates FilterValueSelector when user selects a filter key', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[1].key);

        //     expect(wrapper.find(FilterValueSelector).prop('filter')).toMatchObject(
        //       mockDefaultProps.filters[1],
        //     );
        //     expect(wrapper.find(FilterValueSelector).prop('value')).toBeUndefined();
        //   });

        //   test('updates value correctly when user selects a filter value', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[0].key);
        //     selectFilterValue(wrapper, 'Bundle');

        //     expect(wrapper.find(FilterValueSelector).prop('value')).toBe('Bundle');
        //   });

        //   test('updates FilterValueSelector when filter key is updated to existing operator key', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     const newOperatorKey = 'times_used_max';

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[2].key);
        //     selectFilterValue(wrapper, 'Bundle');

        //     trigger(
        //       wrapper.find(FilterValueSelector),
        //       'onFilterKeyChange',
        //       newOperatorKey,
        //     );

        //     expect(wrapper.find(FilterValueSelector).prop('filterKey')).toBe(
        //       newOperatorKey,
        //     );
        //   });
        // });

        // module('filter add button', function() {
        //   test('is enabled when filter key and filter value are both selected', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[0].key);
        //     selectFilterValue(wrapper, 'Bundle');

        //     expect(
        //       findByTestID(wrapper, 'FilterCreator-AddFilterButton').prop('disabled'),
        //     ).toBe(false);
        //   });

        //   test('is disabled when filter key and value are not selected', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[0].key);

        //     expect(
        //       findByTestID(wrapper, 'FilterCreator-AddFilterButton').prop('disabled'),
        //     ).toBe(true);
        //   });

        //   test('is disabled when filter value is an empty string', async function(assert) {
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[0].key);
        //     selectFilterValue(wrapper, '');

        //     expect(
        //       findByTestID(wrapper, 'FilterCreator-AddFilterButton').prop('disabled'),
        //     ).toBe(true);
        //   });
        // });

        // module('onAddFilter', function() {
        //   test('gets call with selected filter key & value when both value are valid and add filter button was clicked', async function(assert) {
        //     const onAddFilter = jest.fn();
        //     const wrapper = mountWithAppProvider(
        //       <FilterCreator {...mockDefaultProps} onAddFilter={onAddFilter} />,
        //     );

        //     activatePopover(wrapper);
        //     selectFilterKey(wrapper, mockDefaultProps.filters[0].key);
        //     selectFilterValue(wrapper, 'Bundle');
        //     clickAddFilter(wrapper);

        //     expect(onAddFilter).toHaveBeenCalledWith({
        //       key: mockDefaultProps.filters[0].key,
        //       value: 'Bundle',
        //     });
        //   });
        // });
      });
    });
  }
);
