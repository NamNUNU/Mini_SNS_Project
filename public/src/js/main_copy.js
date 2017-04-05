// card를 만들어내는 생성자
function CardMaker(){
}

function MainCard(){
  this.init();
}

MainCard.prototype = {
  init : function(){
    var cardHeaderView = new CardHeaderView();
    cardHeaderView.init();
  }
}


function CardHeaderView(){
  this.cardHeader = util.$(".main-card .card-header");
}

CardHeaderView.prototype = {
  init : function(){
    this.regEvent();
  },

  regEvent : function(){
    this.cardHeader.addEventListener("click", function(e){
      var target = e.target;
      console.log(target);
    })
  },

  renderView : function(){

  }
}

function CardPhotoView(){

}

CardPhotoView.prototype = {
  init : function(){

  },

  regEvent : function(){

  },

  renderView : function(){

  }
}

function CardContentView(){

}

CardContentView.prototype = {
  init : function(){

  },

  regEvent : function(){

  },

  replyComment : function(){

  },

  deleteComment : function(){

  },

  moreComment : function(){

  },

  renderView : function(){

  }
}

function CardModel(){

}

function CardController(){

}

//var mainCard = mainCard || {}

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

var dispatcher = {
  register: function(fnlist) {
    this.fnlist = fnlist;
  },
  emit: function(o, data) {
    this.fnlist[o.type].apply(null, data);
  }
}


document.addEventListener("DOMContentLoaded", function(){
  var mainCard = new MainCard();
  mainCard.init();
});
