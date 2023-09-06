import express from "express";

/**
 *
 * @param {*} app | express app
 */

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); // thu muc public image, html, css ra ngoai
  app.set("view engine", "ejs"); // Cong nghe su dung
  app.set("views", "./src/views"); // thu muc su dung cong nghe gi de hien thi ra giao dien
};

module.exports = configViewEngine;
