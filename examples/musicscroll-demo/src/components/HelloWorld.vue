<template>
  <div id="hello">
    <div id="fixed">0</div>
    <div id="autoScrollDiv">
      <input name="autoScrollSpeed" type="number" v-model.number="autoScrollSpeed">
      <b-button
        id="autoScrollBtn"
        :pressed.sync="myToggle"
        variant="success"
        >Autoscroll</b-button
      >
    </div>
    <b-button id="bottomScrollBtn" variant="success" click
      >Scroll to bottom</b-button
    >
    <b-button id="topScrollBtn" variant="success" click>Scroll to top</b-button>
    <div id="scrollDiv" />
  </div>
</template>

<script>
import { ScrollElement } from "../../../../index.js";

export default {
  name: "HelloWorld",
  async mounted() {
    const scroll = new ScrollElement(document.getElementById("scrollDiv"));
    const component = this;
    this.scroll = scroll;
    var s = function () {
      const ele = document.getElementById("fixed");
      ele.innerHTML = `${window.scrollY} ${Math.round(
        scroll.getSongProgress() * 100
      )}%`;
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
    document
      .getElementById("autoScrollBtn")
      .addEventListener("click", function () {
        if (this.getAttribute("aria-pressed") === "false")
          scroll.stopAutoScroll();
        else scroll.autoScroll(component.autoScrollSpeed);
      });

    document
      .getElementById("bottomScrollBtn")
      .addEventListener("click", function () {
        window.scrollTo(0, document.body.scrollHeight);
      });
    document
      .getElementById("topScrollBtn")
      .addEventListener("click", function () {
        window.scrollTo(0, 0);
      });
  },
  data() {
    return {
      autoScrollSpeed: 1,
      myToggle: false,
    };
  },
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

#autoScrollDiv {
  position: fixed;
  top: 40px;
  float: right;
  right: 30px;
}

#bottomScrollBtn {
  position: fixed;
  top: 70px;
  float: right;
  right: 30px;
}

#topScrollBtn {
  position: fixed;
  top: 100px;
  float: right;
  right: 30px;
}
</style>

   