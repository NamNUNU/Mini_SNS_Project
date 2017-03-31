var ns = {}; //name space

ns.util = {
  testAjax: function (url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.addEventListener('load', function () {
      var data = JSON.parse(xhr.responseText); //서버를 통해 받은 데이터, json object로 변환
      console.log("xhr.addEventListener('load', function () {", data); //데이터가 잘 넘어왔는지 확인
      fn(data); //데이터를 함수의 인자로 전달
    });
  }
};

/**************************************************************/

ns.dispatcher = {
  register: function (fnlist) {
    this.fnlist = fnlist;
  },
  emit: function (o, data) {
    this.fnlist[o.type].apply(null, data);
  }
};

/**************************************************************/

ns.model = {
  data_list: [],
  setProfileData: function (data) { // == saveAllNewsList
    this.data_list = data;
    ns.dispatcher.emit({
      "type": "render_profile"
    }, [data]);
  },
};

/**************************************************************/

ns.view = {
  render: function (data) {
    console.log("view > render", data);
    var email = data[0].email;
    var intro = data[0].intro;
    var picture = 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg';
    document.querySelector(".p-picture").src = picture;
    document.querySelector(".p-email").innerHTML = email;
    document.querySelector(".p-intro").innerHTML = intro;
    document.querySelector(".p-postCount").innerHTML = "총 게시물 수 : " + data.length;

    document.querySelector('#hidden_email_value').value = data[0].email;
  },
  renderCardList: function (data) {
    console.log("view > renderCardList");
    var card_list = "";
    var data_length = data.length;
    for (var i = 0; i < data_length; i++) {
      card_list += "<img class=\"pro-card\" src=\"" + data[i].picture + "\" alt=\"CARD\">";
    }
    document.querySelector('.pro-cardView').innerHTML = card_list;
  }
};

/**************************************************************/

ns.controller = {
  join: function () {
    ns.dispatcher.register({
      "initView": function (data) {
        this.model.setProfileData(data);
      }.bind(this),
      //Model
      "render_profile": function (data) {
        this.view.render(data);
        this.view.renderCardList(data);
      }.bind(this)
    });
  }
};

/**************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  var model = Object.assign(Object.create(ns.model), {});
  var view = Object.assign(Object.create(ns.view), {});
  var controller = Object.assign(Object.create(ns.controller), {
    model: model,
    view: view
  });

  controller.join();
});


document.addEventListener("DOMContentLoaded", function () {
  ns.util.testAjax("http://localhost:3000/test", function (result) {
    ns.dispatcher.emit({
      "type": "initView"
    }, [result]);
  });
});