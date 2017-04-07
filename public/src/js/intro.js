var state = "login";

document.addEventListener("DOMContentLoaded", function(){
  var singleWidget = uploadcare.SingleWidget("[role=uploadcare-uploader]");
  singleWidget.onUploadComplete(function(info){
    document.querySelector("#picture").value = info.cdnUrl;
  })
});

document.querySelector('.input-text-wrap').addEventListener('click',function(event){
  if(event.target.nodeName==="INPUT"){
    document.getElementById(event.target.id).value = "";
    document.getElementById(event.target.id).style.color = "black";
  }
})

document.querySelector('.input-text-wrap').addEventListener('focusout',function(event){
  if(event.target.value===""){
    switch(event.target.id){
      case "email" :
        document.getElementById(event.target.id).value = "이메일을 입력하세요";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "password" :
        document.getElementById(event.target.id).value = "ipsumipsumipsum";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "repassword" :
        document.getElementById(event.target.id).value = "ipsumipsumipsum";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "phone" :
        document.getElementById(event.target.id).value = "( - ) 없이 입력하세요";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "intro" :
        document.getElementById(event.target.id).value = "자기소개를 입력하세요";
        document.getElementById(event.target.id).style.color = "grey";
      break;
    }
  }
  document.querySelector('.input-text-wrap').addEventListener('keyup', function(event){
    if(event.target.id==="repassword"){
      var pw = document.querySelector("#password").value;
      var repw = document.querySelector("#repassword").value;
      if(pw!==repw){
        document.querySelector(".confirm-pw").innerHTML = "비밀번호가 일치하지 않습니다"
        document.querySelector(".confirm-pw").style.color = "red"
      }
      else{
        document.querySelector(".confirm-pw").innerHTML = "비밀번호가 일치합니다"
        document.querySelector(".confirm-pw").style.color = "green"
      }
    }
  })
})

document.querySelector('.move-join-text').addEventListener('click',function(){
  if(state==="login"){
    document.querySelector('.login-form').style.display = "none";
    document.querySelector('.join-form').style.display = "block";
    state="join"
  }else{
    document.querySelector('.login-form').style.display = "block";
    document.querySelector('.join-form').style.display = "none";
    state==="login"
  }
})


document.querySelector('.login-form').addEventListener('click',function(event){
  if(event.target.nodeName==="INPUT"){
    document.getElementById(event.target.id).value = "";
    document.getElementById(event.target.id).style.color = "black";
  }
})
document.querySelector('.login-form').addEventListener('focusout',function(event){
  if(event.target.value===""){
    switch(event.target.id){
      case "login-email" :
        document.getElementById(event.target.id).value = "email";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "login-password" :
        document.getElementById(event.target.id).value = "ipsumipsumipsum";
        document.getElementById(event.target.id).style.color = "grey";
      break;
    }
  }
})

document.querySelector('.ajaxsend').addEventListener('click', function(){
  var email =  document.getElementsByName('login-email')[0].value;
  var password =  document.getElementsByName('login-pw')[0].value;
  sendAjax('http://localhost:3000/intro/login',{'email': email, 'pw':password});
})

function sendAjax(url, data){
  data = JSON.stringify(data);

  var oReq = new XMLHttpRequest();
  oReq.open('POST', url);
  oReq.setRequestHeader('Content-Type', 'application/json')
  oReq.send(data);


  oReq.addEventListener('load', function(){
    var result = JSON.parse(oReq.responseText);
    console.log(data, result);
    var resultDiv = document.querySelector('.result');

    if(result.email) {
      window.location.href = '/main'
    }
    else if(oReq.status === 400){
      resultDiv.innerHTML = "<div class='warning'> 이메일이나 비밀번호가 틀렸습니다. </div>"
    }
  });
}
