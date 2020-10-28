const {createTransport} = require('nodemailer');
const SendGridTransport = require('nodemailer-sendgrid-transport');


const transporter = createTransport({
    host: 'hobbes.cse.buffalo.edu',
    port: 587,
    auth: {
        user: '',
        pass: ''
    }
});

// transporter.sendMail({
//     to:"to_mail",
//     from:"from_mail",
//     subject:"",
//     html:""
// }).then(()=>{
//     console.log("mail sending failed")
// })

module.exports = transporter;