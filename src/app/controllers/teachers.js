const fs = require("fs");
const Intl = require("intl");

const data = require("../models/data.json");

const {
  getAge,
  getGraduationText,
  getClassTypeText,
  dateFormat,
} = require("../../lib/utils");

module.exports = {
  index(req, res) {
    let teachers = [];

    for (const teacher of data.teachers) {
      teachers.push({
        ...teacher,
        subjects: String(teacher.subjects).split(","),
      });
    }

    return res.render("teachers/index", { teachers });
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

    req.body.birth = Date.parse(req.body.birth);
    req.body.created_at = Date.now();

    const lastTeacher = data.teachers[data.teachers.length - 1];

    if (lastTeacher) {
      req.body.id = lastTeacher.id + 1;
    } else {
      req.body.id = 1;
    }

    data.teachers.push(req.body);

    fs.writeFile(
      "../models/data.json",
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) return res.send("Write file error !");

        return res.redirect("/teachers");
      }
    );
  },

  show(req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find((teacher) => id == teacher.id);

    if (!foundTeacher) {
      return res.render("not-found");
    }

    const teacher = {
      ...foundTeacher,
      age: getAge(foundTeacher.birth),

      schooling: getGraduationText(foundTeacher.schooling),

      class_type: getClassTypeText(foundTeacher.class_type),

      subjects: String(foundTeacher.subjects).split(","),

      created_at: new Intl.DateTimeFormat("pt-BR").format(
        foundTeacher.created_at
      ),
    };

    return res.render("teachers/show", { teacher });
  },

  edit(req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find((teacher) => id == teacher.id);

    if (!foundTeacher) {
      return res.render("not-found");
    }

    const teacher = {
      ...foundTeacher,
      birth: dateFormat(foundTeacher.birth).iso,
    };

    return res.render("teachers/edit.njk", { teacher });
  },

  put(req, res) {
    const { id } = req.body;

    let index = 0;

    const foundTeacher = data.teachers.find((teacher, foundIndex) => {
      if (id == teacher.id) {
        index = foundIndex;
        return true;
      }
    });

    if (!foundTeacher) {
      return res.render("not-found");
    }

    const teacher = {
      ...foundTeacher,
      ...req.body,
      birth: Date.parse(req.body.birth),
    };

    data.teachers[index] = teacher;
    fs.writeFile(
      "../models/data.json",
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) return res.send("Write file error !");

        return res.redirect(`/teachers/${id}`);
      }
    );
  },

  delete(req, res) {
    const { id } = req.body;

    const filteredTeachers = data.teachers.filter(
      (teacher) => id != teacher.id
    );

    data.teachers = filteredTeachers;

    fs.writeFile(
      "../models/data.json",
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) return res.send("Write file error!");

        return res.redirect("/teachers");
      }
    );
  },
};
