const express = require("express");
const cp = require("cookie-parser");
const app = express();

app.use(cp());
app.use(express.static("public"));

app.enable("trust proxy");
app.use(function(req, res, next) {
  if (req.secure) {
    return next();
  }
//   res.redirect("https://" + req.headers.host + req.url);
});

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
    "https://git.corp.adobe.com"
  );
  response.set("Access-Control-Allow-Credentials", "true");
  response.json(request.cookies);
});

app.all("/cookies.json", function(request, response) {
  response.set(
    "Access-Control-Allow-Origin",
    "https://git.corp.adobe.com"
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

app.get("/samesiteLax", function(request, response) {
    response.cookie("samesite-lax", "testlax", { sameSite: "lax" });
    response.sendFile(__dirname + "/views/view.html");
});

app.get("/samesiteNone", function(request, response) {
    response.cookie("samesite-none-only", "test", { sameSite: "none" });
    response.sendFile(__dirname + "/views/view.html");
});

app.get("/samesitestrict", function(request, response) {
    response.cookie("samesite-strict", "teststrict", { sameSite: "strict" });
    response.sendFile(__dirname + "/views/view.html");
});

app.post('/post', function(request, response) {
  response.set(
  "Access-Control-Allow-Origin",
  "https://git.corp.adobe.com"
);
response.set("Access-Control-Allow-Credentials", "true");
response.setHeader(
  "set-cookie",
  "samesite-invalid=test; SameSite=InvalidValue"
);
response.cookie("samesite-not-set", "test");
console.log(request.cookies);
response.sendFile(__dirname + '/views/iframe.html');
});

app.get("/home", function(request, response) {
  response.setHeader(
    "set-cookie",
    "samesite-invalid=test; SameSite=InvalidValue"
  );
  response.cookie("samesite-home", "test");
  response.cookie("samesite-none-secure-home", "test", {
    sameSite: "none",
    secure: true
  });
  response.cookie("samesite-none-only-home", "test", { sameSite: "none" });
  response.cookie("samesite-lax", "test", { sameSite: "lax" });
  response.cookie("samesite-strict", "test", { sameSite: "strict" });
  response.sendFile(__dirname + "/views/test.html");
});


const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});