// Require the express web application framework (https://expressjs.com)
var express = require('express')

// Create a new web application by calling the express function
var app = express()
// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// database
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'twenty-nine-web'
})

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express)

connection.connect(function(err) {
	if (err) throw err;
    console.log('Database is connected successfully !');
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public_html'))
app.use(express.urlencoded({ extended: true }));

app.post("/recruit", function(req, res, next){
  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let resume = req.body.resume;
  let cover = req.body.cover;

  var sql = `
	insert into recruit
	(name, email, phone, resume, coverletter)
	values ("${name}", "${email}", "${phone}", "${resume}", "${cover}")
	`;

  connection.query(sql, function(error) {
		if (error) throw error;
		else {
      res.redirect("successful.html");
    }
	});
});

app.post("/signin", function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  connection.query(
    'SELECT * FROM user WHERE email = ? AND password = ?',
    [email, password],
    function(err, row, fields) {
      if (err) {
        res.redirect('fail.html');
      }
      else if (row.length > 0) {
        let fullname = row[0].name;
        res.render(__dirname + '/public_html/successful.ejs', { fullname });
      }
      else {
        res.redirect('fail.html');
      }
    }
  );
});

// connection.end();

// Tell our application to listen to requests at port 3000 on the localhost
app.listen(port, function () {
  // When the application starts, print to the console that our app is
  // running at http://localhost:3000  (where the port number is 3000 by
  // default). Print another message indicating how to shut the server down.
  console.log(`Web server running at: http://localhost:${port}`)
  console.log("Type Ctrl+C to shut down the web server")
})