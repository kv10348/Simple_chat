
// var User= require("moment");

var socket=io.connect("http://localhost:4000");
var url =window.location.href;
var idx = url.indexOf("4000/");
var idx2 = url.indexOf("/chat");
var hash = idx != -1 ? url.substring(idx+5, idx2) : "";
//query DOM

var message=document.getElementById("msg_input"),
        btn=document.getElementById('msg_btn'),
        chat_window=document.getElementById("chat_window"),
        message_right=document.getElementsByClassName("msg right-msg"),
        msg_left=document.getElementById("msg_left");


document.getElementById('msg_btn').addEventListener('click',function(){
       // console.log("kapi");
        
        // console.log(url)
        // console.log(idx2);
        //console.log(hash);
        // console.log("=============");

       


        
       
        socket.emit('chat',{
                name:x.username,
                message: message.value,
                id:hash
        });
});
// function myFunction() {
//        console.log("kamli0");
//         socket.emit('chat',{
//                 name:"kapil",
//                 message: message.value
//         });
//       }

//listen for events
socket.on('chat',function(data){
        // message_left.innerHTML+=data.message
//        console.log("============");
//        console.log(x)
       var username=data.name;
       var msg=data.message;
//        console.log("========");
//        console.log(msg);
//        console.log("========");
        output({username,msg});
        message.value="";
        message.focus();
        chat_window.scrollTop = chat_window.scrollHeight;
});


function output({username,msg}){
        // console.log("========");
        // console.log(msg);
        // console.log("========");
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        chat_window.innerHTML+=`<div class="msg right-msg" id="msg_left">
       <div
        class="msg-img"
        style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
       ></div>
 
       <div class="msg-bubble">
         <div class="msg-info">
           <div class="msg-info-name">`+username+`</div>
           <div class="msg-info-time">`+time+`</div>
         </div>
 
         <div class="msg-text">`
          +msg+
         `</div>
       </div>
     </div>
 `;
}