function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

var demo = new Vue({
  el: '#demo',
  data: {
    keyword: 'Hello Vue!',
    shown_keyword: '',
    hint: '',
    search_format: 'https://www.baidu.com/baidu?wd={value}',
    silly_butt: true,
    url_for_silly_butt: '',
    one_char_input_time: 0.2
  },
  mounted() {
    let search_param = this.get_search_param();
    this.keyword = search_param['q'];
    this.search_format = search_param['f'] ? search_param['f'] : this.search_format;
    if (this.keyword) {
      this.silly_butt = true;
      let tl = this.prepare_anim(this.keyword);
      tl.play();
    } else {
      this.silly_butt = false;
      this.shown_keyword = "Not a silly butt?"
      this.url_for_silly_butt = "在上面的输入栏输入要帮那个silly butt搜索的内容，在下面的输入栏输入搜索引擎的搜索格式，然后点击按钮生成链接"
    }

  },
  methods: {
    get_search_param() {
      let query = location.search; // ?q=[question here]
      query = query.substring(1);
      let param_dict = {};
      let raw_params = query.split('&');
      for (let i = 0; i < raw_params.length; i++) {
        let tmp = raw_params[i].split('=');
        param_dict[tmp[0]] = decodeURIComponent(tmp[1]);
      }
      return param_dict;
    },
    prepare_anim(input_value) {
      const cursor_wrapper = $('#cursor-wrapper');
      const cursor = $('#cursor');
      const input = $('#key-input');
      const button = $('#search-button');
      let that = this;

      var tl = new TimelineLite();

      tl.to(cursor_wrapper, 2, {
        left: input.offset().left + input.width() / 2,
        top: input.offset().top + input.height() / 2,
        onStart: function () {
          that.set_hint("move cursor to input field")
        }
      });

      tl.to(cursor_wrapper, 0.5, {
        width: cursor_wrapper.width() * 0.7,
        height: cursor_wrapper.height() * 0.7,
        yoyo: true,
        repeat: 1,
        onStart: function () {
          that.set_hint("click and input your question")
        },
        onComplete: function () {
          that.input_sim(input_value);
        }
      });

      tl.to(cursor_wrapper, 2, {
        left: button.offset().left + button.width() / 2,
        top: button.offset().top + button.height() / 2,
        delay: that.one_char_input_time * input_value.length,
        onStart: function () {
          that.set_hint("move cursor to search button")
        },
      });

      tl.to(cursor_wrapper, 0.5, {
        width: cursor_wrapper.width() * 0.7,
        height: cursor_wrapper.height() * 0.7,
        yoyo: true,
        repeat: 1,
        onStart: function () {
          that.set_hint("click")
        },
        onComplete: function () {
          that.navigate_to_search();
        }
      });

      tl.pause();

      return tl;
    },
    async input_sim(value) {
      console.log(value);
      for (var index in value) {
        this.shown_keyword += value[index];
        await sleep(this.one_char_input_time * 1000);
      }
    },
    set_hint(value) {
      this.hint = value;
    },
    navigate_to_search(e = undefined) {
      console.log(e);
      var url = this.search_format.replace('{value}', this.keyword);
      location.href = url;
    },
    generate_url(e = undefined) {
      this.url_for_silly_butt = location.href.split('?')[0] + "?q=" + encodeURIComponent(this.shown_keyword) + "&f=" + encodeURIComponent(this.search_format);
    },
    copy_url(e = undefined) {
      console.log(e);
      console.log(e.target);
      var text = e.target.innerText;
      var input = document.getElementById("copy-helper");
      input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      alert("复制成功");
    }
  }
})