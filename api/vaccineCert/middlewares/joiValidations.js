import Joi from 'joi';
import { joiError } from '../helpers/messages';

const CertifcateAttributesValidate = (req, res, next) => {
  const schemaId = Joi.object({
    uniqueId: Joi.string().required().label('Unique Vaccination Id'),
  });

  const schemaPhone = Joi.object({
    phone: Joi.string().required().min(9).max(12)
      .label('Phone Number'),
  });
  const { uniqueId, phone } = req.query;
  let errorValidation;
  if (uniqueId !== '') {
    errorValidation = schemaId.validate({ uniqueId });
  } else {
    errorValidation = schemaPhone.validate({ phone });
  }
  const { error } = errorValidation;
  if (error) return joiError(error, res);
  next();
};

export { CertifcateAttributesValidate };
