

const midiNotesCallbackObject = {    
    run: function (n) {        
        currentTime=n.startTime;
        setPostionChanged(currentTime);
        
        if(currentNS.notes.indexOf(n)===(currentNS.notes.length-1)){
            setPlayerComplete(); 
            currentTime=currentNS.totalTime;
            setPostionChanged(currentNS.totalTime);
        }
        console.log(n.startTime);
    },
    stop: () => { }
};

let data = [];

let currentTime=0;
let currentNS=core.midiToSequenceProto();

const soundFont = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';
// const soundFont = 'https://archive.org/download/free-soundfonts-sf2-2019-04/MuseScore_General%28v0.1.3%29.sf2';

const player = new core.SoundFontPlayer(soundFont, undefined, undefined, undefined, midiNotesCallbackObject);

function setSourceBytes(bytes) {
    data = bytes;
    player.loadSamples(getNS());
}

function togglePlayerState() {
    if (player.getPlayState() === 'started') {
        setPlayerState('notPlaying');
        player.pause();
    } else if (player.getPlayState() === 'paused') {
        setPlayerState('playing');
        player.resume();
    } else {
        setPlayerState('playing');
        player.start(getNS(), undefined, 0);
    }
}

function isPlaying() {
    var value = player.isPlaying();
    if (value === true) {
        if (player.getPlayState() === 'paused') {
            return false;
        } else {
            return true;
        }
    }
    return value;
}

function resume() {
    player.stop();
    setPlayerState('playing');
    player.start(currentNS, undefined, currentTime);
    
}

function pause() {
    setPlayerState('notPlaying');
    return player.pause();
}

function stop() {
    setPlayerState('notPlaying');
    return player.stop();
}

function seek(time) {
    currentTime=time;
    if (player.isPlaying()) {
        if (player.getPlayState() === 'started') {
            player.pause();
          }
        player.seekTo(time);
        if (player.getPlayState() === 'paused') {
          player.resume();
        }
    }
}

function getCurrentFileDuration() {
    return currentNS.totalTime;
}

function getNS(){
    currentNS= core.midiToSequenceProto(data);
    setDurationChanged(currentNS.totalTime);
    return currentNS;
}
