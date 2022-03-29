import dotenv from 'dotenv';

dotenv.config();
const {
  NODE_ENV,
  DHIS2_API_URL_OU_DEV,
  DHIS2_API_URL_TEI_DEV,
  DHIS2_API_URL_TEI_VERIFY_DEV,
  DHIS2_API_USERNAME_DEV,
  DHIS2_API_PASSWORD_DEV,
  // prod
  HOST,
  PORT,
  DHIS2_API_URL_OU,
  DHIS2_API_URL_TEI,
  DHIS2_API_URL_TEI_VERIFY,
  DHIS2_API_USERNAME,
  DHIS2_API_PASSWORD,
} = process.env;

let envs;
let axiosAuth;
let apiURLs;
const hostPort = { HOST, PORT };
if (NODE_ENV === 'development') {
  envs = {
    PORT,
    HOST,
    DHIS2_API_URL_OU,
    DHIS2_API_URL_TEI,
    DHIS2_API_URL_TEI_VERIFY,
    DHIS2_API_USERNAME_DEV,
    DHIS2_API_PASSWORD_DEV,
  };

  apiURLs = {
    DHIS2_API_BASE_URL: 'https://southsudanhis.org/covid19southsudan',
    DHIS2_API_URL_OU_DEV,
    DHIS2_API_URL_TEI_DEV,
    DHIS2_API_URL_TEI_VERIFY_DEV,
  };

  axiosAuth = {
    username: DHIS2_API_USERNAME_DEV,
    password: DHIS2_API_PASSWORD_DEV,
  };
}
else {
  apiURLs = {
    DHIS2_API_BASE_URL: 'https://southsudanhis.org',
    DHIS2_API_URL_OU,
    DHIS2_API_URL_TEI,
    DHIS2_API_URL_TEI_VERIFY,
  };

  axiosAuth = {
    username: DHIS2_API_USERNAME,
    password: DHIS2_API_PASSWORD,
  };
}

const DHIS2_API_BASE_URL = apiURLs;
const auth = axiosAuth;

export { hostPort, auth, DHIS2_API_BASE_URL };
