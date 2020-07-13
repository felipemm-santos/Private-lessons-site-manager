const fs = require('fs');
const data = require('./data.json');
const { getAge, getGraduation } = require('./utils');

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
    schooling: getGraduation(foundTeacher.schooling),
    subjects: foundTeacher.subjects.split(','),
    created_at: new Intl.DateTimeFormat('en-GB').format(
      foundTeacher.created_at
    ),
  };

  return res.render('teachers/show', { teacher });
};
