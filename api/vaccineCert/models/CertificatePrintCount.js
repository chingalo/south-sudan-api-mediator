import pool from './DbConfig';

// create table if not exist
const userCertificateSchema = `
CREATE TABLE IF NOT EXISTS
CertificatesPrinted( 
  user_id VARCHAR(100) PRIMARY KEY NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  occupation VARCHAR(150) NOT NULL,
  dob VARCHAR(150) NOT NULL,
  address VARCHAR(150),
  print_count smallint DEFAULT 0,
  printed_on VARCHAR(150) ,
  reprinted_on VARCHAR(150) 
)
`;

pool.query(userCertificateSchema, (error, results) => {
  if (error) return console.log(`sorry! cannot create moniter cert table ${error}`);
});

class CertificatePrintCount {
  constructor(
    userId,
    fullName,
    occupation,
    dob,
    address,
    printedOn,
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.occupation = occupation;
    this.dob = dob;
    this.address = address;
    this.printedOn = printedOn;
  }

  // create new user data for certificate printed
  storeCertificatePrint() {
    const query = `INSERT INTO CertificatesPrinted(user_id, full_name, occupation, dob, address, printed_on)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id, full_name, print_count, printed_on, reprinted_on `;
    const values = [
      this.userId,
      this.fullName,
      this.occupation,
      this.dob,
      this.address,
      this.printedOn,
    ];
    return pool.query(query, values);
  }

  // get all printed certifcate counts -> te
  static getPrintCount() {
    return pool.query('SELECT COUNT(*) FROM CertificatesPrinted ');
  }

  // get printed certifcate by userid-> tei of dhis2
  static getPrintCountByUser(userId) {
    return pool.query(
      'SELECT print_count FROM CertificatesPrinted WHERE user_id=$1',
      [userId],
    );
  }

  // get all printed certifcate data and do some operation to provide to dashboard
  static getAllPrints() {
    return pool.query('SELECT * FROM CertificatesPrinted ORDER BY printed_on DESC ');
  }

  // update counts when same user is reprinting the certificate,
  // get cuurent count first before updating
  static updateCertifcateCount(updatedCount, reprintedOn, userId) {
    const query = `UPDATE CertificatesPrinted 
    SET print_count=$1, reprinted_on= $2
    WHERE user_id=$3`;
    const values = [updatedCount, reprintedOn, userId];
    return pool.query(query, values);
  }
}

export default CertificatePrintCount;
