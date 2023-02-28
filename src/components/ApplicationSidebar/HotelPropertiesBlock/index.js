import { Fragment } from 'react';
import HotelPropertyBlock from './properties';

export default function HotelPropertiesBlock(props) {
  const stays = [props.initialStay].concat(
    props.extendedStays.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
  );
  if (stays.length == 0) {
    return null;
  }
  const uniqueHotelStays = stays.filter((value, index, self) => {
    return self.findIndex((s) => s?.HotelBooked?.id == value?.HotelBooked?.id) === index;
  });
  return (
    <Fragment>
      {uniqueHotelStays.map((s) => (
        <HotelPropertyBlock stay={s} key={s?.id} />
      ))}
    </Fragment>
  );
}

HotelPropertiesBlock.defaultProps = {
  initialStay: null,
  extendedStays: [],
};
