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
    this.mainCardData.writedate = util.nowDate();

    if(this.mainCardData.picture === ""){
      return;
    }

    util.$(".uploadcare-widget-button-remove").click();

    util.runAjax(function(e){
      var data = JSON.parse(e.target.responseText);
      this.mainCardData.id = data.id;
      this.mainCardData.email = data.email;
      mainCard.init(this.mainCardData, "before");
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
  var init = function(data, direction){
    var view = new View(direction);
    var model = new Model(data);
    var controller = new Controller({
      view : view,
      model : model
    });
    controller.init();
  }

  var View = function(direction){
    this.mainCardList = util.$(".main-card-list");
    this.direction = direction;
  }

  View.prototype = {
    init : function(){
      this.regEvent();
    },

    regEvent : function(card){
      card.addEventListener("click", function(e){
        var target = e.target;
        //e.preventDefault();
        if(target.classList.contains("btnCommentDel")){
          this.deleteComment(target.parentElement);
        }
      }.bind(this))

      card.addEventListener('keypress', function (e) {
        var txtBox = card.querySelector(".card-content .reply-comment .txt-box");
        var target = e.target;
        var mainCard = target.closest(".main-card");
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
          if(txtBox.value === ""){
            return;
          }
          this.replyComment(mainCard);
        }
      }.bind(this));

    },
// 카드 댓글 추가
    replyComment : function(mainCard){
      var commentData = {};
      commentData.comment = mainCard.querySelector(".reply-comment .txt-box").value;
      commentData.p_id = mainCard.getAttribute("data-id");

      var commentList = mainCard.querySelector(".comment-list");
      var li = document.createElement("LI");

      util.runAjax(function(e){
        var data = JSON.parse(e.target.responseText);
        li.setAttribute("data-id", data.id);
        li.innerHTML = "<a href='/profile?search="+data.email+"' class='writer'>"+data.email+"</a><span class='txt'>"+commentData.comment+"</span><button class='btnCommentDel'>X</button>"
        commentList.appendChild(li);
        mainCard.querySelector(".comment-info .total .num").innerHTML = commentList.childElementCount;
        mainCard.querySelector(".reply-comment .txt-box").value = "";
      }, "POST", "http://localhost:3000/main/cards/comment", commentData)
    },
// 카드 댓글 삭제
    deleteComment : function(ele){
      var commentData = {};
      var mainCard = ele.closest(".main-card");
      var commentList = mainCard.querySelector(".comment-list");
      ele.closest(".comment-list").removeChild(ele);
      commentData.id = ele.getAttribute("data-id");
      util.runAjax(function(e){
        var data = JSON.parse(e.target.responseText);
        console.log("a")
        mainCard.querySelector(".comment-info .total .num").innerHTML = commentList.childElementCount;
      }, "DELETE", "http://localhost:3000/main/cards/comment", commentData);
    },
// 댓글 더보기 기능 아직 미구현
    moreComment : function(){

    },

    renderView : function(data){
      var mainCardTemplate = util.$("#main-card-template").innerHTML;
      var result = "";
      var loginId = util.$("#loginId").value;
      result = mainCardTemplate.replace("{{email}}", data.email)
                                .replace("{{write_date}}", data.writedate)
                                .replace("{{picture}}", data.picture)
                                .replace("{{email2}}", data.email)

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

      if(this.direction === "after"){
        this.mainCardList.appendChild(mainCard);
      }else{
        this.mainCardList.insertBefore(mainCard, this.mainCardList.firstChild);
      }
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
  },

  nowDate : function() {
  	var date = new Date();
  	var m = date.getMonth()+1;
  	var d = date.getDate();
  	var h = date.getHours();
  	var i = date.getMinutes();
  	var s = date.getSeconds();
  	return date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)+' '+(h>9?h:'0'+h)+':'+(i>9?i:'0'+i)+':'+(s>9?s:'0'+s);
  }
}
/*

더읽어드리기 버튼
1. 최초에 모든 카드 데이터를 받아둔다.
   1-1 데이터가 10개 이하이면 더읽어들이기 버튼 생성하지 않는다.
   1-2 데이터가 11개 이상이면 더읽어들이기 버튼 생성한다.
2. 데이터가 10개 이상인 경우 10개 까지만 mainCard.init()
3. 현재까지 보여준 데이터의 갯수를 저장해 둔다.
4. 더읽어드리기 버튼을 클릭할 경우 갯수를 저장해둔 변수를 이용하여 그다음 10개까지 보여준다.
   4-1 더읽어들인 데이터의 갯수가 10개 이하이면 더읽어들이기 버튼 생성하지 않는다.
   4-2 더읽어들인 데이터의 갯수가 11개 이상이며 버튼 생성.
*/

function MoreCardButton(obj){
  this.LOADCARDNUM = obj.LOADCARDNUM;
  this.cardDataArr = obj.data;
  this.loadCardIndex = this.LOADCARDNUM;
  this.flag = true;

  this.init();
}

MoreCardButton.prototype = {
  init : function(){
    if(this.cardDataArr.length <= this.LOADCARDNUM){
      return;
    }else{
      this.renderView();
    }
  },

  renderView : function(){
    var content = util.$(".container .content");
    var aTag = document.createElement("A");
    aTag.classList.add("card-more-btn");
    aTag.innerHTML = "더 읽어들이기";
    content.appendChild(aTag);
    this.regEvent(aTag);
  },

  regEvent : function(btnEle){
    btnEle.addEventListener("click", function(e){
      for(var i = this.loadCardIndex; i < this.loadCardIndex + this.LOADCARDNUM; i++ ){
        if(this.cardDataArr[i] === undefined){
          this.flag = false;
          continue;
        }else{
          mainCard.init(this.cardDataArr[i], "after");
        }
      }

      if(this.flag === false){
        var content = util.$(".container .content");
        content.removeChild(btnEle)
      }

      this.loadCardIndex += this.LOADCARDNUM;

    }.bind(this))
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var singleWidget = uploadcare.SingleWidget("[role=uploadcare-uploader]");
  function installWidgetPreviewSingle(widget, img) {
    img.classList.add("preview-img");
    widget.onChange(function(file) {
      img.style.display = "none";
      img.style.width = "50px";
      img.style.height = "50px";
      img.setAttribute("src", "");
      if (file) {
        file.done(function(fileInfo) {
          var previewUrl = fileInfo.cdnUrl;
          img.style.display = "block";
          img.setAttribute("src", previewUrl);
        });
      }
    });
  }


  installWidgetPreviewSingle(
    uploadcare.SingleWidget(util.$('.upload input')),
    util.$('.upload img')
  );

  new CardMaker();
  util.runAjax(function(e){
    var LOADCARDNUM = 10;
    var data = JSON.parse(e.target.responseText);

    new MoreCardButton({
      "data" : data,
      "LOADCARDNUM" : LOADCARDNUM
    });

    for(var i = 0; i < LOADCARDNUM; i++){
      if(data[i] === undefined){
        return;
      }
      mainCard.init(data[i], "after");
    }
  }, "GET", "http://localhost:3000/main/cards")

});
