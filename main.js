const express = require('express');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');
const indexRoutes = require('./router/router_main.js');
const app = express();

app.use(sessions({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRoutes);
app.use('/notes', indexRoutes);
app.use('/loadnotes', indexRoutes);
app.use('/back', indexRoutes);
app.use('/next', indexRoutes);
app.use('/getstats', indexRoutes);

app.listen(3000,function(){ 
    console.log("Server listening on port: 3000")});