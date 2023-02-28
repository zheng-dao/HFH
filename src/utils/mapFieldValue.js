export const mapFieldValue = (value) => {
  switch (value) {
    case 'first_name':
      return 'First Name';

    case 'middle_initial':
      return 'Middle Initial';

    case 'last_name':
      return 'Last Name';

    case 'email':
      return 'Email';

    case 'telephone':
      return 'Telephone';

    case 'extension':
      return 'Extension';

    case 'address':
      return 'Street Address';

    case 'address_2':
      return 'Street Address 2';

    case 'city':
      return 'City';

    case 'state':
      return 'State';

    case 'zip':
      return 'Zip';

    case 'relationship':
      return 'Relationship to Service Member';

    default:
      return value;
  }
};
