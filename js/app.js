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
    localStorage.comkyledornblasergpacalc = JSON.stringify(json)
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
    console.log(gpa)
    this.calculatedGPA.innerHTML = gpa;
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
        controller.update('pastGPA', this.value);
      }
    });

    this.pastHours.addEventListener('keyup', function() {
      if (this.value) {
        controller.update('pastHours', this.value);
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
      gradeInput.value = controller.currentClasses()[i].grade;
      gradeInput.uniqueID = controller.currentClasses()[i].id;

      var hoursInput = document.createElement('input');
      hoursInput.className = 'grade form-control';
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
          controller.updateGrade(gradeInputCopy.uniqueID, gradeInputCopy.value);
        }
      })(gradeInput));

      hoursInput.addEventListener('keyup', (function(hoursInputCopy) {
        return function() {
          controller.updateHours(hoursInputCopy.uniqueID, hoursInputCopy.value);
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
  update: function(key, value) {
    var updatedData = model.data();
    updatedData[key] = value;
    model.save(updatedData);
    viewOutput.render();
  },
  updateGrade: function(id, value) {
    var updatedData = model.data();
    for (var i = 0; i < updatedData.currentClasses.length; i++) {
      if (updatedData.currentClasses[i].id === id) {
        updatedData.currentClasses[i].grade = value;
      }
    }
    model.save(updatedData);
    viewOutput.render();
  },
  updateHours: function(id, value) {
    var updatedData = model.data();
    for (var i = 0; i < updatedData.currentClasses.length; i++) {
      if (updatedData.currentClasses[i].id === id) {
        updatedData.currentClasses[i].hours = value;
      }
    }
    model.save(updatedData);
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
    console.log('Points: ' + totalPoints);
    console.log('Hours:' + totalHours);
    var gpa = totalPoints / totalHours;
    return gpa;
  }
};

controller.init();
