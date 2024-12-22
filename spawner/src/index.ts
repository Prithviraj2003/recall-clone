import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import os from "os";
import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config()
async function openMeet(driver: WebDriver) {
  try {
    await driver.get(process.env.MEETING_LINK??"https://meet.google.com/");
    console.log("Title of the website : " + (await driver.getTitle()));
    const nameInput = await driver.wait(
      until.elementLocated(By.xpath('//input[@placeholder="Your name"]')),
      25000
    );
    await driver.sleep(2000);
    await nameInput.sendKeys(process.env.BOT_NAME??"Meeting bot");
    const buttonInput = await driver.wait(
      until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')),
      15000
    );
    await buttonInput.click();
  } catch (e) {
    console.log(e);
  }
}

async function getDriver() {
  const options = new Options({});
  options.addArguments("--disable-blink-features=AutomationControlled");
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1920,1200");
  options.addArguments("--use-fake-ui-for-media-stream");
  options.addArguments("--auto-select-desktop-capture-source=[RECORD]");
  options.addArguments("--enable-usermedia-screen-capturing");
  options.addArguments('--auto-select-tab-capture-source-by-title="Meet"');
  options.addArguments("--allow-running-insecure-content");
  // options.setExperimentalOption("excludeSwitches", ["enable-automation"]);
  // options.setExperimentalOption("useAutomationExtension", false);
  options.addArguments(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.205 Safari/537.36"
  );
  options.addArguments("--no-sandbox");

  // ​​--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content--allow-file-access-from-files--use-fake-device-for-media-stream--allow-running-insecure-content

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
  return driver;
}

