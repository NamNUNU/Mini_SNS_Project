var express = require("express")
var app = express();
var router = express.Router();
var mysql = require("mysql")
var passport = require("passport")
var localStrategy = require("passport-local").Strategy;

// DATABASE SETTING
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "1234",
  database : "sns"
})
connection.connect();

router.get('/', function(req, res){
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('join.ejs', {'message' : msg});
})

passport.serializeUser(function(user, done){
  console.log("passport session save :", user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("passport session get id :", id);
  done(null, id);
});


passport.use('local-join', new localStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    passReqToCallback: true
  }, function(req, email, password, done){
    var phone = req.body.phone;
    var intro = req.body.intro;
    var repw = req.body.repw;
    var picture = req.body.picture;


    if(email==="이메일을 입력하세요"){
      return done(null, false,{message: '이메일을 입력하셔야 합니다.'})
    }
    if(email.indexOf('@')===-1||email.indexOf('.')===-1){
      return done(null, false,{message: '이메일을 양식에 맞게 입력하셔야 합니다.'})
    }
    if(password==="ipsumipsumipsum"){
      return done(null, false,{message: '비밀번호를 입력하셔야 합니다.'})
    }
    if(password!==repw){
      return done(null, false,{message: '확인 비밀번호가 다릅니다'})
    }
    if(phone==="( - ) 없이 입력하세요"){
      phone = null;
    }
    if(intro==="자기소개를 입력하세요"){
      intro = null;
    }
    var query = connection.query('select * from user where email = ?', [email], function(err, rows){
      if(err) return done(err);
      if(rows.length){
        return done(null, false,{message: '사용중인 이메일 입니다.'})
      }else{

        var sql = {email:email, pw:password, phone:phone, intro:intro, picture:picture}
        var query = connection.query('insert into user set ?', sql, function(err,rows){

          if(err) {throw err};
          return done(null, {'email':email, 'id' :rows.insertId})
        })
      }
    })
  }
));

router.post('/', passport.authenticate('local-join', {
  successRedirect: '/login',
  failureRedirect: '/join',
  failureFlash: true,
}))

module.exports = router;
