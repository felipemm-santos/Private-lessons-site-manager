const db = require("../../config/db");

const { date } = require("../../lib/utils");

module.exports = {
  // all
  all(callback) {
    db.query(`SELECT * FROM students`, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  // create
  create(data, callback) {
    const query = `
        INSERT INTO students (
            name,
            avatar_url,
            email,
            birth,
            school_year,
            study_hours
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;
    const values = [
      data.name,
      data.avatar_url,
      data.email,
      date(data.birth).iso,
      data.school_year,
      data.study_hours,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
  // find
  find(id, callback) {
    db.query(
      `SELECT * FROM students
        WHERE id= $1`,
      [id],
      function (err, results) {
        if (err) throw `Database error! ${err}`;
        callback(results.rows[0]);
      }
    );
  },
  // update
  update(data, callback) {
    const query = `
    UPDATE students SET
      name=($1),
      avatar_url=($2),
      email=($3),
      birth=($4),
      school_year=($5),
      study_hours=($6)
    WHERE id=($7)
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.email,
      date(data.birth).iso,
      data.school_year,
      data.study_hours,
      data.id,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback();
    });
  },
  // delete
  delete(id, callback) {
    db.query(
      `DELETE FROM students
      WHERE id=$1`,
      [id],
      function (err, results) {
        if (err) throw `Database error! ${err}`;

        return callback();
      }
    );
  },
};