async function startScreenshare(driver: WebDriver) {
  console.log("startScreensharecalled");
  try {
    if (os.platform() === "win32") {
      const batFilePath = "start_MTX_docker.bat";
      // Run the .bat file
      exec(batFilePath, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }else{
      const shFilePath = "start_MTX_docker.sh";
      // Run the .sh file
      exec(shFilePath, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
  await driver.sleep(2000);
  try {
    const MTXLibrary = `(function() {
  function unquoteCredential(v) {
    return JSON.parse('"' + v + '"');
  }

  function linkToIceServers(links) {
    return (links !== null) ? links.split(', ').map(function(link) {
      var m = link.match(/^<(.+?)>; rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i);
      var ret = {
        urls: [m[1]]
      };

      if (m[3] !== undefined) {
        ret.username = unquoteCredential(m[3]);
        ret.credential = unquoteCredential(m[4]);
        ret.credentialType = 'password';
      }

      return ret;
    }) : [];
  }

  function parseOffer(offer) {
    var ret = {
      iceUfrag: '',
      icePwd: '',
      medias: []
    };

    var lines = offer.split('\\r\\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.startsWith('m=')) {
        ret.medias.push(line.slice('m='.length));
      } else if (ret.iceUfrag === '' && line.startsWith('a=ice-ufrag:')) {
        ret.iceUfrag = line.slice('a=ice-ufrag:'.length);
      } else if (ret.icePwd === '' && line.startsWith('a=ice-pwd:')) {
        ret.icePwd = line.slice('a=ice-pwd:'.length);
      }
    }

    return ret;
  }

  function generateSdpFragment(od, candidates) {
    var candidatesByMedia = {};
    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      var mid = candidate.sdpMLineIndex;
      if (candidatesByMedia[mid] === undefined) {
        candidatesByMedia[mid] = [];
      }
      candidatesByMedia[mid].push(candidate);
    }

    var frag = 'a=ice-ufrag:' + od.iceUfrag + '\\r\\n' + 
               'a=ice-pwd:' + od.icePwd + '\\r\\n';

    var mid = 0;
    for (var j = 0; j < od.medias.length; j++) {
      var media = od.medias[j];
      if (candidatesByMedia[mid] !== undefined) {
        frag += 'm=' + media + '\\r\\n' + 
                'a=mid:' + mid + '\\r\\n';

        for (var k = 0; k < candidatesByMedia[mid].length; k++) {
          frag += 'a=' + candidatesByMedia[mid][k].candidate + '\\r\\n';
        }
      }
      mid++;
    }

    return frag;
  }

  function setCodec(section, codec) {
    var lines = section.split('\\r\\n');
    var lines2 = [];
    var payloadFormats = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.startsWith('a=rtpmap:')) {
        lines2.push(line);
      } else {
        if (line.toLowerCase().includes(codec)) {
          payloadFormats.push(line.slice('a=rtpmap:'.length).split(' ')[0]);
          lines2.push(line);
        }
      }
    }

    var lines3 = [];
    var firstLine = true;

    for (var j = 0; j < lines2.length; j++) {
      var line = lines2[j];
      if (firstLine) {
        firstLine = false;
        lines3.push(line.split(' ').slice(0, 3).concat(payloadFormats).join(' '));
      } else if (line.startsWith('a=fmtp:')) {
        if (payloadFormats.includes(line.slice('a=fmtp:'.length).split(' ')[0])) {
          lines3.push(line);
        }
      } else if (line.startsWith('a=rtcp-fb:')) {
        if (payloadFormats.includes(line.slice('a=rtcp-fb:'.length).split(' ')[0])) {
          lines3.push(line);
        }
      } else {
        lines3.push(line);
      }
    }

    return lines3.join('\\r\\n');
  }

  function setVideoBitrate(section, bitrate) {
    var lines = section.split('\\r\\n');
    var newLines = [];

    for (var i = 0; i < lines.length; i++) {
      newLines.push(lines[i]);
      if (lines[i].startsWith('c=')) {
        newLines.push('b=TIAS:' + (parseInt(bitrate) * 1024).toString());
      }
    }

    return newLines.join('\\r\\n');
  }

  function setAudioBitrate(section, bitrate, voice) {
    var opusPayloadFormat = '';
    var lines = section.split('\\r\\n');

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('a=rtpmap:') && lines[i].toLowerCase().includes('opus/')) {
        opusPayloadFormat = lines[i].slice('a=rtpmap:'.length).split(' ')[0];
        break;
      }
    }

    if (opusPayloadFormat === '') {
      return section;
    }

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('a=fmtp:' + opusPayloadFormat + ' ')) {
        if (voice) {
          lines[i] = 'a=fmtp:' + opusPayloadFormat + ' minptime=10;useinbandfec=1;maxaveragebitrate=' + 
                     (parseInt(bitrate) * 1024).toString();
        } else {
          lines[i] = 'a=fmtp:' + opusPayloadFormat + ' maxplaybackrate=48000;stereo=1;sprop-stereo=1;maxaveragebitrate=' + 
                     (parseInt(bitrate) * 1024).toString();
        }
      }
    }

    return lines.join('\\r\\n');
  }

  function editOffer(sdp, videoCodec, audioCodec, audioBitrate, audioVoice) {
    var sections = sdp.split('m=');

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].startsWith('video')) {
        sections[i] = setCodec(sections[i], videoCodec);
      } else if (sections[i].startsWith('audio')) {
        sections[i] = setAudioBitrate(setCodec(sections[i], audioCodec), audioBitrate, audioVoice);
      }
    }

    return sections.join('m=');
  }

  function editAnswer(sdp, videoBitrate) {
    var sections = sdp.split('m=');

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].startsWith('video')) {
        sections[i] = setVideoBitrate(sections[i], videoBitrate);
      }
    }

    return sections.join('m=');
  }

  var retryPause = 2000;

    class MediaMTXWebRTCPublisher {
    constructor(conf) {
      this.conf = conf;
      this.state = 'initializing';
      this.restartTimeout = null;
      this.pc = null;
      this.offerData = null;
      this.sessionUrl = null;
      this.queuedCandidates = [];

      this.start();
    }

    start = () => {
      this.state = 'running';

      this.requestICEServers()
        .then((iceServers) => this.setupPeerConnection(iceServers))
        .then((offer) => this.sendOffer(offer))
        .then((answer) => this.setAnswer(answer))
        .catch((err) => {
          this.handleError(err.toString());
        });
    };

    handleError = (err) => {
      if (this.state === 'restarting' || this.state === 'error') {
        return;
      }

      if (this.pc !== null) {
        this.pc.close();
        this.pc = null;
      }

      this.offerData = null;

      if (this.sessionUrl !== null) {
        fetch(this.sessionUrl, {
          method: 'DELETE',
        });
        this.sessionUrl = null;
      }

      this.queuedCandidates = [];

      if (this.state === 'running') {
        this.state = 'restarting';

        this.restartTimeout = window.setTimeout(() => {
          this.restartTimeout = null;
          this.start();
        }, retryPause);

        if (this.conf.onError !== undefined) {
          this.conf.onError(err + ', retrying in some seconds');
        }
      } else {
        this.state = 'error';

        if (this.conf.onError !== undefined) {
          this.conf.onError(err);
        }
      }
    };

    requestICEServers = () => {
      return fetch(this.conf.url, {
        method: 'OPTIONS',
      })
        .then((res) => linkToIceServers(res.headers.get('Link')));
    };

    setupPeerConnection = (iceServers) => {
      this.pc = new RTCPeerConnection({
        iceServers,
        // https://webrtc.org/getting-started/unified-plan-transition-guide
        sdpSemantics: 'unified-plan',
      });

      this.pc.onicecandidate = (evt) => this.onLocalCandidate(evt);
      this.pc.oniceconnectionstatechange = () => this.onConnectionState();

      this.conf.stream.getTracks().forEach((track) => {
        this.pc.addTrack(track, this.conf.stream);
      });

      return this.pc.createOffer()
        .then((offer) => {
          this.offerData = parseOffer(offer.sdp);

          return this.pc.setLocalDescription(offer)
            .then(() => offer.sdp);
        });
    };

    sendOffer = (offer) => {
      offer = editOffer(
        offer,
        this.conf.videoCodec,
        this.conf.audioCodec,
        this.conf.audioBitrate,
        this.conf.audioVoice);

      return fetch(this.conf.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer,
      })
        .then((res) => {
          switch (res.status) {
          case 201:
            break;
          case 400:
            return res.json().then((e) => { throw new Error(e.error); });
          default:
            throw new Error("bad status code" +res.status);
          }

          this.sessionUrl = new URL(res.headers.get('location'), this.conf.url).toString();

          return res.text();
        });
    };

    setAnswer = (answer) => {
      if (this.state !== 'running') {
        return;
      }

      answer = editAnswer(answer, this.conf.videoBitrate);

      return this.pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: answer,
      }))
        .then(() => {
          if (this.queuedCandidates.length !== 0) {
            this.sendLocalCandidates(this.queuedCandidates);
            this.queuedCandidates = [];
          }
        });
    };

    onLocalCandidate = (evt) => {
      if (this.state !== 'running') {
        return;
      }

      if (evt.candidate !== null) {
        if (this.sessionUrl === null) {
          this.queuedCandidates.push(evt.candidate);
        } else {
          this.sendLocalCandidates([evt.candidate]);
        }
      }
    };

    sendLocalCandidates = (candidates) => {
      fetch(this.sessionUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/trickle-ice-sdpfrag',
          'If-Match': '*',
        },
        body: generateSdpFragment(this.offerData, candidates),
      })
        .then((res) => {
          switch (res.status) {
          case 204:
            break;
          case 404:
            throw new Error('stream not found');
          default:
            throw new Error("bad status code" +res.status);
          }
        })
        .catch((err) => {
          this.handleError(err.toString());
        });
    };

    onConnectionState = () => {
      if (this.state !== 'running') {
        return;
      }

      if (this.pc.iceConnectionState === 'failed') {
        this.handleError('peer connection closed');
      } else if (this.pc.iceConnectionState === 'connected') {
        if (this.conf.onConnected !== undefined) {
          this.conf.onConnected();
        }
      }
    };

  }
  window.MediaMTXWebRTCPublisher = MediaMTXWebRTCPublisher;
})();`;
    const streamSscript = `
    const onStream = (stream) => {
        new MediaMTXWebRTCPublisher({
          url: "http://localhost:9889/mystream/whip",
          stream,
          videoCodec: "h264/90000",
          videoBitrate: "2000",
          audioCodec: "opus/48000",
          audioBitrate: "32",
          onError: (err) => {
            console.log(err);
          },
          onConnected: () => {
            console.log("Connected successfully");
          },
        });
      };
    window.navigator.mediaDevices
  .getDisplayMedia({
    video: {
      displaySurface: "browser", // Capture browser window
    },
    audio: true,
    preferCurrentTab: true,
  })
  .then(async (screenStream) => {
    const audioContext = new AudioContext();
    // const screenAudioStream =
    //   audioContext.createMediaStreamSource(screenStream);
    const audioEl1 = document.querySelectorAll("audio")[0];
    const audioEl2 = document.querySelectorAll("audio")[1];
    const audioEl3 = document.querySelectorAll("audio")[2];
    const audioElStream1 = audioContext.createMediaStreamSource(
      audioEl1.srcObject
    );
    const audioElStream2 = audioContext.createMediaStreamSource(
      audioEl3.srcObject
    );
    const audioElStream3 = audioContext.createMediaStreamSource(
      audioEl2.srcObject
    );

    const dest = audioContext.createMediaStreamDestination();

    // screenAudioStream.connect(dest);
    audioElStream1.connect(dest);
    audioElStream2.connect(dest);
    audioElStream3.connect(dest);
    // Combine screen and audio streams
    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);
    onStream(combinedStream);
    console.log("Stream Started")
  });
`;
    await driver.executeScript(MTXLibrary);
    await driver.executeScript(streamSscript);
    console.log("Script executed");
    await driver.sleep(2000);
    if (os.platform() === "win32") {
      const batFilePath = "start_ffmpeg.bat";
      // Run the .bat file
      exec(batFilePath, (error, stdout, stderr) => {
        if (error) { 
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }else{
      const shFilePath = "start_ffmpeg.sh";
      // Run the .sh file
      exec('DURATION=20 bash '+shFilePath, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
  await driver.sleep(1000000);
  driver.quit();
}

async function main() {
  if(process.env.MEETING_LINK === undefined){
    console.log("Please provide the meeting url in the .env file");
    return;
  }
  const driver = await getDriver();
  await openMeet(driver);
  await startScreenshare(driver);
}
main();
