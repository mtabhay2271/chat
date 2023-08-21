var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendfile("./index.html");
});
const users = [];

io.on("connection", (socket) => {
  //New user joinning
  socket.on("setUsername", (name) => {
    //Username field is Empty or cancel
    if (name == "" || name == null) {
      socket.emit("nullUser", "Please! Enter Valid name to join");
      return;
    }
    //User Exists Already
    if (users.indexOf(name) > -1) {
      socket.emit(
        "userExists",
        name + " username is taken! Try some other username."
      );
      return;
    }
    //New user added
    users.push(name);
    console.log(name, "joined succesfully");
    socket.emit("userSet", { username: name });
    socket.broadcast.emit("ConnMSG", `${name} is connected!`);
  });

  //Send message to everyone
  socket.on("msg", function (data) {
    socket.broadcast.emit("newmsg", data);
  });

  //A user Disconnect
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

const PORT = 5000 ;
http.listen(PORT, function () {
  console.log("listening on localhost:", PORT);
});


