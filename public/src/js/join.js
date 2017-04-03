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
