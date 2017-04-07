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
  cur_user: "",
  setProfileData: function (data) { // == saveAllNewsList
    this.data_list = data.q2;
    this.cur_user = data.q1;
    console.log("model에 data_list = ", this.data_list);
    ns.dispatcher.emit({
      "type": "render_profile"
    }, [data]);
  },
};

/**************************************************************/

ns.view = {
  render: function (data) {
    console.log("view > render", data);
    var email = data.q2.email;
    var intro = data.q2.intro;
    var picture = data.q2.pro_picture;
    document.querySelector(".p-picture").src = picture;
    document.querySelector(".p-email").innerHTML = email;
    document.querySelector(".p-intro").innerHTML = intro;
    document.querySelector(".p-postCount").innerHTML = "총 게시물 수 : " + data.q3.length;
    document.querySelector('#hidden_email_value').value = email;
  },
  renderCardList: function (data) {
    data = data.q3;
    console.log("view > renderCardList", data);
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
    console.log("cardView", data);
    console.log(data.q1[0].id);
    document.querySelector(".hidden-id").value = data.q1[0].id;
    document.querySelector(".dialog-profile-picture img").src = document.querySelector(".p-picture").src;
    document.querySelector(".dialog-title").innerHTML = data.q1[0].email;
    document.querySelector(".dialog-picture img").src = data.q1[0].picture;
    document.querySelector(".dialog-content").innerHTML = data.q1[0].contents;
  },
  cardView_comment: function (data) {
    console.log("cardView_comment", data.q2);
    var comment_list = "<ul>";
    for (var value of data.q2) comment_list += "<li><strong>" + value.c_email + "</strong>  " + value.c_comment + "</li>";
    comment_list += "</ul>";
    document.querySelector(".dialog-comments").innerHTML = comment_list;
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
        this.view.cardView_comment(data);
        $('#dialog').dialog('open');
      }.bind(this),
      "AddComment": function (data) {
        this.view.cardView_comment(data);
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

document.querySelector(".comment_form").addEventListener("submit", function (e) {
  setTimeout(function () {
    ns.util.card_ajax("/profile/card_view", document.querySelector(".hidden-id").value, function (result) {
      ns.dispatcher.emit({
        "type": "AddComment"
      }, [result]);
    });
  }, 500);
});