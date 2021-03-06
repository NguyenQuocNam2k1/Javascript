const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  listIndexSong : [],
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "https://tainhac123.com/download/buoc-qua-nhau-vu.EdENCgJm9dAa.html",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "https://tainhac123.com/download/de-vuong-dinh-dung-ft-acv.w8lmuII1Yn2G.html",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "https://tainhac123.com/download/3-di-di-di-di-nsmall-remix-nsmall-ft-osad-ft-lil-shadow.saiPhk7kA4Tp.html",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://tainhac123.com/download/duong-toi-cho-em-ve-bui-truong-linh.EEZTcFO2Ajfc.html",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://tainhac123.com/download/de-vuong-dinh-dung-ft-acv.w8lmuII1Yn2G.html",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "https://tainhac123.com/download/khoc-trong-mua-trinh-thien-an.MJQE6bhJ6Bs8.html",
      image:
        "https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://tainhac123.com/download/nuoc-ngoai-phan-manh-quynh.l0rh38M1KDd1.html",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${
            index === this.currentIndex ? "active" : ""
          }" data-index="${index}">
          <div class="thumb"
              style="background-image: url('${song.image}')">
          </div>
          <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
          </div>
          <div class="option">
              <i class="fas fa-ellipsis-h"></i>
          </div>
      </div>
      `;
    });
    playlist.innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    // X??? l?? cd quay v?? d??ng khi play v?? pause
    const cdThumbAnimation = cdThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000, // 10 senconds
        interations: Infinity,
      }
    );
    cdThumbAnimation.pause();

    // X??? l?? ph??ng to ho???c thu nh??? cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // X??? l?? khi click v??o play
    playBtn.onclick = function () {
      _this.isPlaying ? audio.pause() : audio.play();
    };
    // Khi b??i h??t ???????c play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    };
    // Khi b??i h??t pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };

    // D??ng ch???y theo khi b??i h??t ???????c ph??t
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // X??? l?? khi b??i h??t ???????c tua
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next b??i h??t
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi pre b??i h??t
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //X??? l?? random b???t t???t b??i h??t
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRamdom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //X??? l?? khi n??t repeat ???????c b???t
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //X??? l?? next song khi audio ended . T???c l?? khi b??i h??t k???t th??c
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //L???ng nghe h??nh vi click v??o playlist
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");
      //X??? l?? khi click v??o list song
      if (songElement || e.target.closest(".option")) {
        // X??? l?? khi click v??o song
        if (songElement) {
          _this.currentIndex = Number(songElement.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        //X??? l?? khi click v??o song option
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    console.log(this.config);
    this.isRandom = this.config.isRamdom;
    this.isRepeat = this.config.isRepeat;
  },
  test: function () {
    console.log(this.currentSong);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex
    this.listIndexSong.push(this.currentIndex);
    let flagIndexSong 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
      for (let i = 0; i < this.listIndexSong.length; i++) {
        if (newIndex === this.listIndexSong[i]) {
          flagIndexSong = true
          break;
        }else{
          flagIndexSong = false
        }
        if(this.listIndexSong.length === this.songs.length){
          this.listIndexSong.splice(0, this.listIndexSong.length)
        }
      }
    } while (flagIndexSong);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // G???n c???u h??nh t??? config v??o ???ng d???ng
    this.loadConfig();

    // ?????nh ngh??a c??c thu???c t??nh cho object
    this.defineProperties();

    // L???ng nghe , x??? l?? c??c s??? ki???n (DOM Event)
    this.handleEvents();

    // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
    this.loadCurrentSong();

    //Render playlist
    this.render();

    // Test
    this.test();

    // Hi???n th??? tr???ng th??i ban ?????u c???a 2 n??t l?? repeat v?? random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
