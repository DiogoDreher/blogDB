//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hi, my name id Diogo and this is my personal blog, where I intend to share with you some aspects of my life and my professional achievements. Feel free to come by anytime you want and I'll be more than glad respond to anyone who tries to get in touch with me through the Contact Me area. Hope to hear from you :)";
const aboutContent = "I'm a Brazilian/Portuguese currently living in Porto-Portugal. I'm a Multimedia Engineering at Istec-Porto and an enthusiast about web developing. I have just finished a Web Development Bootcamp at Udemy and I'm looking for oportunities to put all my studies to a test. This blog is one of my projects and here I intend to write about my achievements be it in personal or professional life.";
const contactContent = "If you're interested on having a web site of your own you can get in touch with me through my e-mail: diogo-ramalho92@hotmail.com. Feel free to send a message so we can talk.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://diogo-oliveira:mmiqdpotsi@personalblog-dxxkl.mongodb.net/blogDB", {
  useNewUrlParser: true
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});
