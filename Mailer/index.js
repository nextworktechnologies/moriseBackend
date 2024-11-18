import nodemailer from 'nodemailer';
import {
    passSent,
    tryAgain
} from '../Responses/index.js';

// let admin = process.env.E_MAIL;
// let pass = process.env.PASS;


export const options = (email, sub, content) => {
    return {
        from: "no-reply@knoone.com",
        to: email,
        subject: sub,
        html: content,
    };
};


// // Use the test account credentials
// export const transponder = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "knooneindialimited@gmail.com",
//         pass: "0000rajat",
//     },
//     tls: {
//         rejectUnauthorized: false
//     },
//     debug: true // Enable debug mode
// });


export const transponder = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail' // Path to the sendmail command
});



export const sendMail = async (options) => {

    transponder.sendMail(options, (err, info) => {
        if (err) {
            return tryAgain;
        }
        return { ...passSent, data: info };
    });
};