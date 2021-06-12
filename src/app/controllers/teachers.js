const Teacher = require("../models/teachers");

const {
  date,
  getAge,
  getGraduationText,
  getClassTypeText,
} = require("../../lib/utils");

module.exports = {
  index(req, res) {
    Teacher.all(function (foundteachers) {
      let teachers = [];
      for (const teacher of foundteachers) {
        teachers.push({
          ...teacher,
          subjects: String(teacher.subjects).split(","),
        });
      }

      return res.render("teachers/index", { teachers });
    });
  },

  create(req, res) {
    return res.render("teachers/create");
  },

  post(req, res) {
    const Keys = Object.keys(req.body);

    for (const key of Keys) {
      // req.body.key == ''
      if (req.body[key] == "") {
        return res.send("Por favor , preencha todos os campos");
      }
    }

    Teacher.create(req.body, function (teacher) {
      return res.redirect(`/teachers/${teacher.id}`);
    });
  },

  show(req, res) {
    Teacher.find(req.params.id, function (foundTeacher) {
      teacher = {
        ...foundTeacher,
        age: getAge(foundTeacher.birth),

        schooling: getGraduationText(foundTeacher.schooling),

        class_type: getClassTypeText(foundTeacher.class_type),

        subjects: String(foundTeacher.subjects).split(","),

        created_at: date(foundTeacher.created_at).format,
      };
      return res.render("teachers/show", { teacher });
    });
  },

  edit(req, res) {
    Teacher.find(req.params.id, function (foundTeacher) {
      const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso,
      };
      return res.render("teachers/edit.njk", { teacher });
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

    Teacher.update(req.body, function () {
      return res.redirect(`/teachers/${req.body.id}`);
    });
  },

  delete(req, res) {       
    Teacher.delete(req.body.id,
      function () {
        return res.redirect("/teachers")
      })      
  },
};
