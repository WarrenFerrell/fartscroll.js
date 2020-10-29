<template>
  <div id="hello">
    <div id="fixed">0</div>
    <b-button id="autoscrollBtn"  :pressed.sync="myToggle" variant="success" click>Autoscroll</b-button>

    <div id="scrollDiv" />
  </div>
</template>

<script>

import { ScrollElement } from "../../../../index.js";

export default {
  name: "HelloWorld",
  async mounted() {
    const scroll = new ScrollElement(
      document.getElementById("scrollDiv")
    );
    var s = function () {
      const ele = document.getElementById("fixed");
      ele.innerHTML = `${window.scrollY} ${Math.round(scroll.getSongProgress() * 100)}%`;
      // console.log('set', ele)
    };
    var resize = function () {
      var ele = document.getElementById("fixed");
      // ele.style.right = window.innerWidth - 400;
      ele.style.top = window.innerHeight / 2;
      console.log("set", ele);
    };
    resize();
    window.addEventListener("scroll", s, false);
    window.addEventListener("resize", resize, false);


    await scroll.loadBufferAsync("marimba.mp3");
    var autoscrollBtn = document.getElementById("autoscrollBtn");
    autoscrollBtn.addEventListener("click", function() {
      if (this.getAttribute("aria-pressed") === "false") scroll.stopAutoScroll();
      else scroll.autoScroll(1);
    })
    this.scroll = scroll;
  },
  data() {
    return {
      myToggle: false,
    } 
    }

    

};
</script>
    
    
<style>
#scrollDiv {
  width: 100px;
  height: 100px;
  background-color: coral;
  color: white;
}
#autoscrollBtn {
  position: fixed;
  top: 40px;
  float: right;
  right: 30px;
}

#fixed {
  position: fixed;
  top: 20px;
  float: right;
  right: 30px;
}
</style>

   