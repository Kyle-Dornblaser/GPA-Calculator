var model = {
  init: function() {
    if (!localStorage.comkyledornblasergpacalc) {
      localStorage.comkyledornblasergpacalc = JSON.stringify({
        pastGPA: 0,
        pastHours: 0,
        currentClasses: [{
          id: 0,
          grade: 0,
          hours: 0
        }, {
          id: 1,
          grade: 0,
          hours: 0
        }]
      });
    }

  },
  data: function() {
    return JSON.parse(localStorage.comkyledornblasergpacalc)
  },
  save: function(json) {
    localStorage.comkyledornblasergpacalc = JSON.stringify(json);
    console.log('saving');
  },
  savePast: function(element, key) {
    var value = element.value;
    if (key === 'pastGPA') {
      if (this.isValidGPA(value)) {
        var updatedData = this.data();
        updatedData[key] = value;
        controller.removeError(element);
        this.save(updatedData);
      } else {
        controller.addError(element);
      }
    } else if (key === 'pastHours') {
      if (this.isValidPastHours(value)) {
        var updatedData = this.data();
        updatedData[key] = value;
        controller.removeError(element);
        this.save(updatedData);
      } else {
        controller.addError(element);
      }
    } else {
      alert('Unknown key: ' + key);
      console.log('Unknown key: ' + key);
    }
  },
  saveCurrent: function(element, key) {
    var id = element.uniqueID;
    var value = element.value
    var updatedData = this.data();
    for (var i = 0; i < updatedData.currentClasses.length; i++) {
      if (updatedData.currentClasses[i].id === id) {
        if (key === 'grade') {
          if (this.isValidGPA(value)) {
            updatedData.currentClasses[i][key] = value;
            controller.removeError(element);
            this.save(updatedData);
          } else {
            controller.addError(element);
          }
        } else if (key === 'hours') {
          if (this.isValidHours(value)) {
            updatedData.currentClasses[i][key] = value;
            controller.removeError(element);
            this.save(updatedData);
          } else {
            controller.addError(element);
          }
        } else {
          alert('Unknown key: ' + key);
          console.log('Unknown key: ' + key);
        }
      }
    }
  },
  isValidGPA: function(grade) {
    var minLength = 1;
    var maxLengh = 4;
    var minValue = 0.0;
    var maxValue = 4.0;
    if (isNaN(grade)) {
      valid = false;
    } else if (grade.length < minLength || grade.length > maxLengh) {
      valid = false;
    } else if (grade < minValue || grade > maxValue) {
      valid = false;
    } else {
      valid = true;
    }
    return valid;
  },
  isValidPastHours: function(hours) {
    var minLength = 1;
    var maxLengh = 3;
    var minValue = 0;
    var maxValue = 200;
    if (isNaN(hours)) {
      valid = false;
    } else if (hours.length < minLength || hours.length > maxLengh) {
      valid = false;
    } else if (hours < minValue || hours > maxValue) {
      valid = false;
    } else {
      valid = true;
    }
    return valid;
  },
  isValidGrade: function(grade) {
    var minLength = 1;
    var maxLengh = 1;
    var minValue = 0;
    var maxValue = 4;
    if (isNaN(grade)) {
      valid = false;
    } else if (grade.length < minLength || grade.length > maxLengh) {
      valid = false;
    } else if (grade < minValue || grade > maxValue) {
      valid = false;
    } else {
      valid = true;
    }
    return valid;
  },
  isValidHours: function(hours) {
    var minLength = 1;
    var maxLengh = 1;
    var minValue = 0;
    var maxValue = 4;
    if (isNaN(hours)) {
      valid = false;
    } else if (hours.length < minLength || hours.length > maxLengh) {
      valid = false;
    } else if (hours < minValue || hours > maxValue) {
      valid = false;
    } else {
      valid = true;
    }
    return valid;
  },
  nextID: function() {
    var highestID = 0;
    var currentClasses = this.data().currentClasses;
    for (var i = 0; i < currentClasses.length; i++) {
      if (currentClasses[i].id > highestID) {
        highestID = currentClasses[i].id;
      }
    }
    return highestID + 1;
  }
};

var viewOutput = {
  init: function() {
    this.calculatedGPA = document.getElementById('calculated-gpa');
    this.render();
  },
  render: function() {
    var gpa = controller.calculatedGPA();
    this.calculatedGPA.innerHTML = gpa;
    this.background(gpa);
  },
  background: function(gpa) {
    var colors = ['#FFAB00', '#FFAB00', '#FFD600', '#AEEA00', '#64DD17'];
    var backgroundColor = this.shadeBlend(gpa % 1, colors[Math.floor(gpa)], colors[Math.ceil(gpa)]);

    this.calculatedGPA.style.backgroundColor = backgroundColor;
  },
  // Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  shadeBlend: function(p, c0, c1) {
    var n = p < 0 ? p * -1 : p,
      u = Math.round,
      w = parseInt;
    if (c0.length > 7) {
      var f = c0.split(","),
        t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),
        R = w(f[0].slice(4)),
        G = w(f[1]),
        B = w(f[2]);
      return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
    } else {
      var f = w(c0.slice(1), 16),
        t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16),
        R1 = f >> 16,
        G1 = f >> 8 & 0x00FF,
        B1 = f & 0x0000FF;
      return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
    }
  }
}

