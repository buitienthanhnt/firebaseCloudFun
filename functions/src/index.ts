/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const {faker} = require("@faker-js/faker");
const admin = require("firebase-admin");
// const serviceAccount = require("./service_account.json");


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseUrl: "https://jmanager-new-default-rtdb.firebaseio.com/",
// //   databaseURL: `https://${serviceAccount.project_id}.firebase.com`,
// });
admin.initializeApp();


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

interface product{
    name: string,
    price: Number
}
// Initialize products array
var products: product[] = [];


// Max number of products
const LIMIT = 10;


for (let i = 0; i < LIMIT; i++) {
  products.push({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
  });
}


exports.listProducts = functions.https.onCall((data: any, context: any) => {
  return products;
});

exports.someMethod = functions.https.onRequest((req, res) => {
  var stuff: any[] = [];
  var db = admin.firestore();
  db.collection("Users").doc("7vFjDJ63DmhcQiEHwl0M7hfL3Kt1").collection("blabla").get().then(snapshot => {

      snapshot.forEach(doc => {
          var newelement = {
              "id": doc.id,
              "xxxx": doc.data().xxx,
              "yyy": doc.data().yyy
          }
          stuff = stuff.concat(newelement);
      });
      res.send(stuff)
      return "";
  }).catch(reason => {
      res.send(reason)
  })
});


exports.addMessage = functions.https.onCall((data: any, context: any) => {
  return admin.database().ref("/users")
    .push({
        id: Math.floor(Math.random() * 100),
        name: "user " + Math.floor(Math.random() * 100),
        email: `user${Math.floor(Math.random() * 100)}@gmail.com`,
    })
    .then(() => {
        console.log("Add new user");
        // Returning the sanitized message to the client.
        return { text: "ppp" };
    });
});


exports.simpleDbFunction = functions.database
  .ref("/users/{id}")
  .onCreate((snap: any, context: any) => {
    console.log("=====>", context);
    //   if (context.authType === 'ADMIN') {
    //     // do something
    //   } else if (context.authType === 'USER') {
    //     console.log(snap.val(), 'written by', context.auth.uid);
    //   }
  });


exports.onWrite = functions.database
  .ref("/users/{id}")
  .onWrite((snap: any, context: any) => {
    console.log("=====", context);
    //   if (context.authType === 'ADMIN') {
    //     // do something
    //   } else if (context.authType === 'USER') {
    //     console.log(snap.val(), 'written by', context.auth.uid);
    //   }
  });


exports.writeDB = functions.database
  .ref("/users")
  .onUpdate((snapshot: any, context: any) => {
    console.log(snapshot, "=====%", context);
  });


exports.deleteListen = functions.database
  .ref("users")
  .onDelete((snap : any, context: any) => {
    console.log("123");
  });





// firebase.config 
// {
//   "functions": [
//     {
//       "source": "functions",
//       "codebase": "default",
//       "ignore": [
//         "node_modules",
//         ".git",
//         "firebase-debug.log",
//         "firebase-debug.*.log"
//       ],
//       "predeploy": [
//         "npm --prefix \"$RESOURCE_DIR\" run lint"
//       ]
//     }
//   ],
//   "emulators": {
//     "functions": {
//       "port": 5001
//     },
//     "ui": {
//       "enabled": true
//     },
//     "singleProjectMode": true,
//     "database": {
//       "port": 4001
//     }
//   },
//   "database": {
//     "rules": "database.rules.json"
//   }
// }



