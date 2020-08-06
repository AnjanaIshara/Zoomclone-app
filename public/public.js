

const videoGrid=document.getElementById('video-grid')
const myVideo=document.createElement('video');
const socket=io('/');
myVideo.muted=true;
var peer = new Peer(undefined,{
    path:'./peerjs',
    host:'/',
    port: '443'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);
    peer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
})
peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})

socket.on('user-conneted',(userId)=>{
    connectToNewUser(userId,stream);
})
const connectToNewUser=(userId,stream)=>{
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
}
const addVideoStream =(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);

}
let text=$('input')

$('html').keydown((e)=>{
    if(e.which ==13 && text.val().length!==0){
        
        socket.emit('message',text.val());
        text.val('')
    }
})
socket.on('createMessage',message=>{
    $('ul').append(`<li><b>User</b><br/>${message}</li>`);
    scrollToBottom();
})

const scrollToBottom=()=>{

    var d=$('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
const muteUnmute=()=>{

    
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }

}
const setUnmuteButton=()=>{
    const html=`
    <i class="unmute fa fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;

}
const setMuteButton=()=>{
    const html=`
    <i class="unmute fa fa-microphone"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const playStop=()=>{
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }

}
const setStopVideo=()=>{
    const html=`
    <i class="fa fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}
const setPlayVideo=()=>{
    const html=`
    <i class="stop fa fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}