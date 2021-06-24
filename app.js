var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const nodemailer = require('nodemailer')
const { render } = require('ejs');
const mongoose = require('mongoose');
const Webinar = require('./models/webinar');
const Appointment = require('./models/appointments');
const multer = require('multer');
const Slot = require('./models/slot');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/imagesUploaded/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
    cb( null,true);
  } else {
    cb( null, false);
  }
}
const upload = multer({storage: storage, fileFilter: fileFilter});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors()); //inter enviornment 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static( 'public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to mongoDb
const dbURI = 'mongodb+srv://admin_forum:adminforum@cluster0.w7lbe.mongodb.net/discussion?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));

//router
app.get('/', (req,res) => {
  res.redirect('/webinars');
});

app.get('/clientWeb', (req,res) => {
  Webinar.find().sort({createdAt: -1 })
  .then((result) => {
    res.send({webinars: result})
  })
})

app.get('/webinars', (req,res) => {
  Webinar.find().sort({createdAt: -1 })
    .then((result) => {
        res.render('webinars', {title: "All Webinars", webinars: result })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/slots', (req,res) => {
  Slot.find().sort({createdAt: -1 })
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
});


app.get('/createWeb', function(req, res, next) {
  res.render('createWeb', { title: 'Create Webinars' });
});

app.post('/createWeb', upload.single('image'), (req, res, next) => {
  console.log(req.file);
  const webinar= new Webinar({
    title: req.body.title,
    dateTime: req.body.dateTime,
    link: req.body.link,
    imagePath: req.file.path,
    description: req.body.description,
  });

  webinar.save()
    .then((result) => {
        res.redirect("/webinars");
    })
    .catch((err) => {
        console.log(err);
    });
});

//edit webinar get req
app.get('/editWeb/:id', (req,res) => {
  Webinar.findById(req.params.id)
  .then((result) => {
      res.render('editWeb', {webinar: result, title: "Editing Webinar"});
  })
})
//edit webinar post request 
app.post('/editWeb/:id', (req,res) => {
  Webinar.findByIdAndUpdate(req.params.id, { $set: {
    title : req.body.title,
    dateTime: req.body.dateTime,
    link: req.body.link,
    description: req.body.description 
  }})
  .then((result) => {
    res.redirect('/webinars');
  })
})

app.get('/editImg/:id', (req,res) => {
  Webinar.findById(req.params.id)
  .then((result) => {
      res.render('editImg', {webinar: result, title: "Editing Webinar"});
  })
})
//edit webinar post request 
app.post('/editImg/:id', upload.single('image'), (req,res) => {
  console.log(req.file);
  Webinar.findByIdAndUpdate(req.params.id, { $set: { imagePath: req.file.path, }})
  .then((result) => {
    res.redirect('/webinars');
  })
})

app.delete('/webinar', (req, res) => {
    const id = req.body._id;
    console.log(id);
    Webinar.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/webinars' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/contact', (req,res) =>{
  console.log(req.body)
  const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samyak.21810494@viit.ac.in',
        pass: "aegleproject200"
    }
  })
  const mailOptions = {
      from: 'samyak.21810494@viit.ac.in',
      to: req.body.email,
      subject: `Message from ${req.body.name}: ${req.body.subject}`,
      text: `Mail from ${req.body.email}. ${req.body.message}`
  }
  tranporter.sendMail(mailOptions, (error, info) => {
      if(error){
          console.log(error);
          res.send('error')
      }else{
          console.log('Email Sent: ' + info.response)
          res.send('success')
      }
  })

})

app.get('/schedule', (req,res) => {

  Appointment.find().sort({createdAt: -1 })
    .then((result) => {
        res.render('appointments', {title: "All Webinars", appointments: result })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/schedule', (req, res, next) => {
  console.log(req.body);

  
  // const tranporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //       user: 'samyak.21810494@viit.ac.in',
  //       pass: ""
  //   }
  // })
  // const mailOptions = {
  //     from: 'samyak.21810494@viit.ac.in',
  //     to: req.body.email,
  //     subject: `Aegle Clinic: Appointment Condirmation`,
  //     text: `Dear Client,  Your appointment is at ${req.body.time}, ${req.body.day}. For any issues contact: abc(13245678921). Thankyou and Regards.`
  // }
  // tranporter.sendMail(mailOptions, (error, info) => {
  //     if(error){
  //         console.log(error);
  //         res.send('error')
  //     }else{
  //         console.log('Email Sent: ' + info.response)
  //         res.send('success')
  //     }
  // })

  const appointment= new Appointment({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    day: req.body.day,
    time:req.body.time
  });
  appointment.save()
    .then((result) => {
        res.redirect("/schedule");
    })
    .catch((err) => {
        console.log(err);
    });

  Slot.find()
    .then((result) => {
      var b = result[0][req.body.day];
      var tSlot = req.body.time;
      b[tSlot] = false;
      
      Slot.findByIdAndUpdate(result[0]._id,{ $set: { 'today': b }})
      .then((result)=>{
        console.log(result);
      })
      .catch((err) => {
          console.log(err);
      });  
    });
})

// app.post('/updateSlot/:id/:id1', (req, res,)  => {
//   console.log(req.params.id,req.params.id1);

//   Slot.find()
//     .then((result) => {
//       var a = req.params.id;
//       var b = result[0][a];
      
//       var tSlot = req.params.id;
//       console.log(b,b[tSlot])
//       b[tSlot] = true;
      
//       Slot.findByIdAndUpdate(result[0]._id,{ $set: {
//         'today': b
//       }})
//       .then((result)=>{
//         console.log(result);
//       })
//       .catch((err) => {
//           console.log(err);
//       });  
//     });
// })

// app.use('/api/', require('./views/controllers/hello'))   

//zoom 
// const rp = require('request-promise');
// const jwt = require('jsonwebtoken');
// const payload = {
// 	iss: "dkTOd-IzS2emVPW89C7qUg",
// 	exp: new Date().getTime() + 5000,
// };
// const token = jwt.sign(payload, "FaJdZc5L6ILEZgKx6mylKCui2KDHo6vtMAaa");

// app.post("/newmeeting", (req, res) => {
//   email = "ruchika.21810325@viit.ac.in";
//   var options = {
//     method: "POST",
//     uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
//     body: {
//       topic: "test create meeting",
//       type: 1,
//       settings: {
//         host_video: "true",
//         participant_video: "true"
//       }
//     },
//     auth: {
//       bearer: token
//     },
//     headers: {
//       "User-Agent": "Zoom-api-Jwt-Request",
//       "content-type": "application/json"
//     },
//     json: true //Parse the JSON string in the response
//   };

//   rp(options)
//     .then(function(response) {
//       console.log("response is: ", response);
//       res.send("create meeting result: " + JSON.stringify(response));
//     })
//     .catch(function(err) {
//       // API call failed...
//       console.log("API call failed, reason ", err);
//     });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;