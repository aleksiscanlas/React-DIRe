const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'direteam510@gmail.com',
      pass: 'direguipassword123'
  }
})

const date = new Date();
const currDate = date.getFullYear() + '-'
             + ('0' + (date.getMonth()+1)).slice(-2) + '-'
             +  ('0' + date.getDate()).slice(-2);
console.log(currDate)

let email = [];

cron.schedule('10 * * * * *', () => {
  const sendEmailNotification = async() => {
    const users = await db.collection('users').get().then(res => {
      res.docs.map(doc => email.push(doc.data().Email))
    }).then(() => {
      email.forEach(async(em) => {
        const files = await db.collectionGroup('files').where('Email', '==', em).where('FileExpiry', '==', currDate).get().then(res => {
            res.docs.map(doc => {
              console.log(doc.data().FileName)
              const mailOptions = {
                from: 'direteam510@gmail.com',
                to: em,
                subject: 'Your File is about to Expire!',
                html: `
                        <div>Greetings from DIRe Team!</div>
                        <p>You are receiving this notication for your expired file <a href=${doc.data().URL}">${doc.data().FileName}</a>, Expiring on ${doc.data().FileExpiry}.</p>
                        <p>All QR codes that includes this file would be disabled.</p>
                      `
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log(error)
                }else{
                    console.log("Email Sent! " + info.response)
                }
             })
            })         
        });
      })
    });
  }
  sendEmailNotification();
})