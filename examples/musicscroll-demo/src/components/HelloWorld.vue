<template>
  <div id="hello">
    <div id="fixed">0</div>

    <div id="scrollDiv" />
  </div>
</template>

<script>
import { ScrollElement } from "../../../../index.js";

export default {
  name: "HelloWorld",
  async mounted() {
    var s = function () {
      const ele = document.getElementById("fixed");
      ele.innerHTML = window.scrollY;
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

    const scroll = new ScrollElement(
      document.getElementById("scrollDiv")
    );
    await scroll.loadBufferAsync("TwinkleTwinkle.mp3");

    // scroll.autoScroll(1);
  },
  created() {

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

#fixed {
  position: fixed;
  top: 20px;
  float: right;
  right: 30px;
}
</style>

   