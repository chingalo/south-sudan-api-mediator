import http from '../../commons/utils/httpServices';
import { auth } from '../../commons/utils/authConfig';
import {
  notFound,
  somethingWrongErr,
  success,
  tryCatchExceptions,
} from '../helpers/poeMessages';
import { getFacilitiesURL } from '../../commons/constants/commonEndpoint';
import { getEventURL, postEventURL } from '../../commons/constants/poeAirport';

// load OUs assigned to program
const getFacilities = async (req, res) => {
  try {
    const poeProgramId = 'ArXGGyMgxL4';
    const url = getFacilitiesURL(poeProgramId); // EVENT PROGRAM POE AIR
    const results = await http.get(url, {
      auth,
    });
    if (!results) return somethingWrongErr(res);
    const { organisationUnits } = results.data;
    return success(res, organisationUnits);
  } catch (error) {
    somethingWrongErr(res);
  }
};

// get visit info to prepopulate on the form
const getVisitor = async (req, res) => {
  try {
    const { visitorHistoryId } = req.data;
    console.log(visitorHistoryId);
    const url = getEventURL(visitorHistoryId);
    const results = await http.get(url, { auth });
    if (!results.data) return notFound(res);
    // get only the required data field to prepopulate on the UI
    let firstName, lastName, dateOfBirth, gender, email, phone;
    results.data.dataValues.map(({ value, dataElement }) => {
      if (dataElement === 'YCHZU8pxHLI') return (firstName = value);
      if (dataElement === 'gms6oEPUk7D') return (lastName = value);
      if (dataElement === 'Pe3CHmZicqT') return (dateOfBirth = value);
      if (dataElement === 'K6ciAYeQKWL') return (gender = value);
      if (dataElement === 'hW9Gm4wqanx') return (email = value);
      if (dataElement === 'Cs1wQfbUHSV') return (phone = value);
    });
    success(res, { firstName, lastName, dateOfBirth, gender, email, phone });
  } catch (error) {
    tryCatchExceptions(res, error);
  }
};

