document.querySelector("#edit_submit").addEventListener("click", function () {
  console.log("#edit_submit > click")
  var pw_new = document.querySelector("#pw_new").value;
  var pw_new_check = document.querySelector("#pw_new_check").value;


  if (pw != "" && pw_new == pw_new_check) { //비밀번호란이 채워져있다, 새 비밀번호와 확인이 일치한다, 또는 새 비밀번호와 확인이 비어있다
    //비밀번호란의 채워진 값이 맞는지는 app.js에서 처리
    console.log("pw_new == pw_new_check");

    var picture = document.querySelector(".pro-photo-img").src;
    var email = document.querySelector(".article-list p").innerText.split(" : ")[1];
    var phone = document.querySelector("#phone").value;
    var intro = document.querySelector("#intro").value;
    var pw = "";

    if (pw_new != "") { //새 비밀번호가 있을때
      pw_new = document.querySelector("#pw_new").value
      pw = document.querySelector("#pw").value;
      var data = {
        picture: picture,
        email: email,
        phone: phone,
        intro: intro,
        pw: pw_new,
        pw_old: pw
      }
    } else { //새 비밀번호가 없을때
      pw = document.querySelector("#pw").value;
      var data = {
        picture: picture,
        email: email,
        phone: phone,
        intro: intro,
        pw: pw,
        pw_old: pw
      }
    }

    data = JSON.stringify(data);
    var url = "/profile/edit_submit";
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);

    xhr.addEventListener('load', function () {
      var reqData = xhr.responseText; //서버를 통해 받은 데이터, json object로 변환
      console.log(".. util > sendAjax", reqData); //데이터가 잘 넘어왔는지 확인
      if (reqData !== "fail") {
        alert("정상적으로 프로필이 변경되었습니다.");
        history.go(-1);
      } else {
        alert("기존 비밀번호가 틀렸습니다, 다시 확인해주세요.");
      }
    });

  } else {
    alert("새로운 비밀번호와 확인이 일치하지 않습니다.")
  }
});

document.querySelector(".profile_editView").addEventListener("DOMSubtreeModified", function () {
  if (document.querySelector(".uploadcare-widget-file-name") != null) {
    document.querySelector(".pro-photo-img").src = document.querySelector(".profile_editView button").value
  }
});