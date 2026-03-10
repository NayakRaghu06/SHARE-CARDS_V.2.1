// import db from './index';

// export const createTables = () => {
//   db.execSync(`
//     CREATE TABLE IF NOT EXISTS user (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT,
//       designation TEXT,
//       phone TEXT,
//       email TEXT,
//       address TEXT,

//       searchKeywords TEXT,
//       companyName TEXT,
//       businessCategory TEXT,
//       businessSubCategory TEXT,
//       clients TEXT,
//       businessDescription TEXT,
//       descriptionPdf TEXT,
//       logoImage TEXT
//     );
//   `);
// };

import db from './index';

/* ========================================
   CREATE TABLES (Run Once On App Start)
======================================== */
export const createTables = () => {
  try {

    db.execSync(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        /* ===== PERSONAL DETAILS ===== */
        name TEXT,
        designation TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,

        /* ===== BUSINESS DETAILS ===== */
        searchKeywords TEXT,
        companyName TEXT,
        businessCategory TEXT,
        businessSubCategory TEXT,
        clients TEXT,
        businessDescription TEXT,
        descriptionPdf TEXT,
        logoImage TEXT
      );
    `);

    console.log("User table created ✅");

  } catch (error) {
    console.log("Error creating tables:", error);
  }
};