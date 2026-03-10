// // import db from './index';

// // export const insertUser = (name, phone, email, designation, address) => {
// //   db.runSync(
// //     `INSERT INTO user (name, phone, email, designation, address) VALUES (?, ?, ?, ?, ?);`,
// //     [name, phone, email, designation, address]
// //   );

// //   console.log("User inserted successfully");
// // };

// // export const getUsers = () => {
// //   const result = db.getAllSync(`SELECT * FROM user;`);
// //   return result;
// // };
// import db from './index';

// export const saveOrUpdateUser = (data) => {

//   const existing = db.getAllSync("SELECT * FROM user LIMIT 1;");

//   if (existing.length > 0) {
//     // UPDATE
//     db.runSync(
//       `UPDATE user 
//        SET name = ?, designation = ?, phone = ?, email = ?, address = ?
//        WHERE id = ?;`,
//       [
//         data.name,
//         data.designation,
//         data.phone,
//         data.email,
//         data.address,
//         existing[0].id
//       ]
//     );
//     console.log("User updated ✅");
//   } else {
//     // INSERT
//     db.runSync(
//       `INSERT INTO user (name, designation, phone, email, address)
//        VALUES (?, ?, ?, ?, ?);`,
//       [
//         data.name,
//         data.designation,
//         data.phone,
//         data.email,
//         data.address
//       ]
//     );
//     console.log("User inserted ✅");
//   }
// };

// export const getUser = () => {
//   const result = db.getAllSync("SELECT * FROM user LIMIT 1;");
//   return result.length > 0 ? result[0] : null;
// };

import db from './index';

/* ===============================
   STEP 1: INSERT / UPDATE PERSONAL DETAILS
================================= */
export const saveOrUpdateUser = (data) => {

  const existing = db.getAllSync("SELECT * FROM user LIMIT 1;");

  if (existing.length > 0) {

    db.runSync(
      `UPDATE user 
       SET name = ?, designation = ?, phone = ?, email = ?, address = ?
       WHERE id = ?;`,
      [
        data.name,
        data.designation,
        data.phone,
        data.email,
        data.address,
        existing[0].id
      ]
    );

    console.log("User updated ✅");

  } else {

    db.runSync(
      `INSERT INTO user (name, designation, phone, email, address)
       VALUES (?, ?, ?, ?, ?);`,
      [
        data.name,
        data.designation,
        data.phone,
        data.email,
        data.address
      ]
    );

    console.log("User inserted ✅");
  }
};


/* ===============================
   STEP 2: UPDATE BUSINESS DETAILS
================================= */
export const updateBusinessDetails = (data) => {

  const existing = db.getAllSync("SELECT * FROM user LIMIT 1;");

  if (existing.length > 0) {

    db.runSync(
      `UPDATE user SET
        searchKeywords = ?,
        companyName = ?,
        businessCategory = ?,
        businessSubCategory = ?,
        clients = ?,
        businessDescription = ?,
        descriptionPdf = ?,
        logoImage = ?
      WHERE id = ?;`,
      [
        data.searchKeywords,
        data.companyName,
        data.businessCategory,
        data.businessSubCategory,
        data.clients,
        data.businessDescription,
        data.descriptionPdf?.uri || null,
        data.logoImage?.uri || null,
        existing[0].id
      ]
    );

    console.log("Business details updated ✅");

  } else {

    console.log("No user found. Save personal details first.");
  }
};


/* ===============================
   GET USER (Used Everywhere)
================================= */
export const getUser = () => {
  const result = db.getAllSync("SELECT * FROM user LIMIT 1;");
  return result.length > 0 ? result[0] : null;
};


/* ===============================
   OPTIONAL: CLEAR DATABASE
================================= */
export const clearUserTable = () => {
  db.runSync("DELETE FROM user;");
  console.log("User table cleared 🗑️");
};