const crypto = require("crypto");
//import { DefaultTransporter } from 'google-auth-library';
const { DefaultTransporter } = require("google-auth-library");
const transporter = require("./sendmail");
const db = require("../db/dbconnect");
const jwt = require("jsonwebtoken");
// const config = require('../config/config.json')
const config =
  process.env.MED_DEPLOY_ENV === "deployment"
    ? require("../config/deploy_config.json")
    : require("../config/local_config.json");

function forgotpassword(req, res) {
  const email_id = req.body.email_id;
  db.query(
    "SELECT * from users WHERE email_id = ? and isActive=1",
    [email_id],
    async function (error, results, fields) {
      if (error) {
        return res.status(400).json({ message: "error occued" });
      } else {
        if (results.length > 0) {
          if (req.body.email_id === results[0].email_id) {
            const user_id = results[0].user_id;
            results[0].password = undefined;
            const token = jwt.sign(
              { user_id: results[0].user_id },
              config.JWT_RESET_KEY,
              { expiresIn: "1h" }
            );
            //return res.status(200).json({token:token, user_id:results[0].user_id,  message:"login successful"})
            db.query(
              "UPDATE users set resetlink = ?, timeout = ? WHERE user_id = ?",
              [token, Date.now() + 1200000, user_id],
              async function (error, results, fields) {
                if (!error) {
                  htmltext = `http://${config.client.host}:${config.client.port}/reset-pass/${token}`;
                  transporter.sendMail({
                    from: "medicalsample@buffalo.edu", // sender address
                    to: `${email_id}`, // list of receivers
                    subject: "Password Reset Request", // Subject line
                    text: `We have received a password reset request. Follow the link below to reset your password.\nIf the link doesnt work copy the link in browser`, // plain text body
                    html: `<p>We have received a password reset request. Follow the link below to reset your password.\n</p><h3>Follow this link</h3><a href=${htmltext}>password reset link</a><p>If the link doesnt work copy the link in browser</p><br/><p>${htmltext}</p>`, // html body
                  });
                  if (error) {
                    return res.status(500).json({
                      message: "server error couldn't reset the password.",
                    });
                  }
                  return res
                    .status(200)
                    .json({ message: "check your mail for the reset link." });
                }
              }
            );
          }
        }
      }
    }
  );
}

module.exports = forgotpassword;
