smbclient //192.168.0.117/camstorage -c 'cd ./ ; put filepenting.txt'

smbclient -c put "filepenting.txt" "//192.168.0.117/camstorage/"


smbclient //192.168.0.117/camstorage --directory path/to/folder --command "put file.txt"


smbclient //192.168.0.117/camstorage --directory /home/cideng87/ServerCamera/videos --command "put filepenting.txt"


smbclient '//192.168.0.117/camstorage/HomeTazik/20220203' --command 'lcd /home/cideng87/ServerCamera/videos/record/CameraLt.4/20220207/video/; put 010035.mp4'


smbclient '//192.168.0.117/camstorage' --command 'cd /HomeTazik; lcd /home/cideng87/ServerCamera/videos/record/CameraLt.4/20220207/video/; put 010035.mp4'


smbclient '//192.168.0.117/camstorage' --command 'cd /HomeTazik/20220203;  lcd /home/cideng87/ServerCamera/videos/record/CameraLt.4/20220207/video/; put 010035.mp4'

smbclient '//192.168.0.117/camstorage' --command 'cd /HomeTazik/20220203;  lcd /videos/record/CameraLt.4/20220207/video/; put 010035.mp4'


smbclient '//192.168.0.117/camstorage' --command 'lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'

smbclient -U guest -N -c put "filepenting.text" "\HomeTazik\20220203" //192.168.0.117/camstorage

smbclient -U camera -c 'lcd /home/cideng87/ServerCamera/videos/; put filepenting.text' //192.168.0.117/camstorage Cideng87c
smbclient -U camera -c 'lcd /home/cideng87/ServerCamera/videos/;' put "filepenting.text" //192.168.0.117/camstorage Cideng87c

smbclient -U camera -c put "filepenting.text" "" //192.168.0.117/camstorage Cideng87c

smbclient -U camera -c put "filepenting.text" "HomeTazik" //192.168.0.117/camstorage Cideng87c


async sendFile(path, destination) {
    const workingDir = p.dirname(path);
    return await this.execute(
      smbclient '//192.168.0.117/camstorage' --command 'lcd /videos/; put filepenting.text'
    );
  }

  async sendFile(path, destination) {
    const workingDir = p.dirname(path);
    return await this.execute(
      "put",
      [p.basename(path), destination],
      workingDir
    );
  }


  var cmd_ffmpeg2 = "ffmpeg";
 var args_parameter2 = [
  "-smbclient",
   "//192.168.0.117/camstorage",
   "--command",
   "-put",
   "filepenting.text",
 ];

 var processHLS2 = spawn(cmd_ffmpeg2, args_parameter2);

 processHLS2.stdout.on("data", function (data) {
   console.log("cek data output", data);
 });

 processHLS2.stderr.setEncoding("utf8");
 processHLS2.stderr.on("data", function (data) {
   console.log(data);
 });

 processHLS2.on("close", function () {
   console.log("finished");
 });



#   const SambaClient = require("samba-client");
#  const testFile = "tes.txt";
#  var clientSMB = new SambaClient({
#    address: "//192.168.0.117/camstorage",
#    username: "camera",
#    password: "Cideng87c",
#  });
#  clientSMB.sendFile("lcd /videos/filepenting.text","");
# console.log(`send file to ${clientSMB.address}`);

rtsp://admin:admin@192.168.0.149:554/11

rtsp://SIMCAM:DX8PHX@192.168.0.200/live


#   const { stdout, stderr } = await exec(
#        "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command 'cd /HomeTazik/20220203; lcd /home/cideng87/ServerCamera/videos/; put filepenting.text'"
#      );


smbclient '//192.168.0.117/camstorage' --command 'cd /IPCameraLT4/20220217;  lcd /home/cideng87/ServerCamera/videos/; get 102429.mp4'

smbclient '//192.168.0.117/camstorage' --command 'cd /IPCameraLT4/20220216;  lcd /home/cideng87/ServerCamera/videos/; mget *'

smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command 'prompt OFF; recurse ON; cd /IPCameraLT4/20220216;  lcd /home/cideng87/ServerCamera/videos/playback/; mget *'

smbclient '\\server\share' -N -c 'prompt OFF;recurse ON;cd 'path\to\directory\';lcd '~/path/to/download/to/';mget *'`


# const util = require("util");
# const exec = util.promisify(require("child_process").exec);

# var dirPath =
#   "/home/cideng87/ServerCamera/videos/record/IPCameraLT4/20220208/video/" + ";";
# var sendPath = "/IPCameraLT4/20220208" + ";";
# var sendFile = "023518.mp4";

# async function runSendFile() {
#   try {
#    const { stdout, stderr } = await exec(
#       "smbclient -U camera '//192.168.0.117/camstorage' Cideng87c --command" +
#         " 'cd " +
#         sendPath +
#         " lcd " +
#         dirPath +
#         " put " +
#         sendFile +
#         "'"
#     );
#     console.log("stdout:", stdout);
#     console.log("stderr:", stderr);
#   } catch (e) {
#     console.error(e);
#   }
# }
# runSendFile();