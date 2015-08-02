var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  var filtro = '%';
	if (typeof req.query.search !== 'undefined') {
		filtro = '%'+req.query.search.toLowerCase().replace(/ +/g,'%')+'%';
	};
	models.Quiz.findAll({
			where:[ "lower(pregunta) like ? ", filtro ], order:'pregunta ASC'
		}).then( function(quizes) {
                       	res.render('quizes/index.ejs', {quizes: quizes});
       		}).catch(function(error){next(error)}
	);
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/autor
exports.autor = function(req, res) {
    res.render('quizes/autor', {name: 'Ronal David Hoyos G'});
};