// post visitor data to DHIS2 events
const postVistor = async (req, res) => {
  try {
    // get data
    const {
      firstName,
      lastName,
      nationality,
      passportId,
      issuingCountry,
      age,
      gender,
      travelMode,
      departureAirport,
      departureCountry,
      flightNo,
      arrivalDate,
      arrivalPort,
      stayDuration,
      stayAddress,
      stayEmail,
      stayPhone,
      countryVisited1,
      countryVisited2,
      countryVisited3,
      ebolaContact,
      covidContact,
      animalContact,
      signsSymptoms,
      signsSymptomsSelected,
    } = req.body;
    const dataValues = [
      { dataElement: 'YCHZU8pxHLI', value: firstName }, // firstName
      { dataElement: 'gms6oEPUk7D', value: lastName }, // last name
      { dataElement: 'MQ1WrfzMvbE', value: nationality }, // nationality
      { dataElement: 'v5KB4meGBFe', value: passportId }, // passport number
      { dataElement: 'Rcs5V3Xsloq', value: issuingCountry }, // passport issueing country
      { dataElement: 'Pe3CHmZicqT', value: age }, // date of birth / age
      { dataElement: 'K6ciAYeQKWL', value: gender }, // gender
      { dataElement: 'aIJWYDBFVQT', value: departureAirport }, // departure airport
      { dataElement: 'cZpW431xdsq', value: departureCountry }, // country of departure
      // { dataElement: 'someuuid', value: arrivalDate }, // country of departure

      { dataElement: 'eOOFtYiBS79', value: flightNo }, // departure flight number
      { dataElement: 'oBhPNGyqn2a', value: stayDuration }, // Duration of Stay in South Sudan(in days)
      { dataElement: 'fAtpkycHG2R', value: stayAddress }, // physical address in Juba
      { dataElement: 'hW9Gm4wqanx', value: stayEmail }, // stay email address while in SSD
      { dataElement: 'Cs1wQfbUHSV', value: stayPhone }, // stay phone number in ssd
      { dataElement: 'KhAl7eY8tdX', value: countryVisited1 }, // 1st Country Visited in Last 21 days
      { dataElement: 'AOg1wewJiRE', value: countryVisited2 }, // 2nd Country Visited in Last 21 days
      { dataElement: 'Xak52XWejN2', value: countryVisited3 }, // 3rd Country Visited in Last 21 days
      { dataElement: 'S6Gct1kOGKh', value: ebolaContact }, // In the Past 21 days, Have You had Contact With a Suspected or Confirmed Ebola Case
      { dataElement: 'wCjASq6bH2C', value: covidContact }, // In the Past 14 days, Have You had Contact with a Suspect or Confirmed Case of the COVID19
      { dataElement: 'weTF1HjA6o1', value: animalContact }, // In the Past 21 days, Have You had Contact With a Sick or Dead Animal?
      { dataElement: 'JGnHr6WI3AY', value: signsSymptoms }, // Sign/Symptoms Present (when selected yes to Any signs or symptoms? Below objects are displayed)
      // { dataElement: 'EWZcuvPOrJF', value: 'true' }, // Sign/Symptoms Fever
      // { dataElement: 'BH5SRLl5PfH', value: '36' }, // Temperature(when selected true to fever )
      // { dataElement: 'JRQbs8iwbj0', value: 'true' }, // Unexplained bleeding
      // { dataElement: 'HahhmzRvwu8', value: 'true' }, // Sign/Symptoms muscle pain
      // { dataElement: 'iUEwXfg9CgD', value: 'true' }, // Sign/Symptoms headache
      // { dataElement: 'C8J5HoUNIuG', value: 'true' }, // Difficulty in swallowing
      // { dataElement: 'FLldQkmyokg', value: 'true' }, // Loss of appetite
      // { dataElement: 'wtCmGyawb4E', value: 'true' }, // Sign/Symptoms Nausea/vomiting pain
      // { dataElement: 'IrFWIj5ks2p', value: 'true' }, // Sign/Symptoms diarrhea
      // { dataElement: 'l2CCqtRVrOg', value: 'true' }, // Lethargy (general weakness)
      // { dataElement: 'ySDjXlmGIye', value: 'true' }, // Stomach Pain
      // { dataElement: 'SeKu9WMNh16', value: 'true' }, // Sign/Symptoms skin rash
      // { dataElement: 'Nbs08NkwUVK', value: 'true' }, // Breathing difficulties
      // { dataElement: 'xJFi2DwJ6sY', value: 'true' }, // Hiccups
      // { dataElement: 'T0ehgpsDrui', value: 'true' }, // Sign/Symptoms sore throat
    ];
    // signs and symptoms options selected
    if (signsSymptomsSelected.length !== 0) {
      signsSymptomsSelected.map(({ value: id, label }) => {
        return dataValues.push({ dataElement: id, value: 'true' });
      });
    } else {
    // do nothing
    }

    // data format to send to DHIS2
    const data = {
      eventDate: arrivalDate,
      program: 'ArXGGyMgxL4',
      programStage: 'ePHVvZFGdZo',
      orgUnit: arrivalPort,
      dataValues,
    };
    // send data
    const url = postEventURL();
    const results = await http.post(url, data, { auth });
    if (!results) return somethingWrongErr(res);
    const { httpStatusCode, response } = results.data;
    if (httpStatusCode !== 200) return somethingWrongErr(res);
    const { reference: visitorId } = response.importSummaries[0];
    success(res, visitorId);
  } catch (error) {
    tryCatchExceptions(res, error);
  }
};

// verify visitor data when they
const verifyVisitor = async (req, res) => {
  try {
    const { visitorId } = req.query;
    const url = getEventURL(visitorId);
    const results = await http.get(url, { auth });
    if (!results.data) return notFound(res);
    const { orgUnit, orgUnitName, eventDate, dataValues } = results.data;
    const data = [];
    dataValues.map(({ value, dataElement }) => {
      return data.push({ dataElement, value });
    });
    success(res, {
      orgUnit, orgUnitName, eventDate, data,
    });
  } catch (error) {
    tryCatchExceptions(res, error);
  }
};

export { getFacilities, getVisitor, postVistor, verifyVisitor};
