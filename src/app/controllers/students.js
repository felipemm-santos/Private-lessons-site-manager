const Student = require("../models/students");

const { getAge, getGradeText, date } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    Student.all(function (foundStudents) {
      let students = [];
      for (const student of foundStudents) {
        students.push({
          ...student,
          school_year: getGradeText(student.school_year),
        });
      }

      return res.render("students/index", { students });
    });
  },

  create(req, res) {
    return res.render("students/create");
  },

  post(req, res) {
    const Keys = Object.keys(req.body);

    for (const key of Keys) {
      // req.body.key == ''
      if (req.body[key] == "") {
        return res.send("Por favor , preencha todos os campos");
      }
    }

    Student.create(req.body, function (student) {
      return res.redirect(`/students/${student.id}`);
    });
  },

  show(req, res) {
    Student.find(req.params.id, function (foundStudent) {
      console.log(foundStudent.birth);
      student = {
        ...foundStudent,
        age: getAge(foundStudent.birth),
        school_year: getGradeText(foundStudent.school_year),
      };

      return res.render("students/show", { student });
    });
  },

  edit(req, res) {
    Student.find(req.params.id, function (foundStudent) {
      student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso,
      };

      return res.render("students/edit", { student });
    });
  },

  put(req, res) {
    const Keys = Object.keys(req.body);

    for (const key of Keys) {
      // req.body.key == ''
      if (req.body[key] == "") {
        return res.send("Por favor , preencha todos os campos");
      }
    }

    Student.update(req.body, function () {
      return res.redirect(`/students/${req.body.id}`);
    });
  },

  delete(req, res) {
    Student.delete(req.body.id, function () {
      return res.redirect("/students");
    });
  },
};
