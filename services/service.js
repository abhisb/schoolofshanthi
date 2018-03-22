'use strict';
const nodemailer = require('nodemailer');
var jsonfile = require('jsonfile');
var fs = require("fs");
//var randtoken = require('rand-token');
var crypto = require('crypto');
var q = require('promise');

/* Client-Secret Downloaded from Google Development */
var clientSecret = { "installed": { "client_id": "982763164156-pitvrjea6s1noggdpin2oc3mj59m58td.apps.googleusercontent.com", "project_id": "school-of-santhi-165807", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://accounts.google.com/o/oauth2/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_secret": "xohRYlibbdgV-tHIN6O66PRn", "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"] } };





// Message 
var Service = function() {};

Service.prototype.getAllPhotoNames = function() {
    return new Promise(
        function(resolve, reject) {
            fs.readdir("./public/Content/img/gallery",
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.SendMail = function(data) {

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contactschoolofsanthi@gmail.com',
    pass: 'Trivandrum123'
  }
});

var mailOptions = {
    from: '"School of Santhi" <contactschoolofsanthi@gmail.com>', // sender address
    to: data.applicant.email, // list of receivers
    subject: 'Confirmation of registration for ' + data.event.name + ' at School of Santhi', // Subject line
    html: 'Hi ' + data.applicant.name + ',<br>Your request for registration for the event <b>' + data.event.name + '</b> is being processed. We will get in touch with you shortly.<br><br></br>Regards,<br> School of Santhi' // html body
};

var mailOptionsForSos = {
    from: '"School of Santhi" <contactschoolofsanthi@gmail.com>', // sender address
    to: 'contactschoolofsanthi@gmail.com', // list of receivers
    subject: 'Registration for ' + data.event.name, // Subject line
    html: 'Hi,<br>' + data.applicant.name + ' has requested to register for the event ' + data.event.name + '.<br>The details from the registration are,<br><br><b>Name :</b>    ' + data.applicant.name + '<br><b>Age :</b>    ' + data.applicant.age + '<br><b>Country :</b>    ' + data.applicant.country + '<br><b>Phone Number :</b>    ' + data.applicant.number + '<br><b>Best time to reach:</b>    ' + data.applicant.bestTime + '<br><b>Email :</b>    ' + data.applicant.email + '<br><b>Program :</b>    ' + data.event.type + '<br><b>Comments :</b> ' + data.applicant.reason + '<br><br><br>Regards,<br> School of Santhi' // html body
}

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    error.message = "error";
    return error;
  } else {
    console.log('Email sent: ' + info.response);
    info.response.data = "Your application sucessfully submitted! Please check mail for details";
    return info.response;
  }
});

transporter.sendMail(mailOptionsForSos, function(error, info){
  if (error) {
    console.log(error);
    return error;
    error.message = "error";
  } else {
    console.log('Email sent: ' + info.response);
    info.response.data = "Your application sucessfully submitted! Please check mail for details"
    return info.response;
  }
});
console.log(transporter)
transporter.close()

};

Service.prototype.EditEvent = function(event) {
    var file = './bin/events/' + event.id + '.json';
    if (event.image != "") {
        if (new RegExp(/^data:image\/png;base64,/).test(event.image)) {
            var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
            event.imageSrc = '../bin/events/' + event.id + ".png";
            var filePath = './public/bin/events/' + event.id + ".png";
            fs.unlink('./public/bin/events/' + event.id + '.png', function(err) {
                console.log(err);
            });
        } else {
            var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
            event.imageSrc = '../bin/events/' + event.id + ".jpg";
            var filePath = './public/bin/events/' + event.id + ".jpg";
            fs.unlink('./public/bin/events/' + event.id + '.jpg', function(err) {
                console.log(err);
            });
        }
        event.image = "";
        require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
            console.log(err);
        });
    }
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })

};

Service.prototype.SaveEvent = function(event) {
    var token = randtoken.generate(5);
    var file = './bin/events/' + token + '.json';
    event.id = token;
    if (new RegExp(/^data:image\/png;base64,/).test(event.image)) {
        var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
        event.imageSrc = '../bin/events/' + token + ".png";
        var filePath = './public/bin/events/' + token + ".png";
    } else {
        var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
        event.imageSrc = '../bin/events/' + token + ".jpg";
        var filePath = './public/bin/events/' + token + ".jpg";
    }
    event.image = "";
    require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        console.log(err);
    });
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })

};

