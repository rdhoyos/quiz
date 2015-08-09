var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
if (typeof process.env.DATABASE_URL === 'undefined') {
	var url = "sqlite://:@:/".match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
} else {
	var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
}
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate(
          [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema:'otro'},
            {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema:'otro'},
						{pregunta: 'El smartphone más vendido del mundo', respuesta: 'iPhone', tema:'tecnologia'},
						{pregunta: 'Cual es el último sistema operativo de Microsoft', respuesta: 'Windows 10', tema:'tecnologia'},
						{pregunta: 'Cuantas gramos hacen una onza', respuesta: '448', tema:'ciencia'},
						{pregunta: 'Que animal es el rey de la selva', respuesta: 'León', tema:'ciencia'},
						{pregunta: 'Ganador del Tour de Francia 2015', respuesta: 'Chris Froome', tema:'ocio'},
						{pregunta: 'Subcampeón del Tour de Francia 2015', respuesta: 'Nairo Quintana', tema:'ocio'},
						{pregunta: 'Quien fue el primer presidente de los Estados Unidos de América', respuesta: 'George Washington', tema:'humanidades'}
          ]
        ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
