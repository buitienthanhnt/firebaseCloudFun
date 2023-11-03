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
const { faker } = require("@faker-js/faker");
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

interface product {
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

interface UserItem {
  id: Number,
  name: string,
  key: string,
}

exports.someMethod = functions.https.onCall((data: any, context: any) => {
  var listUser: UserItem[] = [];
  var db = admin.firestore();
  return db.collection("listUser").get().then((snapshot: any) => {
    snapshot.forEach((doc: any) => {
      var newelement = {
        key: doc.id,
        name: doc.data().name,
        id: doc.data().id,
      }
      listUser.push(newelement);
    });
    // console.log('_____+',stuff);
    return listUser;
  });
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
  .onDelete((snap: any, context: any) => {
    console.log("123");
  });

// push message: https://engineering.monstar-lab.com/en/post/2021/02/09/Use-Firebase-Cloudfunctions-To-Send-Push-Notifications/
// https://firebase.google.com/codelabs/firebase-cloud-functions?hl=vi#0
//http request method
exports.sendHttpPushNotification = functions.https.onRequest((req: any, res: any) => {
  // const userId = req.body.userId; //get params like this
  // const FCMToken = admin.database().ref(`/FCMTokens/${userId}`).once('value');
  const FCMToken = "fRaRyvcESDS3hN_fTLRPcT:APA91bF0XBXrAHQUMSp_QyDmBl3Xlh0OZUz7nw8FV0x5IKH2j88WCP5muRI_8C5E03VxdoFGRVto60YKn7J6o4BfK4LeidK4GMZZIRiSRQX1M8g1btbxrienvxi3l_u3Eg7WHOOCfS0R";
  const payload = {
    token: FCMToken,
    notification: {
      title: 'req',
      body: "message conten"
    },
    data: {
      id: "123",
      link: ""
    }
  };

  // admin.messaging().sendToDevice(FCMToken, payload).then((response: any) =>{
  //   console.log('====================================');
  //   console.log(response);
  //   console.log('====================================');
  // });

  admin.messaging().send(payload).then((response: any) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    return { success: true };
  }).catch((error: Error) => {
    return { error: error.message };
  });

  return { error: "pôppopopopopo" };
});

//listener method
exports.sendListenerPushNotification = functions.database.ref('/sendMessage/{userId}/').onWrite((data: any, context: any) => {
  const userId = context.params.userId; //get params like this
  const FCMToken = admin.database().ref(`/FCMTokens/${userId}`).once('value');

  const payload = {
    token: FCMToken,
    notification: {
      title: 'cloud function demo',
      body: "message conten"
    },
    data: {
      body: {},
    }
  };

  admin.messaging().send(payload).then((response: any) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    return { success: true };
  }).catch((error: Error) => {
    return { error: error.message };
  });
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



