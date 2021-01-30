// ==UserScript==
// @name     去好和弦聯播網觀看
// @version  1
// @grant    none
// @author   dsh0416
// @include      *://www.youtube.com/*
// @include      *://wiwi.video/*
// ==/UserScript==


function init() {
  if (window.location.pathname != "/watch") {
    // 不在播放頁面
    return;
  }
  
  const channelName = document.querySelector("a.yt-simple-endpoint.yt-formatted-string[href='/channel/UCVXstWyJeO6No3jYELxYrjg']");
  if (channelName == null) {
    // 不在好和弦頻道
    return;
  }
  
  const titleElement = document.querySelector(".title yt-formatted-string.ytd-video-primary-info-renderer");
  if (titleElement == null) {
  	// 沒有標題？
    return;
  }
  
  const title = titleElement.innerText;
  findWiwiVideo(title, 0);
}

function addWiwiVideoBtn(uuid) {
  var ele = document.createElement('div');
  ele.innerHTML = `
		<a href="https://wiwi.video/videos/watch/${uuid}">
			<div style="width: 28px; height: 28px; background-image: url(https://wiwi.video/lazy-static/avatars/b2d085dd-e5ba-4081-b160-400deac7be8c.png); background-repeat: no-repeat;background-size: contain;margin: 0 0 0 20px;border-radius: 14px;">
			</div>
		</a>`;
  document.querySelector("#top-level-buttons").appendChild(ele)
  
}

function findWiwiVideo(title, skipCount) {
  const count = 100;
  window.fetch(`https://wiwi.video/api/v1/video-channels/nicechord/videos?count=${count}&skipCount=${skipCount}`)
  	.then(function(response) {
    	return response.json();
  	})
    .then(function(data) {
    	let found = false;
    	data.data.forEach(function (videoObj) {
      	if (videoObj.name == title) {
          found = true;
          console.log("found the video on wiwivideo!");
          addWiwiVideoBtn(videoObj.uuid);
        }
      });
    	if (!found && skipCount + count < data.total) {
      	// 沒有找到，query 下一頁
        findWiwiVideo(title, skipCount + count);
      }
    });;
}


window.onload = function() {
  setTimeout(function() { init(); }, 2000); // YouTube 加載有一定延遲，timeout 2 秒
}
