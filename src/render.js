// const { desktopCapturer, remote } = require('electron');
// const {dialog, Menu} = remote;
// const {writeFile} = require('fs');

// //global state
// let mediaRecorder; //mediarecorder instance to capture footage
// const recordedChunks = [];

// //Buttons
// const videoElement = document.querySelector('video');
// const startBtn = document.getElementById("startBtn");
// const stopBtn = document.getElementById("stopBtn");
// const videoSelectBtn = document.getElementById("videoSelectBtn");

// startBtn.onclick = (e) => {
//     console.log(mediaRecorder)
//     mediaRecorder.start();
//     startBtn.classList.add('is-danger');
//     startBtn.innerText = 'Recording';
// }
// stopBtn.onclick = (e) => {
//     mediaRecorder.stop();
//     startBtn.classList.remove('is-danger');
//     startBtn.innerText = 'Start';
// }


// videoSelectBtn.onclick = getVideoSources;

  


// //get the avaiable video sources
// async function getVideoSources() {
//     const inputSources = await desktopCapturer.getSources({
//         types: ['window', 'screen']
//     });

//     const videoOptionsMenu = Menu.buildFromTemplate(
//         inputSources.map(source => {
//             return {
//                 label: source.name,
//                 click: () => selectSource(source)
//             }
//         })
//     );

//     videoOptionsMenu.popup();
// }

// //change the videoSource window to record
// async function selectSource(source){
//     videoSelectBtn.innerText = source.name;

//     // const constraints = {
//     //     audio: true,
//     //     video: {
//     //         mandatory: {
//     //             chromeMediaSource: 'desktop',
//     //             chromeMediaSourceId: source.id
//     //         }
//     //     }
//     // };

//     const constraints = {
//         audio: {
//             mandatory: {
//                 chromeMediaSource: 'desktop'
//             }
//         },
//         video: {
//             mandatory: {
//                 chromeMediaSource: 'desktop'
//             }
//         }
//     }

//     //create Stream
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);

//     //preview the source in video element
//     videoElement.srcObject = stream;
//     videoElement.play();

//     //create the media recorder
//     const options = {mimeType: 'video/webm; codecs=vp9'};
//     mediaRecorder = new MediaRecorder(stream, options);

//     //register event handlers
//     mediaRecorder.ondataavailable = handleDataAvailable;
//     mediaRecorder.onstop = handleStop;
// }

// //captures recorded chunks
// function handleDataAvailable(e) {
//     console.log('video data available');
//     recordedChunks.push(e.data);
// }

// //saves the vdieo file on stop
// async function handleStop(e){
//     const blob = new Blob(recordedChunks, {
//         type: 'video/webm; codecs=vp9'
//     });

//     const buffer = Buffer.from(await blob.arrayBuffer());

//     const {filePath} = await dialog.showSaveDialog({
//         buttonlabel: 'Save Video',
//         defaultPath: `vid-${Date.now()}.webm`
//     });

//     if(filePath) {
//         writeFile(filePath, buffer, () => console.log('video saved successfully!'));
//     }
// }

const { desktopCapturer, remote } = require('electron');
const {dialog, Menu} = remote;
const {writeFile} = require('fs');

//global state
let mediaRecorder; //mediarecorder instance to capture footage
const recordedChunks = [];

//Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const videoSelectBtn = document.getElementById("videoSelectBtn");

startBtn.onclick = (e) => {
    console.log(mediaRecorder)
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';
}
stopBtn.onclick = (e) => {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start';
}


videoSelectBtn.onclick = getVideoSources;

  


//get the avaiable video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            }
        })
    );

    videoOptionsMenu.popup();
}

//change the videoSource window to record
async function selectSource(source){
    videoSelectBtn.innerText = source.name;

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    

    //create Stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //preview the source in video element
    videoElement.srcObject = stream;
    videoElement.play();

    //create the media recorder
    const options = {mimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new MediaRecorder(stream, options);

    //register event handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

//captures recorded chunks
function handleDataAvailable(e) {
    console.log('video data available');
    recordedChunks.push(e.data);
}

//saves the vdieo file on stop
async function handleStop(e){
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const {filePath} = await dialog.showSaveDialog({
        buttonlabel: 'Save Video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    if(filePath) {
        writeFile(filePath, buffer, () => console.log('video saved successfully!'));
    }
}