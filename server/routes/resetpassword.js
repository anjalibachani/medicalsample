const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { DefaultTransporter } = require("google-auth-library");
const transporter = require("./sendmail");
const db = require("../db/dbconnect");
// const config = require('../config/config.json')
const config =
  process.env.MED_DEPLOY_ENV === "deployment"
    ? require("../config/deploy_config.json")
    : require("../config/local_config.json");

const getsha1 = function (input) {
  return crypto.createHash("sha1").update(input).digest("hex");
};

function resetpassword(req, res) {
  //console.log(req)
  //console.log("reset pass func called")
  //console.log(req.match.params.id)
  //console.log(req.params.id)
  const token = req.params.id;
  const password = req.body.password;
  //console.log("resetpass: ",req.body);
  jwt.verify(token, config.JWT_RESET_KEY, (err, decoded) => {
    //console.log("error",err);
    //console.log("decoded ",decoded)
    if (err) {
      return res.status(401).json({ message: "UnAuthorized" });
    } else {
      const user_id = decoded.user_id;
      db.query(
        "SELECT * from users WHERE user_id = ? and isActive=1",
        [user_id],
        async function (error, results, fields) {
          if (error) {
            return res.status(500).json({ message: "server error" });
          }
          if (results[0].timeout < Date.now()) {
            return res
              .status(400)
              .json({ message: "Link expired try requesting a new link" });
          }
          if (results.length > 0) {
            db.query(
              'UPDATE users set password = ?,resetlink = "", timeout = "" WHERE user_id = ?',
              [getsha1(password), user_id],
              async function (error, results, fields) {
                if (error) {
                  return res
                    .status(500)
                    .json({ message: "Password reset failed" });
                }
                return res
                  .status(200)
                  .json({ message: "Password reset successful" });
              }
            );
          }
        }
      );
    }
  });
}

//     crypto.randomBytes(32,(err, buffer)=>{
//         if(err){
//             console.log(err)
//         }
//         const token = buffer.toString("hex");
//         console.log(buffer);
//         const email = emailid;
//         DefaultTransporter.sendMail({

//         })
//         res.json({message:"check your mail"})
//     })
// }

module.exports = resetpassword;
