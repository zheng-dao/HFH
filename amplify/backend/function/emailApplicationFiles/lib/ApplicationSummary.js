import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import styles from './Stylesheet';
import TableRow from './TableRow';

const ApplicationSummary = (props) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>{props.sectionTitle}</Text>
      <View style={styles.ul}>
        {props.listItems.map((item, index) => (
          <TableRow key={index} title={item.title} isLast={index == props.listItems.length - 1}>
            {item.value}
          </TableRow>
        ))}
      </View>
    </View>
  );
};

export default ApplicationSummary;
