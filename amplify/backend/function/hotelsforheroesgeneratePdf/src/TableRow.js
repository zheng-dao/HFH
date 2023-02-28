import React from 'react';
import { Text } from '@react-pdf/renderer';
import styles from './Stylesheet';

const TableRow = ({ isLast, title, children }) => {
  const liStyles = [styles.li, isLast ? styles.liLast : {}];

  const titleToShow = title.slice(-1) === '?' ? title : title + ':';

  return (
    <Text style={liStyles}>
      {title && <Text style={styles.strong}>{titleToShow} </Text>}
      {children}
    </Text>
  );
};

export default TableRow;
