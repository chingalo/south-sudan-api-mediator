import { DHIS2_API_BASE_URL } from '../utils/authConfig';

const { DHIS2_API_BASE_URL: baseUrl } = DHIS2_API_BASE_URL;
const getFacilitiesURL = (program) => (
  `${baseUrl}/api/programs/${program}/organisationUnits?fields=id~rename(value), name~rename(label), !level,!ancestors[id, name, level]`
);

export { getFacilitiesURL };
