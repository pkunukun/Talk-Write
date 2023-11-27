const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
app.use(express.json());
const connectionString =
  "mongodb+srv://thepruthviii:Nivi2017@cluster0.zqy1d0z.mongodb.net/?retryWrites=true&w=majority";
const storeSchema = new mongoose.Schema({
  text: String,
});

//Nitesh
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

let db = null;
connectToDb();
const Store = mongoose.model("Prudvi", storeSchema, "Prudvi");
const User = mongoose.model("User", userSchema, "Login");

app.use(
  session({
    secret: "your_secret_here",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
app.use(passport.initialize());

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async function (username, password, done) {
      try {
        const user = await User.findOne({ username: username })
          .maxTimeMS(30000)
          .catch((error) => {
            console.log(error);
          });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("passport.authenticate: err, user, info", err, user, info);
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ message: "Login successful." });
    });
  })(req, res, next);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

async function connectToDb() {
  if (db) {
    return Promise.resolve(db);
  }

  try {
    db = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    });
    console.log("Connected to database");

    return db;
  } catch (err) {
    console.log("Error connecting to database", err.message);
    throw err;
  }
}

async function createObject(text) {
  try {
    const db = await connectToDb();
    const newObject = new Store({
      text: text,
    });
    await newObject.save();
    console.log("Object added to collection");
    return newObject;
  } catch (err) {
    console.log("Error adding object to collection", err.message);
    throw err;
  }
}

async function deleteObject(id) {
  console.log("delete Object " + id);

  try {
    const db = await connectToDb();
    const result = await Store.deleteOne({ _id: new ObjectId(id) });
    console.log("Object deleted from collection:", result.deletedCount);
  } catch (error) {
    console.log("Error deleting object from collection", error.message);
  }
}

io.on("connection", async (socket) => {
  console.log("a user connected");
  await fetchAllObjects(socket);
  socket.on("message", async (message) => {
    console.log("received message:", message);

    const savedObject = await createObject(message);

    io.emit("message", { text: message, id: savedObject._id.toString() });
  });

  socket.on("delete", async ({ id, text }) => {
    console.log("received delete message:", text);

    await deleteObject(id);

    io.emit("delete", { text: text, id: id });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

async function fetchAllObjects(socket) {
  try {
    const db = await connectToDb();
    const docs = await Store.find({});
    socket.emit("allMessages", docs);
  } catch (err) {
    console.log("Error fetching objects from collection", err.message);
  }
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});
