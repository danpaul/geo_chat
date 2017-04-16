import React from 'react';
import { Text } from 'react-native';

const TabIcon = ({ selected, title }) =>
    <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>;

export default TabIcon;
