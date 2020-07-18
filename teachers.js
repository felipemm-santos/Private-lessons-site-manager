const fs = require('fs');
const Intl = require('intl');

const data = require('./data.json');

const {
  getAge,
  getGraduationText,
  getClassTypeText,
  dateFormat,
} = require('./utils');

exports.index = (req, res) => {
  const teachers = data.teachers;

  for (const teacher of teachers) {
    teacher.subjects = String(teacher.subjects).split(',');
  }  

  return res.render('teachers/index', { teachers });
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
  req.body.created_at = Date.now();
  req.body.id = Number(data.teachers.length + 1);

  const {
    id,
    avatar_url,
    name,
    birth,
    schooling,
    class_type,
    subjects,
    created_at,
  } = req.body;

  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    schooling,
    class_type,
    subjects,
    created_at,
  });

  fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error !');

    return res.redirect('/teachers');
  });
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundTeacher = data.teachers.find((teacher) => id == teacher.id);

  if (!foundTeacher) {
    return res.render('not-found');
  }

  const teacher = {
    ...foundTeacher,
    age: getAge(foundTeacher.birth),

    schooling: getGraduationText(foundTeacher.schooling),

    class_type: getClassTypeText(foundTeacher.class_type),

    subjects: String(foundTeacher.subjects).split(','),

    created_at: new Intl.DateTimeFormat('pt-BR').format(
      foundTeacher.created_at
    ),
  };

  return res.render('teachers/show', { teacher });
};

exports.edit = (req, res) => {
  const { id } = req.params;

  const foundTeacher = data.teachers.find((teacher) => id == teacher.id);

  if (!foundTeacher) {
    return res.render('not-found');
  }

  const teacher = {
    ...foundTeacher,
    birth: dateFormat(foundTeacher.birth),
  };

  return res.render('teachers/edit.njk', { teacher });
};

exports.put = (req, res) => {
  const { id } = req.body;

  let index = 0;

  const foundTeacher = data.teachers.find((teacher, foundIndex) => {
    if (id == teacher.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundTeacher) {
    return res.render('not-found');
  }

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body),
  };

  data.teachers[index] = teacher;
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error !');

    return res.redirect(`/teachers/${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredTeachers = data.teachers.filter((teacher) => id != teacher.id);

  data.teachers = filteredTeachers;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send('Write file error!');

    return res.redirect('/teachers');
  });
};
