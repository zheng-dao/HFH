import GroupChangeDialog from '../GroupChangeDialog';
import GroupForm from '../GroupForm';
import { useState } from 'react';

export default function GroupMainColumn(props) {
  return (
    <div className="main-column">
      <GroupForm {...props} />
    </div>
  );
}
