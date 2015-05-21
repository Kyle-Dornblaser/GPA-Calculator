var model = {
  init: function() {
    if (!localStorage.comkyledornblasergpacalc) {
      localStorage.comkyledornblasergpacalc = JSON.stringify({
        pastGPA: 0,
        pastHours: 0,
        currentClasses: [{
          grade: 0,
          hours: 0
        }, {
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
  }
};

var view = {
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
      view.addClass();
    });

    this.render();

  },
  render: function() {
    this.pastGPA.value = controller.pastGPA();
    this.pastHours.value = controller.pastHours();
    this.currentSemester.innerHTML = '';
    for (var i = 0; i < controller.currentClasses().length; i++) {
      var aClass = document.createElement('div');
      var grade = [
        '<div class="col-md-6">',
        '<input type="text" class="grade form-control" value="',
        controller.currentClasses()[0].grade,
        '">',
        '</div>',
      ].join('');

      var hours = [
        '<div class="col-md-6">',
        '<input type="text" class="hour form-control" value="',
        controller.currentClasses()[0].hours,
        '">',
        '</div>',
      ].join('');
      aClass.innerHTML = '<div class="row">' + grade + hours + '</div>';
      this.currentSemester.appendChild(aClass);
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
    view.init();
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
  },
  addClass: function() {
    var updatedData = model.data();
    var newClass = {hours: 0, grade: 0};
    updatedData.currentClasses.push(newClass);
    model.save(updatedData);
  }
};

controller.init();
