import db from "../models/index";
import CRUDService from "../services/CRUDService";

// trong luc lay du lieu tu DB ton nhieu thoi gian => phai cho, su dung try catch de bat loi

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll(); // get all data in table user
    return res.render("homepage.ejs", {
      // mac dinh chay den thu muc views, duoc cau hinh trong file viewEngine.js
      data: JSON.stringify(data), // truyen bien data ra views
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  // console.log(req.body); // lay all data client post
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);

  return res.send("create new user succeed");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUsers();

  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id; // lay id tren thanh dia chi cua trinh duyet
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);

    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("User not found");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUserData(data);

  // return res.render("displayCRUD.ejs", {
  //   dataTable: allUsers,
  // });
  return res.redirect("/get-crud");
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    await CRUDService.deleteUserById(userId);
    return res.redirect("/get-crud");
  } else {
    res.send("User is not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
