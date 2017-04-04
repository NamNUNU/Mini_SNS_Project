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
    this.mainCardData.contents = util.$(".card-maker .txt-box").value;
    this.mainCardData.email = util.$("#loginId").value;

    if(this.mainCardData.picture === ""){
      return;
    }

    util.runAjax(function(e){
      var cardId = JSON.parse(e.target.responseText);
      this.mainCardData.id = cardId;
      mainCard.init(this.mainCardData);
      this.clearCardMaker();
    }.bind(this), "POST", "http://localhost:3000/main/cards", this.mainCardData);
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
        e.preventDefault();
        //console.log(target);
        if(target.classList.contains("btnCommentDel")){
          this.deleteComment(target.parentElement);
        }
      }.bind(this))

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
      var commentData = {};
      commentData.comment = mainCard.querySelector(".reply-comment .txt-box").value;
      commentData.email = util.$("#loginId").value;
      commentData.p_id = mainCard.getAttribute("data-id");

      var commentList = mainCard.querySelector(".comment-list");
      var li = document.createElement("LI");
      li.innerHTML = "<a href='#' class='writer'>"+commentData.email+"</a><span class='txt'>"+commentData.comment+"</span><button class='btnCommentDel'>X</button>"

      util.runAjax(function(e){
        var data = e.target.responseText;
        commentList.appendChild(li);
        mainCard.querySelector(".comment-info .total .num").innerHTML = commentList.childElementCount;
        mainCard.querySelector(".reply-comment .txt-box").value = "";
      }, "POST", "http://localhost:3000/main/cards/comment", commentData)
    },

    deleteComment : function(ele){
      var commentData = {};
      ele.closest(".comment-list").removeChild(ele);
      commentData.id = ele.getAttribute("data-id");
      util.runAjax(function(e){
        var data = e.target.responseText;
      }, "DELETE", "http://localhost:3000/main/cards/comment", commentData);
    },

    moreComment : function(){

    },

    renderView : function(data){
      var mainCardTemplate = util.$("#main-card-template").innerHTML;
      var result = "";

      var loginId = util.$("#loginId").value;


      result = mainCardTemplate.replace("{{email}}", data.email)
                                .replace("{{picture}}", data.picture)

      var contentBox = "";
      if(data.content !== ""){
        contentBox += "<span class='writer'>"+data.email+"</span><span class='txt'>"+data.contents+"</span>"
      }
      result = result.replace("{{content_box}}", contentBox)

      var commentList = "";
      if(data.comments !== undefined){
        for(var i = 0; i < data.comments.length ;i++){
          if(data.comments[i].email === loginId){
            commentList += "<li data-id = '"+data.comments[i].id+"'><a href='#' class='writer'>"+data.comments[i].email+"</a><span class='txt'>"+data.comments[i].comment+"</span><button class='btnCommentDel'>X</button></li>"
          }else{
            commentList += "<li data-id = '"+data.comments[i].id+"'><a href='#' class='writer'>"+data.comments[i].email+"</a><span class='txt'>"+data.comments[i].comment+"</span></li>"
          }
        }
        result = result.replace("{{comment_list}}", commentList)
                        .replace("{{total_comment}}", data.comments.length)
      }else{
        result = result.replace("{{comment_list}}", "")
                        .replace("{{total_comment}}", "0")
      }

      var mainCard = document.createElement("ARTICLE");
      mainCard.classList.add("main-card");
      mainCard.setAttribute("data-id", data.id);
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
    }else{
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
  }, "GET", "http://localhost:3000/main/cards")

});
//http://localhost:3000/public/src/js/data.json
