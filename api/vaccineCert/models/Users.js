import pool from './DbConfig';

// create table if not exist
const userSchema = `
CREATE TABLE IF NOT EXISTS
CertificatesUsers(
  email VARCHAR(150) PRIMARY KEY NOT NULL,
  user_id VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL,
  role VARCHAR(100) NOT NULL,
  created_on VARCHAR(150) NOT NULL
)
`;
// excute the query to create the table
pool.query(userSchema, (error, results) => {
  if (error) return console.log(`sorry! cannot create users table ${error}`);
});

class Users {
  constructor(email, userId, fullName, password, role, createdOn) {
    this.email = email;
    this.userId = userId;
    this.fullName = fullName;
    this.password = password;
    this.role = role;
    this.createdOn = createdOn;
  }

  // create new user account
  createAccount() {
    const query = `INSERT INTO CertificatesUsers(email, user_id, full_name, password,role, created_on)
    VALUES($1, $2, $3, $4, $5, $6)`;
    const values = [this.email, this.userId, this.fullName, this.password, this.role, this.createdOn];
    return pool.query(query, values);
  }

  // login to view certificate printed counts
  static getUsers(email, userId) {
    return pool.query('SELECT * FROM CertificatesUsers WHERE email=$1 OR user_id =$2', [email, userId]);
  }

  // view all CertificatesUsers who are currently monitering the certifcate printing
  static getAllUsers() {
    return pool.query('SELECT * FROM CertificatesUsers ORDER BY createdon DESC');
  }
}

export default Users;
