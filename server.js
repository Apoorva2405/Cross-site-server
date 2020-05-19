const express = require("express");
const cp = require("cookie-parser");
const app = express();
const port = 4000;

app.use(cp());
app.use(express.static("public"));

app.enable("trust proxy");
// app.use(function(req, res, next) {
//   if (req.secure) {
//     return next();
//   }
// //   res.redirect("https://" + req.headers.host + req.url);
// });

app.get("/", function(request, response) {

  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("set-cookie", "testcookie=vl03; SameSite=InvalidValue");
  response.cookie("test0", "vl00");
  response.cookie("testnonesecure", "vl01", { sameSite: "none", secure: true });
  response.cookie("testnone", "vl02", { sameSite: "none" });
  response.cookie("testlax", "vl04", { sameSite: "lax" });
  response.cookie("teststrict", "vl05", { sameSite: "strict" });
  response.set(
    "Access-Control-Allow-Origin",
    "http://localhost:3100"
  );
  response.set("Access-Control-Allow-Credentials", "true");
  response.json(request.cookies);
});

app.all("/cookies.json", function(request, response) {
  response.set(
    "Access-Control-Allow-Origin",
    "http://localhost:3100"
  );
  response.set("Access-Control-Allow-Credentials", "true");
  response.json(request.cookies);
});

app.get("/iframe", function(request, response) {
  response.setHeader(
    "set-cookie",
    "samesite-invalid=test; SameSite=InvalidValue"
  );
  response.cookie("samesite-not-set", "test");
  response.cookie("samesite-none-secure", "test", {
    sameSite: "none",
    secure: true
  });
  response.cookie("samesite-none-only", "test", { sameSite: "none" });
  response.cookie("samesite-lax", "test", { sameSite: "lax" });
  response.cookie("samesite-strict", "test", { sameSite: "strict" });

  response.sendFile(__dirname + "/views/iframe.html");
});

app.get("/embed", function(request, response) {
    response.cookie("samesite-none-secure", "test", {
        sameSite: "none",
        secure: true
      });
    response.sendFile(__dirname + "/views/embed.html");
  });

app.get("/post", function(request, response) {
response.cookie("plain-cookie", "plain");
response.cookie("samesite-none", "none", { sameSite: "none", secure: true });
response.cookie("samesite-lax", "lax", { sameSite: "lax" });
response.cookie("samesite-strict", "strict", { sameSite: "strict" });
response.sendFile(__dirname + "/views/post.html");
});

app.post("/callback", function(request, response) {
    response.sendFile(__dirname + "/views/callback.html");
  });


app.listen(port, function() {
    console.log(`Listening to requests on http://localhost:${port}`);
});

