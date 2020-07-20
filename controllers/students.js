const fs = require('fs');
const Intl = require('intl');

const data = require('../data.json');

const { getAge, getGradeText, dateFormat } = require('../utils');

exports.index = (req, res) => {
  let students = [];

  for (const student of data.students) {
    students.push({
      ...student,
      school_year: getGradeText(student.school_year),
    });
  }

  return res.render('students/index', { students });
};

exports.create = (req, res) => {
  return res.render('students/create');
};

exports.post = (req, res) => {
  const Keys = Object.keys(req.body);

  for (const key of Keys) {
    // req.body.key == ''
    if (req.body[key] == '') {
      return res.send('Por favor , preencha todos os campos');
    }
  }

  req.body.birth = Date.parse(req.body.birth);

  const lastStudent = data.students[data.students.length - 1];

  if (lastStudent) {
    req.body.id = lastStudent.id + 1;
  } else {
    req.body.id = 1;
  }

  data.students.push(req.body);

  fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error !');

    return res.redirect('/students');
  });
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundStudent = data.students.find((student) => id == student.id);

  if (!foundStudent) {
    return res.render('not-found');
  }

  const student = {
    ...foundStudent,
    age: getAge(foundStudent.birth),
    school_year: getGradeText(foundStudent.school_year),
  };

  return res.render('students/show', { student });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const foundStudent = data.students.find((student) => id == student.id);

  if (!foundStudent) {
    return res.render('not-found');
  }

  const student = {
    ...foundStudent,
    birth: dateFormat(foundStudent.birth).iso,
  };

  return res.render('students/edit.njk', { student });
};

exports.put = (req, res) => {
  const { id } = req.body;

  let index = 0;

  const foundStudent = data.students.find((student, foundIndex) => {
    if (id == student.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundStudent) {
    return res.render('not-found');
  }

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
  };

  data.students[index] = student;
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error !');

    return res.redirect(`/students/${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredStudents = data.students.filter((student) => id != student.id);

  data.students = filteredStudents;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error!');

    return res.redirect('/students');
  });
};
