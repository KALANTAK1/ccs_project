const express = require("express");
const path = require("path");
const router = express.Router();
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// Pages
app.get("/", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.get("/menu", (_req, res) => res.sendFile(path.join(publicDir, "menu.html")));
app.get("/about", (_req, res) => res.sendFile(path.join(publicDir, "about.html")));
app.get("/reservations", (_req, res) => res.sendFile(path.join(publicDir, "reservations.html")));
app.get("/contact", (_req, res) => res.sendFile(path.join(publicDir, "contact.html")));

// Demo reservation endpoint. Connect a database and email provider for production.
app.post("/api/reservations", (req, res) => {
  const { name, email, date, time, guests } = req.body;
  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ message: "Please complete all reservation fields." });
  }

  const reservation = {
    id: `SS-${Date.now().toString().slice(-6)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    date,
    time,
    guests: Number(guests),
    receivedAt: new Date().toISOString()
  };

  console.log("New demo reservation:", reservation);
  return res.status(201).json({
    message: `Thanks, ${reservation.name}! Your reservation request has been received.`,
    reservationId: reservation.id
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please complete all contact fields." });
  }
  console.log("New demo contact message:", {
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    receivedAt: new Date().toISOString()
  });
  res.status(201).json({ message: "Thanks for reaching out! Your message has been received." });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

//app.use("/.netlify/functions/app", router);
//module.exports.handler = serverless(app);

app.listen(PORT, () => {
  console.log(`OM restaurants website running at http://localhost:${PORT}`);
});
