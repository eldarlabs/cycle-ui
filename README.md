eldarlabs/cycle-ui
====

A Cycle.js HTML component library.

An experimental work in progress conversion of react-toolbox components to
Cycle.js components. Currently using the Material Design styles from react-toolbox, although this may be changed to a styles interface and be made interchangeable with other styles.

How to use
----------

Note: I want to bring a proposal to Cycle-DOM to allow removal of the .DOM boilerplate. 

    // Import components you want to use
    import { Input, RadioButton } from '@eldarlabs/cycle-ui';

    // Use components in your Cycle.js view

    return div([
      h3('.example', [`Using Cycle-UI`]),
      Input(sources, {
          label: `Answer to life`,
          maxLength: 50,
        },
      ).DOM,
      RadioButton(sources, {
        label: 'Radio easy',
        checked: true,
      }).DOM,
    ])



Related projects
----------------

- [Cycle.js](http://cycle.js.org) required to use the cycle-ui components.
- [React Toolbox Components](http://react-toolbox.com/#/components) uses these styles

License
=======

[The MIT License](https://raw.githubusercontent.com/eldarlabs/cycle-ui/master/LICENSE)

Copyright (c) 2016 [Eldar Labs](https://eldarlabs.com)
