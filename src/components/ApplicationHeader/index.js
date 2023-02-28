import PageTitle from '@components/PageTitle';
import useApplicationContext from '@contexts/ApplicationContext';

export default function ApplicationHeader(props) {
  let name = '';
  const { serviceMember } = useApplicationContext();

  if (props.shouldIncludeServiceMemberName) {
    if (serviceMember?.first_name) {
      name += serviceMember.first_name + ' ';
    }
    if (serviceMember?.middle_initial) {
      name += serviceMember.middle_initial + '. ';
    }
    if (serviceMember?.last_name) {
      name += serviceMember.last_name;
    }
  }

  return (
    <PageTitle preamble={name} prefix={'Part ' + props.partNumber + ':'} title={props.partName} />
  );
}

ApplicationHeader.defaultProps = {
  partNumber: 1,
  partName: 'Liaison / Referrer',
  shouldIncludeServiceMemberName: true,
};
