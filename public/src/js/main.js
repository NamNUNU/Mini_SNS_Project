// card를 만들어내는 생성자
function CardMaker(){
  this.init();
  this.mainCardData = {};
}

CardMaker.prototype = {
  init : function(){
    this.regEvent();
  },

  regEvent : function(){
    var cardMaker = util.$(".card-maker");
    cardMaker.addEventListener("click", function(e){
      var target = e.target;
      if(target.classList.contains("btn-upload")){
        this.makeCard();
      }
    }.bind(this))
  },

  makeCard : function(){
    this.mainCardData.picture = util.$(".card-maker #photo_url").value;
    this.mainCardData.content = util.$(".card-maker .txt-box").value;
    this.mainCardData.email = "kimse";
    mainCard.init(this.mainCardData);
    this.clearCardMaker();
  },

  clearCardMaker : function(){
    util.$(".card-maker #photo_url").value = "";
    util.$(".card-maker .txt-box").value = "";
  }

}

// module 패턴적용을 적용하여 하나의 네임스페이스에서 사용하도록 적용
var mainCard = mainCard || {};

mainCard = (function(){

  var init = function(data){
    var view = new View();
    var model = new Model(data);
    var controller = new Controller({
      view : view,
      model : model
    });
    controller.init();
  }

  var View = function(){
    this.mainCardList = util.$(".main-card-list");
  }

  View.prototype = {
    init : function(){
      this.regEvent();
    },

    regEvent : function(card){
      card.addEventListener("click", function(e){
        var target = e.target;
        //console.log(target);
      })

      card.addEventListener('keypress', function (e) {
        var target = e.target;
        var mainCard = target.closest(".main-card");
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
          this.replyComment(mainCard);
        }
      }.bind(this));

    },

    replyComment : function(mainCard){
      var commentValue = mainCard.querySelector(".reply-comment .txt-box").value;
      var commentList = mainCard.querySelector(".main-card .comment-list");
      var li = document.createElement("LI");
      li.innerHTML = "<a href='#' class='writer'>"+"kimse"+"</a><span class='txt'>"+commentValue+"</span>"
      commentList.appendChild(li);
      mainCard.querySelector(".reply-comment .txt-box").value = "";
    },

    deleteComment : function(){

    },

    moreComment : function(){

    },

    renderView : function(data){
      var mainCardTemplate = util.$("#main-card-template").innerHTML;
      var result = "";

      result = mainCardTemplate.replace("{{email}}", data.email)
                                .replace("{{picture}}", data.picture)

      var contentBox = "";
      if(data.content !== ""){
        contentBox += "<span class='writer'>"+data.email+"</span><span class='txt'>"+data.content+"</span>"
      }
      result = result.replace("{{content_box}}", contentBox)

      var commentList = "";
      if(data.comments !== undefined){
        for(var i = 0; i < data.comments.length ;i++){
          commentList += "<li><a href='#' class='writer'>"+data.comments[i].email+"</a><span class='txt'>"+data.comments[i].comment+"</span></li>"
        }
        result = result.replace("{{comment_list}}", commentList)
                        .replace("{{total_comment}}", data.comments.length)
      }else{
        result = result.replace("{{comment_list}}", "")
                        .replace("{{total_comment}}", "0")
      }

      var mainCard = document.createElement("ARTICLE");
      mainCard.classList.add("main-card");
      mainCard.innerHTML = result;
      this.mainCardList.insertBefore(mainCard, this.mainCardList.firstChild);
      return mainCard;
    }
  }

  var Model = function(data){
    this.mainCardData = data;
  };

  Model.prototype = {
    getMainCardData : function(){
      return this.mainCardData;
    },

    getCommentData : function(){
      return this.mainCardData.comments;
    }
  };

  var Controller = function(obj){
    this.view = obj.view;
    this.model = obj.model;
  };

  Controller.prototype = {
    init : function(){
      this.chain();
      dispatcher.emit({"type" : "renderView"}, [this.model.getMainCardData()])
    },

    chain : function(){
      dispatcher.register({
        "renderView" : function(data){
          var card = this.view.renderView(data);
          this.view.regEvent(card);
        }.bind(this)
      })
    }

  };

  var dispatcher = {
    register: function(fnlist) {
      this.fnlist = fnlist;
    },
    emit: function(o, data) {
      this.fnlist[o.type].apply(null, data);
    }
  }

  return {
    init : init
  }

})();

var util = {
  $ : function(ele){
    return document.querySelector(ele);
  },

  //ajax호출하기
  runAjax : function(func, method, url, data){
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", func);
    oReq.open(method, url);

    if(method === "GET"){
      oReq.send();
    }else if(method === "POST"){
      data = JSON.stringify(data);
      oReq.setRequestHeader("content-Type", "application/json");
      oReq.send(data);
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var singleWidget = uploadcare.SingleWidget("[role=uploadcare-uploader]");
  singleWidget.onUploadComplete(function(info){
    document.querySelector("#photo_url").value = document.querySelector("#photo_url").value + info.cdnUrl;
  })

  new CardMaker();
  util.runAjax(function(e){
    var data = JSON.parse(e.target.responseText);
    for(var i = 0; i < data.length; i++){
      mainCard.init(data[i]);
    }
  }, "GET", " http://localhost:8000/public/src/js/data.json")

});
