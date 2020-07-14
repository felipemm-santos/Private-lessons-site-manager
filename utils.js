module.exports = {
  getAge: (timestamp) => {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();

    const isNotBirthDay =
      month < 0 || (month == 0 && today.getDate() < birthDate.getDate());

    if (isNotBirthDay) {
      age -= 1;
    }

    return age;
  },

  getGraduationText: (schooling) => {
    switch (schooling) {
      case 'high_school':
        return 'Ensino Médio Completo';
      case 'college':
        return 'Ensino Superior Completo';
      case 'master':
        return 'Mestrado';
      case 'doctorate':
        return 'Doutorado';
    }
  },

  getClassTypeText: (classType) => {
    if (classType == 'distanced') {
      return 'Á distância';
    } else {
      return 'Presencial';
    }
  },

  dateFormat: (timestamp) => {},
};
