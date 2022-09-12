// var exec = require("child_process").exec;

// var exec = require("execa").execa;

// var CommandArguments = [
//   "smbclient",
//   "'//192.168.0.117/camstorage'",
//   "-c",
//   "'lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'",
// ];

// //kick off install process
// var child = exec(CommandArguments.join(" "), function (error, stdout, stderr) {
//   console.log("error: ", error);
//   console.log("stdout: ", stdout);
//   console.log("stderr: ", stderr);
// });

// const util = require("util");
// const exec = util.promisify(require("child_process").exec);
// const execa = require("execa").execa;

// var options = [
//   "'//192.168.0.117/camstorage'",
//   "-c",
//   "'lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'",
// ];

// async function runSmbSendFile() {
//   try {
//     const { stdout, stderr } = await exec("smbclient", options);
//     console.log("stdout:", stdout);
//     console.log("stderr:", stderr);
//   } catch (e) {
//     console.error(e); // should contain code (exit code) and signal (that caused the termination).
//   }
// }
// runSmbSendFile();

// var exec = require("child_process").exec;
// var spawn = require("child_process").spawn;

// var CommandArguments = [
//   "'//192.168.0.117/camstorage'",
//   "--command",
//   "'lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'",
// ];
//  var smbSend = spawn("smbclient", CommandArguments);

// console.log(smbSend);

//  smbSend.stdout.on("data", function (data) {
//   console.log("cek data output", data);
//  });

//  smbSend.stderr.setEncoding("utf8");
//  smbSend.stderr.on("data", function (data) {
//    console.log(data);
//  });

//  smbSend.on("close", function () {
//    console.log("finished");
//  });

//console.log(CommandArguments.join(" "))
//var child = spawn(CommandArguments.join(" "), function (error, stdout, stderr) {
//  console.log("error: ", error);
//  console.log("stdout: ", stdout);
//  console.log("stderr: ", stderr);
//});

// const util = require("util");
// const exec = util.promisify(require("child_process").exec);

// var dirPath =
//   "/home/cideng87/ServerCamera/videos/record/CameraLt.4/20220208/video/" + ";";
// var sendPath = "/HomeTazik/20220203" + ";";
// var sendFile = "080036.mp4";

// async function runSendFile() {
//   try {
//     // const { stdout, stderr } = await exec(
//     //   "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command 'cd /HomeTazik/20220203; lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'"
//     // );

//     const { stdout, stderr } = await exec(
//       "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command" +
//         " 'cd " +
//         sendPath +
//         " lcd " +
//         dirPath +
//         " put " +
//         sendFile +
//         "'"
//     );
//     console.log("stdout:", stdout);
//     console.log("stderr:", stderr);
//   } catch (e) {
//     console.error(e);
//   }
// }
// runSendFile();

//const SambaClient = require("samba-client");
//const testFile = "tes.txt";
//var clientSMB = new SambaClient({
//  address: "//192.168.0.117/camstorage",username:"camera",password:"Cideng87c"
//});

//clientSMB.sendFile('./videos/HomeTazik/20220203/text.txt', '/HomeTazik/20220203');
//console.log(`send file to  ${clientSMB.address}`);

//clientSMB.mkdir('SimhomeTazik/20220206')
//console.log(`created directory ${clientSMB.address}`);

const userEmailArray = ["one", "two"];
const promises = userEmailArray.map(
  (userEmail, i) =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log(userEmail);
        resolve();
      }, 2000 * i)
    )
);
Promise.all(promises).then(() => console.log("done"));

// const fs = require("fs");

// var arr = [];

// const basePath = "./videos/record/IPCameraLT4/20220209/video/";

// fs.promises
//   .readdir(basePath)
//   .then((files) => {
//     console.log(files);
//     files.forEach((file) => {
//       console.log(file);
//       // fs.stat(basePath + "/" + file, (err, stats) => {
//       //   if (!stats.isDirectory()) {
//       //     arr.push(file);
//       //     return;
//       //   }
//       // });
//     });
//   })
//   .then(() => {
//     console.log(arr);
//   });
// const util = require("util");
// const exec = util.promisify(require("child_process").exec);

// async function runCmdGetFileSmbClientFromNAS() {
//   var pathLocal = "/home/cideng87/ServerCamera/videos/playback/" + ";";
//   var PathNAS = "/IPCameraLT4/20220216;";

//   console.log("GET ALL FILE FROM NAS" + PathNAS);
//   let stdout;
//   let stderr;
//   try {
//     stdout,
//       (stderr = await exec(
//         "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command" +
//           " 'prompt OFF; recurse ON; cd " +
//           PathNAS +
//           " lcd " +
//           pathLocal +
//           " mput *'"
//       ));
//     console.log("stdout:", stdout);
//     console.log("stderr:", stderr);
//   } catch (e) {
//     console.error(e);
//   }
// }

// runCmdGetFileSmbClientFromNAS();
