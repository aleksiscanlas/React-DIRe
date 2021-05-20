const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const serviceAccount = require('./serviceAccountKey.json');
const api = require('./api.js');
 
var smsMessage = new api.SmsMessage();
var smsApi = new api.SMSApi("aleksis.canlas206@gmail.com", "5D440AC9-B380-5EE1-69E1-BD480439E665");

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

let email = [];

//scheduled checker
cron.schedule('10 * * * * *', () => {
  console.log(currDate)
  const sendEmailNotification = async() => {
    //retrieves all the email and contact no. of users
    await db.collection('users').get().then(res => {
      res.docs.map(doc => email.push([doc.data().Email, doc.data().Contact]))
    }).then(() => {
      email.forEach(async(em) => {
        //queries all files that expires today across the whole database
        await db.collectionGroup('files').where('Email', '==', em[0]).where('FileExpiry', '==', currDate).get().then(res => {
            res.docs.map(async doc => {
              //checks if an email is already sent to the user
              if(doc.data().Disabled === false){
                await db.collection('users').doc(doc.data().uid).collection('files').doc(doc.data().FileName).set({Disabled: true}, {merge: true}).catch(err => console.log(err, 'error in disabling file query'))
                //Email Notification
                const mailOptions = {
                  from: 'direteam510@gmail.com',
                  to: em,
                  subject: 'Your File is about to Expire!',
                  html: `
                          <div>Greetings from DIRe Team!</div>
                          <p>You are receiving this notication for your expired file <a href=${doc.data().URL}">${doc.data().FileName}</a>, Expiring this ${doc.data().FileExpiry}.</p>
                          <p>All QR codes that includes this file would be disabled.</p>
                          <p>Visit our website: https://maindb-8acfe.web.app/ </p>
                        `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if(error){
                      console.log(error)
                  }else{
                      console.log(`Email to ${em} on file ${doc.data().FileName} Sent! ` + info.response)
                  }
                })
                
                //SMS notification 
                smsMessage.from = "DIRe Team";
                smsMessage.to = `${em[1]}`;
                smsMessage.body = `Greetings from DIRe Team, Your file ${doc.data().FileName} is expiring \n 
                                    All QR Codes that has this file would be disabled\n
                                    Visit our site: https://maindb-8acfe.web.app/`;
                
                var smsCollection = new api.SmsMessageCollection();
                
                smsCollection.messages = [smsMessage];
                
                smsApi.smsSendPost(smsCollection).then(function(response) {
                    console.log(response.body);
                }).catch(function(err){
                    console.error(err.body);
                });

              }else{
                console.log(`Email: ${em} ---- File:${doc.data().FileName} ---- Remarks: File Disabled Already`)
              }
            })         
        }).catch(err => console.log(err));
      })
    }).catch(err => console.log(err));
    email = []
  }
  sendEmailNotification();
})