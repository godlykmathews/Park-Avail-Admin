const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const db = require('./config/connection');
const session = require('express-session');
const usersRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const Handlebars = require('handlebars'); // Handlebars helpers


// Registering a custom helper to format dates
Handlebars.registerHelper('formatDate', function(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
});

const app = express();

// Function to normalize port
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // Named pipe
        return val;
    }
    if (port >= 0) {
        // Port number
        return port;
    }
    return false;
}

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views', 'layout'), partialsDir: path.join(__dirname, 'views', 'partials') }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
    secret: "secrKey",
    resave: false, // Set to false to avoid resaving session if unmodified
    saveUninitialized: true, // Set to true to save uninitialized sessions
    cookie: { maxAge: 600000 } // Cookie expiration time
}));

// Middleware to pass session messages to views
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Routes
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Connect to the database and start the server
db.connect((err) => {
    if (err) {
        console.error('Unable to connect to database:', err);
        process.exit(1);
    } else {
        console.log('Connected to database');
        const port = normalizePort(process.env.PORT || '3000');
        app.set('port', port);
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
});

module.exports = app;