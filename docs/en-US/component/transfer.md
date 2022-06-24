---
title: Transfer
lang: en-US
---

# Transfer

## Customizable

You can customize list titles, button texts, render function for data items, checking status texts in list footer and list footer contents.

:::demo Use `titles`, `button-texts`, `render-content` and `format` to respectively customize list titles, button texts, render function for data items, checking status texts in list header. Plus, you can also use scoped slot to customize data items. For list footer contents, two named slots are provided: `left-footer` and `right-footer`. Plus, if you want some items initially checked, you can use `left-default-checked` and `right-default-checked`. Finally, this example demonstrate the `change` event. Note that this demo can't run in jsfiddle because it doesn't support JSX syntax. In a real project, `render-content` will work if relevant dependencies are correctly configured.

transfer/basic

:::

## Prop aliases

By default, Transfer looks for `key`, `label` and `disabled` in a data item. If your data items have different key names, you can use the `props` attribute to define aliases.

:::demo The data items in this example do not have `key`s or `label`s, instead they have `value`s and `desc`s. So you need to set aliases for `key` and `label`.

transfer/prop-alias

:::

## Attributes

| Attribute             | Description                                                                                                                                                                                                                                                                        | Type                              | Accepted Values           | Default                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| model-value / v-model | binding value                                                                                                                                                                                                                                                                      | array                             | —                         | —                                                                         |
| data                  | data source                                                                                                                                                                                                                                                                        | array[`{ key, label, disabled }`] | —                         | [ ]                                                                       |
| filterable            | whether Transfer is filterable                                                                                                                                                                                                                                                     | boolean                           | —                         | false                                                                     |
| filter-placeholder    | placeholder for the filter input                                                                                                                                                                                                                                                   | string                            | —                         | Enter keyword                                                             |
| filter-method         | custom filter method                                                                                                                                                                                                                                                               | function                          | —                         | —                                                                         |
| target-order          | order strategy for elements in the target list. If set to `original`, the elements will keep the same order as the data source. If set to `push`, the newly added elements will be pushed to the bottom. If set to `unshift`, the newly added elements will be inserted on the top | string                            | original / push / unshift | original                                                                  |
| titles                | custom list titles                                                                                                                                                                                                                                                                 | array                             | —                         | ['List 1', 'List 2']                                                      |
| button-texts          | custom button texts                                                                                                                                                                                                                                                                | array                             | —                         | [ ]                                                                       |
| render-content        | custom render function for data items                                                                                                                                                                                                                                              | function(h, option)               | —                         | —                                                                         |
| format                | texts for checking status in list header                                                                                                                                                                                                                                           | object`{noChecked, hasChecked}`   | —                         | `{ noChecked: '${checked}/${total}', hasChecked: '${checked}/${total}' }` |
| props                 | prop aliases for data source                                                                                                                                                                                                                                                       | object`{key, label, disabled}`    | —                         | —                                                                         |
| left-default-checked  | key array of initially checked data items of the left list                                                                                                                                                                                                                         | array                             | —                         | [ ]                                                                       |
| right-default-checked | key array of initially checked data items of the right list                                                                                                                                                                                                                        | array                             | —                         | [ ]                                                                       |

## Slots

| Name         | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| —            | Custom content for data items. The scope parameter is { option } |
| left-footer  | content of left list footer                                      |
| right-footer | content of right list footer                                     |

## Methods

| Method     | Description                                 | Parameters       |
| ---------- | ------------------------------------------- | ---------------- |
| clearQuery | clear the filter keyword of a certain panel | 'left' / 'right' |

## Events

| Event Name         | Description                                                                         | Parameters                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| change             | triggers when data items change in the right list                                   | key array of current data items in the right list, transfer direction (left or right), moved item keys |
| left-check-change  | triggers when end user changes the checked state of any data item in the left list  | key array of currently checked items, key array of items whose checked state have changed              |
| right-check-change | triggers when end user changes the checked state of any data item in the right list | key array of currently checked items, key array of items whose checked state have changed              |
