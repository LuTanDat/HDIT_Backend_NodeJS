import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10); //giai thuat ma hoa mac dinh cua thu vien

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already

        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          //compare password
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = "ok";

            // console.log(user); // return object
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.message = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.message = `Your's Email isn't exist in your system. Please try other emal!`;
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = '';
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password'], // lay all tru password
          }
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password'], // lay all tru password
          }
        })
      }

      resolve(users);
    } catch (e) {
      reject(e);
    }
  })
}

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: 'Email is already in used, please try other email!'
        });
      }
      else {
        // console.log('User created');
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender === "1" ? true : false,
          roleId: data.roleId,
        });
      }

      resolve({
        errCode: 0,
        message: 'ok'
      });
    } catch (e) {
      reject(e);
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          message: "User's not exists"
        })
      }
      await db.User.destroy({// xoa duoi DB
        where: { id: userId }
      })

      resolve({
        errCode: 0,
        message: "The user is deleted"
      });
    } catch (e) {
      reject(e);
    }
  })
}

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('data nodejs', data);
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: 'Missing required parameters!'
        })
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName,
          user.lastName = data.lastName,
          user.address = data.address,

          await user.save();

        resolve({
          errCode: 0,
          message: 'Update the user succeed!'
        })
      } else {
        resolve({
          errCode: 1,
          errMessage: `User's not found!`
        });
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      } else {
        let res = {};
        let allcodes = await db.Allcode.findAll({
          where: { type: typeInput }
        });
        res.errCode = 0;
        res.data = allcodes;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService
};
