import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import {
  renderAppInfoPage,
  renderPrivacyPage,
  renderSupportPage,
} from "./public-pages.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.redirect("/privacy");
});
app.get("/privacy", (_req, res) => {
  res.send(renderPrivacyPage());
});
app.get("/support", (_req, res) => {
  res.send(renderSupportPage());
});
app.get("/app-info", (_req, res) => {
  res.send(renderAppInfoPage());
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker Public Pages" });
});

app.listen(port, () => {
  console.log(`Skinin public pages listening on port ${port}`);
});
