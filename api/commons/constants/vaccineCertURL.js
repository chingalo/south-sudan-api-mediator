import { DHIS2_API_BASE_URL } from '../utils/authConfig';

const { DHIS2_API_BASE_URL: baseUrl } = DHIS2_API_BASE_URL;
const getTEIURL = (attribute, value) => (
  `${baseUrl}/api/trackedEntityInstances/query.json?ou=he6RdNPCKhY&ouMode=ACCESSIBLE&program=yDuAzyqYABS&pageSize=10&page=1&totalPages=false&attribute=${attribute}:EQ:${value}`
);

const getTEIDataURL = (id) => (
  `${baseUrl}/api/trackedEntityInstances/${id}/?program=yDuAzyqYABS&programStage=a1jCssI2LkW&fields=trackedEntityInstance,attributes[attribute,value],enrollments[status,program,orgUnit,events[status,enrollmentStatus,eventDate,orgUnitName,programStage,dataValues[dataElement,value]]]`
);

const getFacilitiesURL = () => (
  `${baseUrl}/api/programs/yDuAzyqYABS/organisationUnits?fields=id, name, level,ancestors[id, name, level]`

);

export { getTEIURL, getTEIDataURL, getFacilitiesURL };
