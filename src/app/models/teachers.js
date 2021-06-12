const db = require("../../config/db");

const { date } = require("../../lib/utils");

module.exports = {
  // all
  all(callback) {
    db.query(
      `SELECT * FROM teachers    
    `,

      function (err, results) {
        if (err) throw `Database Error! ${err}`;

        callback(results.rows);
      }
    );
  },
  // create
  create(data, callback) {
    const query = `
        INSERT INTO teachers (
            name,
            avatar_url,
            birth,
            schooling,
            class_type,
            subjects,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `;
    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.schooling,
      data.class_type,
      data.subjects,
      date(Date.now()).iso,
    ];

    db.query(query, values, function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
  // find
  find(id, callback) {
    db.query(
      `SELECT * FROM teachers
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
    UPDATE teachers SET
      name=($1),
      avatar_url=($2),
      birth=($3),
      schooling=($4),
      class_type=($5),
      subjects=($6)
    WHERE id=($7)
    `;

    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.schooling,
      data.class_type,
      data.subjects,
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
      `DELETE FROM teachers
      WHERE id=$1`,
      [id],
      function (err, results) {
        if (err) throw `Database error! ${err}`;

        return callback();
      }
    );
  },
};
