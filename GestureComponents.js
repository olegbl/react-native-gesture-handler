import React from 'react';
import ReactNative from 'react-native';

import createNativeWrapper from './createNativeWrapper';

const MEMOIZED = {};

function memoizeWrap(Component, config) {
  const memoized = MEMOIZED[Component.displayName];
  if (memoized) {
    return memoized;
  }
  return (MEMOIZED[Component.displayName] = createNativeWrapper(
    Component,
    config
  ));
}

function memoizeFlatList() {
  if (!MEMOIZED.FlatList) {
    const ScrollView = memoizeWrap(ReactNative.ScrollView, {
      disallowInterruption: true,
    });
    MEMOIZED.FlatList = React.forwardRef((props, ref) => (
      <ReactNative.FlatList
        ref={ref}
        {...props}
        renderScrollComponent={scrollProps => <ScrollView {...scrollProps} />}
      />
    ));
  }
  return MEMOIZED.FlatList;
}

module.exports = {
  /* RN's components */
  get ScrollView() {
    return memoizeWrap(ReactNative.ScrollView, {
      disallowInterruption: true,
    });
  },
  get Switch() {
    return memoizeWrap(ReactNative.Switch, {
      shouldCancelWhenOutside: false,
      shouldActivateOnStart: true,
      disallowInterruption: true,
    });
  },
  get TextInput() {
    return memoizeWrap(ReactNative.TextInput);
  },
  get DrawerLayoutAndroid() {
    const DrawerLayoutAndroid = memoizeWrap(ReactNative.DrawerLayoutAndroid, {
      disallowInterruption: true,
    });
    DrawerLayoutAndroid.positions = ReactNative.DrawerLayoutAndroid.positions;
    return DrawerLayoutAndroid;
  },
  get FlatList() {
    return memoizeFlatList();
  },
};
