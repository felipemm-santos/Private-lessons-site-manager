const fs = require('fs');
const data = require('./data.json');

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
