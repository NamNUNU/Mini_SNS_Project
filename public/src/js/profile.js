var ns = {}; //name space

ns.util = {
  ajax: function (url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    var email = window.document.URL.split("=")[1];
    var email_json = {
      email: email
    };
    xhr.send(JSON.stringify(email_json));
    xhr.addEventListener('load', function () {
      var data = JSON.parse(xhr.responseText); //서버를 통해 받은 데이터, json object로 변환
      fn(data); //데이터를 함수의 인자로 전달
    });
  },
  card_ajax: function (url, alt, fn) {
    console.log("card_ajax");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    var id = {
      id: alt
    };
    xhr.send(JSON.stringify(id));
    xhr.addEventListener('load', function () {
      var data = JSON.parse(xhr.responseText); //서버를 통해 받은 데이터, json object로 변환
      console.log("card_ajax callback", data);
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
    console.log("view > render");
    var email = data[0].email;
    var intro = data[0].intro;
    var picture = data[0].pro_picture;
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
      card_list += "<img class=\"pro-card\" src=\"" + data[i].picture + "\" alt=\"" + data[i].id + "\">";
    }
    document.querySelector('.pro-cardView').innerHTML = card_list;
  },
  set_card: function () {
    console.log("set_card");
    $("#dialog").dialog({
      resizable: false,
      draggable: false,
      height: "auto",
      width: 800,
      modal: true,
      autoOpen: false
    });
    $("#dialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


    document.querySelector("body").addEventListener("click", function (e) {
      if (e.target.classList[0] == "ui-widget-overlay") {
        $('#dialog').dialog('close');
      }
    });
  },
  cardView: function (data) {
    document.querySelector(".dialog-profile-picture img").src = document.querySelector(".p-picture").src;
    console.log(document.querySelector(".p-picture").src);
    document.querySelector(".dialog-title").innerHTML = data[0].email;
    document.querySelector(".dialog-picture img").src = data[0].picture;
    document.querySelector(".dialog-content").innerHTML = data[0].contents;
    var comment_list = "<ul>";
    for (var value of data) comment_list += "<li><strong>" + value.c_email + "</strong>  "+ value.c_comment +"</li>";
    comment_list += "</ul>";
    document.querySelector(".dialog-comments").innerHTML = comment_list;
    $('#dialog').dialog('open');
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
      }.bind(this),
      "cardModal": function () {
        this.view.set_card();
      }.bind(this),
      "cardClick": function (data) {
        this.view.cardView(data);
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
  ns.util.ajax("/profile/render", function (result) {
    ns.dispatcher.emit({
      "type": "initView"
    }, [result]);
  });
  ns.dispatcher.emit({
    "type": "cardModal"
  }, []);
});

document.addEventListener('click', function (e) {
  if (e.target.className === 'pro-card') {
    console.log("pro-card Click");
    ns.util.card_ajax("/profile/card_view", e.target.alt, function (result) {
      ns.dispatcher.emit({
        "type": "cardClick"
      }, [result]);
    });
  }
});