Service.prototype.saveNews = function(event) {
    //var token = randtoken.generate(5);
    var token = crypto.randomBytes(8).toString('hex');
    var file = './bin/news/' + token + '.json';
    event.id = token;
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })
};
Service.prototype.getNews = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/news/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else { 
                        resolve(data);
                    }
                });
        });
};
Service.prototype.updateNews = function(event) {
    var file = './bin/news/' + event.id + '.json';
    if (event.image != "") {
        if (new RegExp(/^data:image\/png;base64,/).test(event.image)) {
            var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
            event.image = '../bin/news/' + event.id + ".png";
            var filePath = './public/bin/news/' + event.id + ".png";
            fs.unlink('./public/bin/news/' + event.id + '.png', function(err) {
                console.log(err);
            });
        } else {
            var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
            event.image = '../bin/news/' + event.id + ".jpg";
            var filePath = './public/bin/news/' + event.id + ".jpg";
            fs.unlink('./public/bin/news/' + event.id + '.jpg', function(err) {
                console.log(err);
            });
        }
        //event.image = "";
        require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
            console.log(err);
        });
    }
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })

};

Service.prototype.deleteNews = function(req) {
    fs.unlink('./bin/news/' + req.id + '.json', function(err) {
        console.log(err);
    });
};

Service.prototype.saveBlog = function(event) {
    var token = crypto.randomBytes(8).toString('hex');
    var file = './bin/blogs/' + token + '.json';
    event.id = token;
    if (new RegExp(/^data:image\/png;base64,/).test(event.image)) {
        var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
        event.image = '../bin/blogs/' + token + ".png";
        var filePath = './public/bin/blogs/' + token + ".png";
    } else {
        var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
        event.image = '../bin/blogs/' + token + ".jpg";
        var filePath = './public/bin/blogs/' + token + ".jpg";
    }
    require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        console.log(err);
    });
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })

};

Service.prototype.saveSanthiBlog = function(event) {
    var token = crypto.randomBytes(8).toString('hex');
    var file = './bin/santhiblogs/' + token + '.json';
    event.id = token;
    if (new RegExp(/^data:image\/png;base64,/).test(event.image)) {        
        var base64Data = event.image.replace(/^data:image\/png;base64,/, "");
        event.image = '../bin/santhiblogs/' + token + ".png";
        var filePath = './public/bin/santhiblogs/' + token + ".png";
    } else {
        var base64Data = event.image.replace(/^data:image\/jpeg;base64,/, "");
        event.image = '../bin/santhiblogs/' + token + ".jpg";
        var filePath = './public/bin/santhiblogs/' + token + ".jpg";
    }
    require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        console.log(err);
    });
    jsonfile.writeFile(file, event, function(err) {
        console.error(err)
    })

};

Service.prototype.readAllBlogs = function() {
    var blogs = [];
    return new Promise(
        function(resolve, reject) {
            try {
                var data = fs.readdirSync('./bin/blogs');

                var length = data.length;
                data.forEach(function(fileName, i) {
                    var event = readFilePromisified('./bin/blogs/' + fileName).then((blog, error) => {
                        if (error) {
                            reject(error);
                        } else {
                            blogs.push(blog);
                            if (i == length - 1)
                                resolve(blogs);
                        }
                    })
                })
            }
            catch (err) {
                resolve(blogs);
            }

        });

};

Service.prototype.getAllSanthBlogs = function() {
    var blogs = [];
    return new Promise(
        function(resolve, reject) {
            try{
                var data = fs.readdirSync('./bin/santhiblogs');

                var length = data.length;
                data.forEach(function(fileName, i) {
                    var event = readFilePromisified('./bin/santhiblogs/' + fileName).then((blog, error) => {
                        if (error) {
                            reject(error);
                        } else {
                            blogs.push(blog);
                            if (i == length - 1)
                                resolve(blogs);
                        }
                    })
                })

            }
            catch (err) {
                resolve(blogs);
            }
        });

};

Service.prototype.deleteBlogs = function(req) {
    fs.unlink('./bin/blogs/' + req.id + '.json', function(err) {
        console.log(err);
    });
    fs.unlink('./public/bin/blogs/' + req.id + '.json', function(err) {
        console.log(err);
    });
};

Service.prototype.deleteSanthiBlogs = function(req) {
    fs.unlink('./bin/santhiblogs/' + req.id + '.json', function(err) {
        console.log(err);
    });
    fs.unlink('./public/bin/santhiblogs/' + req.id + '.json', function(err) {
        console.log(err);
    });
};

