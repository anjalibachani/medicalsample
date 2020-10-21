const {createTransport} = require('nodemailer');
const SendGridTransport = require('nodemailer-sendgrid-transport');


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'merle22@ethereal.email',
        pass: 'xjeP97Syaq6vPMKwt7'
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