var viewInput = {
  init: function() {
    this.pastGPA = document.getElementById('past-gpa');
    this.pastHours = document.getElementById('past-hours');
    this.addClassButton = document.getElementById('add-class');
    this.currentSemester = document.getElementById('current-semester');

    this.pastGPA.addEventListener('keyup', function() {
      if (this.value) {
        controller.update(this, 'pastGPA');
      }
    });

    this.pastHours.addEventListener('keyup', function() {
      if (this.value) {
        controller.update(this, 'pastHours');
      }
    });

    this.addClassButton.addEventListener('click', function() {
      viewInput.addClass();
    });

    this.render();

  },
  render: function() {
    this.pastGPA.value = controller.pastGPA();
    this.pastHours.value = controller.pastHours();
    this.currentSemester.innerHTML = '';
    for (var i = 0; i < controller.currentClasses().length; i++) {
      var row = document.createElement('div');
      row.className = 'row';
      row.uniqueID = controller.currentClasses()[i].id;

      var column1 = document.createElement('div');
      column1.className = 'col-md-5';

      var column2 = document.createElement('div');
      column2.className = 'col-md-5';

      var column3 = document.createElement('div');
      column3.className = 'col-md-2';

      var gradeInput = document.createElement('input');
      gradeInput.className = 'grade form-control';
      gradeInput.type = 'number';
      gradeInput.min = '1.0';
      gradeInput.max = '4.0';
      gradeInput.step = '1.0';
      gradeInput.value = controller.currentClasses()[i].grade;
      gradeInput.uniqueID = controller.currentClasses()[i].id;

      var hoursInput = document.createElement('input');
      hoursInput.className = 'grade form-control';
      hoursInput.type = 'number';
      hoursInput.min = '1.0';
      hoursInput.max = '4.0';
      hoursInput.step = '1.0';
      hoursInput.value = controller.currentClasses()[i].hours;
      hoursInput.uniqueID = controller.currentClasses()[i].id;

      var removeButton = document.createElement('button');
      removeButton.className = 'btn btn-danger';
      removeButton.innerHTML = 'Remove';
      removeButton.uniqueID = controller.currentClasses()[i].id;

      row.appendChild(column1);
      row.appendChild(column2);
      row.appendChild(column3);
      column1.appendChild(gradeInput);
      column2.appendChild(hoursInput);
      column3.appendChild(removeButton);


      gradeInput.addEventListener('keyup', (function(gradeInputCopy) {
        return function() {
          controller.updateGrade(gradeInputCopy);
        }
      })(gradeInput));

      hoursInput.addEventListener('keyup', (function(hoursInputCopy) {
        return function() {
          controller.updateHours(hoursInputCopy);
        }
      })(hoursInput));

      removeButton.addEventListener('click', (function(rowCopy) {
        return function() {
          controller.removeClass(rowCopy.uniqueID);
          viewInput.currentSemester.removeChild(rowCopy);
        }
      })(row));

      this.currentSemester.appendChild(row);
    }
  },
  addClass: function() {
    controller.addClass();
    this.render();
  }
};

var controller = {
  init: function() {
    model.init();
    viewInput.init();
    viewOutput.init();
  },
  pastGPA: function() {
    return model.data().pastGPA;
  },
  pastHours: function() {
    return model.data().pastHours;
  },
  currentClasses: function() {
    return model.data().currentClasses;
  },
  update: function(element, key) {
    model.savePast(element, key);
    viewOutput.render();
  },
  updateGrade: function(element) {
    model.saveCurrent(element, 'grade');
    viewOutput.render();
  },
  updateHours: function(element) {
    model.saveCurrent(element, 'hours');
    viewOutput.render();
  },
  addClass: function() {
    var updatedData = model.data();
    var newClass = {
      id: model.nextID(),
      hours: 0,
      grade: 0
    };
    updatedData.currentClasses.push(newClass);
    model.save(updatedData);
  },
  removeClass: function(id) {
    var updatedData = model.data();
    for (var i = 0; i < updatedData.currentClasses.length; i++) {
      if (updatedData.currentClasses[i].id === id) {
        updatedData.currentClasses.splice(i, 1);
        i--;
      }
    }
    model.save(updatedData);
    viewOutput.render();
  },
  addError: function(element) {
    element.className += ' has-error';
  },
  removeError: function(element) {
    element.className = element.className.replace(/has-error/gi, '');
  },
  calculatedGPA: function() {
    //GPA = total points / total hours
    //Total points = ∑(grade per class (on 4.0 scale) * hours per class) + previous GPA * previous hours
    //Total hours = ∑(hours per class this semester) + previous hours
    var data = model.data();
    var previousGPA = data.pastGPA;
    var previousHours = data.pastHours;
    var totalPoints = previousGPA * previousHours;
    var totalHours = parseInt(previousHours);

    var classes = data.currentClasses;
    for (var i = 0; i < classes.length; i++) {
      totalPoints += classes[i].grade * classes[i].hours;
      totalHours += parseInt(classes[i].hours);
    }
    // fix divide by 0
    if (totalHours === 0) {
      totalHours = 1;
    }
    var gpa = totalPoints / totalHours;
    return gpa.toFixed(2);
  }
};

controller.init();