function readFilePromisified(filename) {
    return new Promise(
        function(resolve, reject) {
            jsonfile.readFile(filename,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}

Service.prototype.getEvent = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/events/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.getYoga = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/blogs/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.getSanthi = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/santhiblogs/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};

Service.prototype.checkLogin = function(req) {
    return new Promise(
        function(resolve, reject) {
            var userid = req.body.email;
            var pswd = req.body.pswd;

            var staticUserId = 'santhischool@yahoo.co.in';
            var staticPswd = 'admin@santhi123';

            if (userid === staticUserId && pswd === staticPswd) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
};

Service.prototype.deleteEvent = function(id) {
    fs.unlink('./bin/events/' + id.id + '.json', function(err) {
        console.log(err);
    });
};

Service.prototype.getYogaBlog = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/yoga/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};
Service.prototype.getBlog = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/blogs/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};
Service.prototype.getSanthiBlog = function(id) {
    return new Promise(
        function(resolve, reject) {
            var fileName = id + '.json';
            jsonfile.readFile('./bin/santhiblogs/' + fileName,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
};
Service.prototype.ReadAllEvents = function() {
    var events = [];
    return new Promise(
        function(resolve, reject) {
            var data = fs.readdirSync('./bin/events');

            var length = data.length;
            data.forEach(function(fileName, i) {
                var event = readFilePromisified('./bin/events/' + fileName).then((event, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        events.push(event);
                        if (i == length - 1)
                            resolve(events);
                    }
                })
            })

        });


};

Service.prototype.ReadAllNews = function() {
    var events = [];
    return new Promise(
        function(resolve, reject) {
            try {
                var data = fs.readdirSync('./bin/news');

                var length = data.length;
                data.forEach(function(fileName, i) {
                    var event = readFilePromisified('./bin/news/' + fileName).then((event, error) => {
                        if (error) {
                            reject(error);
                        } else {
                            events.push(event);
                            if (i == length - 1)
                                resolve(events);
                        }
                    })
                })
            }
            catch (err) {
                resolve(events);
            }

        });
};


Service.prototype.ReadAllYogaBlogs = function() {
    var blogs = [];
    return new Promise(
        function(resolve, reject) {
            var data = fs.readdirSync('./bin/yoga');

            var length = data.length;
            data.forEach(function(fileName, i) {
                var event = readFilePromisified('./bin/yoga/' + fileName).then((blog, error) => {
                    if (error) {
                        reject(error);
                    } else {
                        blogs.push(blog);
                        if (i == length - 1)
                            resolve(blogs);
                    }
                })
            })

        });


};

Service.prototype.saveYogaBlog = function(blog) {
    var token = randtoken.generate(5);
    var file = './bin/yoga/' + token + '.json';
    blog.id = token;
    if (new RegExp(/^data:image\/png;base64,/).test(blog.thumbnail)) {
        var base64Data = blog.thumbnail.replace(/^data:image\/png;base64,/, "");
        blog.thumbnailSrc = '../bin/yoga/' + token + ".png";
        var filePath = './public/bin/yoga/' + token + ".png";
    } else {
        var base64Data = blog.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
        blog.thumbnailSrc = '../bin/yoga/' + token + ".jpg";
        var filePath = './public/bin/yoga/' + token + ".jpg";
    }
    blog.thumbnail = "";
    require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        console.log(err);
    });
    jsonfile.writeFile(file, blog, function(err) {
        console.error(err)
    })
};
/*Service.prototype.saveBlog = function(blog) {
    var token = randtoken.generate(5);
    var file = './bin/blog/' + token + '.json';
    blog.id = token;
    if (new RegExp(/^data:image\/png;base64,/).test(blog.thumbnail)) {
        var base64Data = blog.thumbnail.replace(/^data:image\/png;base64,/, "");
        blog.thumbnailSrc = '../bin/blog/' + token + ".png";
        var filePath = './public/bin/blog/' + token + ".png";
    } else {
        var base64Data = blog.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
        blog.thumbnailSrc = '../bin/blog/' + token + ".jpg";
        var filePath = './public/bin/blog/' + token + ".jpg";
    }
    blog.thumbnail = "";
    require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        console.log(err);
    });
    jsonfile.writeFile(file, blog, function(err) {
        console.error(err)
    })
};
*/


module.exports = new Service();