import axios from 'axios';
import { getTEIDataURL } from '../../commons/constants/vaccineCertURL';
import { notFound, success, tryCatchExceptions } from './messages';
import { auth } from '../../commons/utils/authConfig';

const teiEnrollments = async (teiId, res) => {
  try {
    const urlTEI = getTEIDataURL(teiId);
    const response = await axios.get(urlTEI, {
      auth,
    });
    if (!response) return notFound(res);
    const { attributes, enrollments } = response.data;
    if (!enrollments.length) return notFound(res);
    let dataResponse;
    enrollments.map(
      ({ program, status, enrollmentStatus, events }, indexTei) => {
        // get users enrolled to only vaccine program
        if (program !== 'yDuAzyqYABS') return notFound(res);
        if (!events.length) return notFound(res);
        const filteredEvents = events.filter(
          (
            {
              status,
              enrollmentStatus,
              dataValues,
              eventDate,
              orgUnitName,
              length,
            },
            indexFE
          ) => {
            if (dataValues.length !== 0) {
              return { eventDate, orgUnitName, dataValues };
            }
          },
        ); // end filter events

        if (!filteredEvents || filteredEvents.length === 0) {
          return notFound(res); // no events
        }
        // filtered results to sent to client
        dataResponse = {
          teiId,
          attributes,
          enrollments: filteredEvents,
        };
      },
    );
    success(res, dataResponse);
  } catch (error) {
    return tryCatchExceptions(res, error);
  }
};

export { teiEnrollments };
