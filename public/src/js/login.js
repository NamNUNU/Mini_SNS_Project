document.querySelector('.login-form').addEventListener('click',function(event){
  if(event.target.nodeName==="INPUT"){
    document.getElementById(event.target.id).value = "";
    document.getElementById(event.target.id).style.color = "black";
  }
})
document.querySelector('.login-form').addEventListener('focusout',function(event){
  if(event.target.value===""){
    switch(event.target.id){
      case "email" :
        document.getElementById(event.target.id).value = "email";
        document.getElementById(event.target.id).style.color = "grey";
      break;
      case "password" :
        document.getElementById(event.target.id).value = "ipsumipsumipsum";
        document.getElementById(event.target.id).style.color = "grey";
      break;
    }
  }
})

document.querySelector('.ajaxsend').addEventListener('click', function(){
  var email =  document.getElementsByName('email')[0].value;
  var password =  document.getElementsByName('pw')[0].value;
  sendAjax('http://localhost:3000/login',{'email': email, 'pw':password});
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
