import { DHIS2_API_BASE_URL } from '../utils/authConfig';

const { DHIS2_API_BASE_URL: baseUrl } = DHIS2_API_BASE_URL;

const getEventURL = (eventId) => (
  `${baseUrl}/api/events/${eventId}`
);
const postEventURL = () => (
  `${baseUrl}/api/events/`
);
const searchEventURL = (passPortNumber, nationality) => (
  `${baseUrl}/api/events/query.json?orgUnit=he6RdNPCKhY&ouMode=DESCENDANTS&program=ArXGGyMgxL4&programStage=ePHVvZFGdZo&filter=v5KB4meGBFe:EQ:${passPortNumber}&filter=QwzbmOS6Loa:in:${nationality}`
);

export { searchEventURL, getEventURL, postEventURL };
