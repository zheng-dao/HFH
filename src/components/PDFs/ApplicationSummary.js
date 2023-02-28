import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import styles from './Stylesheet';
import TableRow from './TableRow';

const ApplicationSummary = (props) => {
  return (
    <View>
      {
        !props.hideTitle && <Text style={styles.sectionTitle}>{props.sectionTitle}</Text>
      }
      
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
