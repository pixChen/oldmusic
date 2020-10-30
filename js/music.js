onload = Fun;
function Fun(){
	var app = new Vue({
		el:'#demo',
		data:{
			name:'',
			text:[],
			music:'',
			lyric:[],
			lyricTime:[],
			lyricState:false,
			lyricStateOn:true,
			lyricThis:0,
			songs:'',
			composer:'',
			musicSrc:'',
			isShow:false,			
			playSrc:'',
			comment:[]
		},
		methods:{
			get:function(){
				if(document.querySelector('.search').value.length == 0)return false;
				console.log(document.querySelector('.search').value);
				//	接收歌名搜索参数
				axios.get('https://autumnfish.cn/search?keywords='+this.name).then(
					response => {
						this.text = response.data.result.songs;
					},err => {
						this.text = err;
					}
				);
			},Music:function(id){
				//	接收歌曲的路径参数
				axios.get('https://autumnfish.cn/song/url?id='+ id).then(
					response => {
						this.music = response.data.data[0].url;
					}, err => {
						this.music = err;
					}
				);
				//	接收该音乐的歌词内容					
				axios.get('https://autumnfish.cn/lyric?id='+ id).then(
					response => {
						let grouping = string => {
							this.lyricThis = 0;
							let inValue = string.split(/\[(.+?)\]/g),
								inTime = [],	//	歌词对应的时间
								inObject = [];	//	歌词Arr
								console.log(response.data.lrc);
							for(let a = 1;a < inValue.length;a+=2){
								let timeText = inValue[a].split(':');
							//	console.log(inValue[a],inValue[a+1])
									time = Number(timeText[0]) * 60 + Number(timeText[1]);
									inTime.push(time.toFixed(2));
									inObject.push(inValue[a+1]);
							};return [inTime,inObject];
						},inArr = grouping(response.data.lrc.lyric);
						this.lyricTime = inArr[0];
						this.lyric = inArr[1];

						//	获取歌曲此时的进度
						var audio = document.querySelector('.audio'),
							audiokey = 0;
							lyric.scrollTop = audiokey;
						audio.addEventListener('timeupdate',() => {
							let mathFun = value => {					
								for(let i = audiokey;i < inArr[0].length;i++){
									if(audio.currentTime - inArr[0][i] > 0){
										if(i !== audiokey)return i;

									};
								};
							};curText = mathFun(audio.currentTime);
							if(curText !== undefined && curText !== audiokey){
								audiokey = curText;
								console.log(curText)
								this.lyricThis = audiokey;
								lyric.addEventListener('mouseover',() => {
									this.lyricStateOn = false;
									lyric.onmouseout = () => {	this.lyricStateOn = true;	}
								},false);
								this.lyricStateOn && (lyric.scrollTop = 30 + 45 * this.lyricThis);
							};
						},false);
					}, err => {
						this.music = err;
					}
				);
				//	接收歌曲封面参数
				axios.get('https://autumnfish.cn/song/detail?ids=' + id).then(
					response => {
						this.musicSrc = response.data.songs[0].al.picUrl;
						this.songs = response.data.songs[0].name;
						this.composer = response.data.songs[0].ar[0].name;
					}, err => {
						this.musicSrc = err;
					}
				);
				//	接收歌曲评论参数
				axios.get('https://autumnfish.cn/comment/hot?type=0&id=' + id).then(
					response => {
						this.comment = response.data.hotComments;
					}, err => {
						this.comment = err;
					}
				);
			},play:function(id){
				this.isShow = !this.isShow;
				//	接收歌曲MV参数
				axios.get('https://autumnfish.cn/mv/url?id=' + id).then(
					response => {
						this.playSrc = response.data.data.url;
					}, err => {
						this.playSrc = err;
					}
				);
			},offplay:function(){
				this.isShow = !this.isShow;
				this.playSrc = '';
			},lyricFun:function(){
				this.lyricState = !this.lyricState;
				document.querySelector('#lyric').className = this.lyricState ? 'lyric' : '';
			}

		}
	})		
}