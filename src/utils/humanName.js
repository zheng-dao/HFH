export default function humanName(person, withWrapperTags = false) {
  const first_name = person?.first_name || '';
  const last_name = person?.last_name || '';
  const name = first_name + ' ' + (person?.middle_initial ? person?.middle_initial : '') + ' ' + last_name;
  if (withWrapperTags) {
    return '<strong>' + name.replace(/\s+/g, ' ').trim() + '</strong>';
  }
  return name.replace(/\s+/g, ' ').trim();
}
