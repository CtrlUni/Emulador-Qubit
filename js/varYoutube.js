// bifurcado de "Remake: reproduzir continuamente a lista de vídeos do YouTube no estilo Beautiful Songs para o trabalho" de siouxcitizen https://jsdo.it/siouxcitizen/klAB
 //
 //Eu adicionei uma função para embaralhar a ordem de reprodução do vídeo na função de reprodução de vídeo do Youtube.
 //
 //Embaralhe a ordem de reprodução dos vídeos com o botão [ShuffleMVList]
 //Restaura a ordem de reprodução de vídeo padrão com o botão [DefaultMVList]
 //
 //Utilizei meu código abaixo como referência
 //
 //versão Wonderfl
 // Reproduzir continuamente a lista de vídeos do YouTube no estilo Beautiful Songs para o trabalho
 //http://wonderfl.net/c/4yJ2
 //
 //*observação
 //Por alguma razão, o CSS não funciona corretamente, a menos que eu diminua o topo do editor HTML em um parágrafo ao salvar.

 //Reprodutor de vídeo
var player = null;
//動画プレイヤー用パラメータ
var options =
    {
        width: 352,              //下部AngularJS部分に記述された動画プレイヤーサイズ配列($scope.sizes)の先頭にあるwidthをセット
        height: 230,             //下部AngularJS部分に記述された動画プレイヤーサイズ配列($scope.sizes)の先頭にあるheightをセット
        videoId: "oofSnsGkops",  //下部AngularJS部分に記述された動画ID配列($scope.movies)の先頭にある動画IDをセット
        playerVars: {
            autoplay: 1,
            controls: 1,
            autohide: 1,
            html5: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    };

//iframe apiの読込　
//iframe apiの読込完了時に onYouTubeIframeAPIReady が呼び出されて 動画Player設定→動画再生処理開始
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//iframe apiの読込完了時に呼び出される
//Youtube Playerのパラメータ設定や、イベント処理の設定を行う
function onYouTubeIframeAPIReady() {
    
    player = new YT.Player( 'player', options );
    
}

//Youtube Playerの準備ができたら(読込完了したら？)動画再生を開始
function onPlayerReady(event) {
    //event.target.playVideo();
    player.playVideo();
}

//動画の再生が終了したら、動画IDリストから次の動画のIDを取得して再生する
function onPlayerStateChange(event) {
    
    if(event.data == YT.PlayerState.ENDED) {

        //angularJSの関数を呼び出す
        var scope = angular.element(document.getElementById("movieListCtrlID")).scope();
        
        scope.$apply(function () {
            scope.playNextMovie();
        });
  
    }          
}

angular.module('movieListApp', [])
.controller('movieListController', function ($scope) {
    //動画IDの配列参照用のインデックス   
    $scope.index = 0;
    $scope.isRepeat = false;
    $scope.size = 0; // 画面サイズ　0 ～ 3 

    //Youtubeプレイヤーのサイズとそれに対応したボタン位置設定を保持する配列
    $scope.sizes = [
        {"sizeIndex": 0, "height": 230, "width": 352, 
         "movieListLeft": "5px", "movieListTop": "250px", "sizeBtnLeft": "290px", "sizeBtnTop": "290px",
         "previousBtnLeft": "5px", "previousBtnTop": "290px", "forwardBtnLeft": "130px", "forwardBtnTop": "290px",
         "defaultMVListBtnLeft": "5px", "defaultMVListBtnTop": "330px", "shuffleMVListBtnLeft": "200px", "shuffleMVListBtnTop": "330px",
         "repeatStateSetBtnLeft": "5px", "repeatStateSetBtnTop": "370px", "repeatStateDispTxtLeft": "130px", "repeatStateDispTxtTop": "370px",
         "amazonBtnLeft": "5px", "amazonBtnTop": "410px", "twitterBtnLeft": "130px", "twitterBtnTop": "410px", "facebookBtnLeft": "245px", "facebookBtnTop": "410px"},
        
        {"sizeIndex": 1, "height": 288, "width": 512, 
         "movieListLeft": "5px", "movieListTop": "308px", "sizeBtnLeft": "290px", "sizeBtnTop": "348px",
         "previousBtnLeft": "5px", "previousBtnTop": "348px", "forwardBtnLeft": "130px", "forwardBtnTop": "348px",
         "defaultMVListBtnLeft": "5px", "defaultMVListBtnTop": "388px", "shuffleMVListBtnLeft": "200px", "shuffleMVListBtnTop": "388px",
         "repeatStateSetBtnLeft": "5px", "repeatStateSetBtnTop": "428px", "repeatStateDispTxtLeft": "130px", "repeatStateDispTxtTop": "428px",
         "amazonBtnLeft": "5px", "amazonBtnTop": "468px", "twitterBtnLeft": "130px", "twitterBtnTop": "468px", "facebookBtnLeft": "245px", "facebookBtnTop": "468px"},
        
        {"sizeIndex": 2, "height": 495, "width": 704, 
         "movieListLeft": "740px", "movieListTop": "115px", "sizeBtnLeft": "1030px", "sizeBtnTop": "155px",
         "previousBtnLeft": "740px", "previousBtnTop": "155px", "forwardBtnLeft": "870px", "forwardBtnTop": "155px",
         "defaultMVListBtnLeft": "740px", "defaultMVListBtnTop": "195px", "shuffleMVListBtnLeft": "950px", "shuffleMVListBtnTop": "195px",
         "repeatStateSetBtnLeft": "740px", "repeatStateSetBtnTop": "235px", "repeatStateDispTxtLeft": "870px", "repeatStateDispTxtTop": "235px",
         "amazonBtnLeft": "740px", "amazonBtnTop": "275px", "twitterBtnLeft": "870px", "twitterBtnTop": "275px", "facebookBtnLeft": "985px", "facebookBtnTop": "275px"},
        
        
        {"sizeIndex": 3, "height": 144, "width": 256, 
         "movieListLeft": "5px", "movieListTop": "164px", "sizeBtnLeft": "290px", "sizeBtnTop": "204px",
         "previousBtnLeft": "5px", "previousBtnTop": "204px", "forwardBtnLeft": "130px", "forwardBtnTop": "204px",
         "defaultMVListBtnLeft": "5px", "defaultMVListBtnTop": "244px", "shuffleMVListBtnLeft": "200px", "shuffleMVListBtnTop": "244px",
         "repeatStateSetBtnLeft": "5px", "repeatStateSetBtnTop": "284px", "repeatStateDispTxtLeft": "130px", "repeatStateDispTxtTop": "284px",
         "amazonBtnLeft": "5px", "amazonBtnTop": "324px", "twitterBtnLeft": "130px", "twitterBtnTop": "324px", "facebookBtnLeft": "245px", "facebookBtnTop": "324px"}
        
    ];
    
    $scope.movies = [
        {"movieIndex": 0, "movieID": "RmnPPXKDTL4", "movieTitle": "Explicação do complicado Spin quãntico"},
        {"movieIndex": 1, "movieID": "", "movieTitle": "Daniel Powter - Bad Day"},
        {"movieIndex": 2, "movieID": "", "movieTitle": "Ben Jelen - Come On"},
        {"movieIndex": 3, "movieID": "", "movieTitle": "Maroon 5 - She Will Be Loved"},
        {"movieIndex": 4, "movieID": "", "movieTitle": "Coldplay - Viva La Vida"},
        {"movieIndex": 5, "movieID": "", "movieTitle": "Fun.: We Are Young ft. Janelle Monáe"},
        {"movieIndex": 6, "movieID": "", "movieTitle": "Mêlée - Built To Last"},
        {"movieIndex": 7, "movieID": "", "movieTitle": "Bruno Mars - Just The Way You Are"}
    ];

    $scope.defaultMovies = [
        {"movieIndex": 0, "movieID": "RmnPPXKDTL4", "movieTitle": "Explicação do complicado Spin quãntico"},
        {"movieIndex": 1, "movieID": "", "movieTitle": "Daniel Powter - Bad Day"},
        {"movieIndex": 2, "movieID": "", "movieTitle": "Ben Jelen - Come On"},
        {"movieIndex": 3, "movieID": "", "movieTitle": "Maroon 5 - She Will Be Loved"},
        {"movieIndex": 4, "movieID": "", "movieTitle": "Coldplay - Viva La Vida"},
        {"movieIndex": 5, "movieID": "", "movieTitle": "Fun.: We Are Young ft. Janelle Monáe"},
        {"movieIndex": 6, "movieID": "", "movieTitle": "Mêlée - Built To Last"},
        {"movieIndex": 7, "movieID": "", "movieTitle": "Bruno Mars - Just The Way You Are"}
    ];

    $scope.tempMovies = [
    ];
    $scope.destMovies = [
    ];
   
    $scope.movie = $scope.movies[0];

    $scope.onSelectChange = function() {
        player.loadVideoById($scope.movie.movieID);
        $scope.index = $scope.movie.movieIndex;
        
    };

    $scope.previous = function() {
        if ($scope.index - 1 >= 0) {
            //1つ前の動画インデックスに戻す
            $scope.index = $scope.index - 1; 
            //戻したインデックスをもとに動画リストから動画再生
            player.loadVideoById($scope.movies[$scope.index].movieID);
            //戻したインデックスを動画セレクトボックスにも反映
            $scope.movie = $scope.movies[$scope.index];
        //Repeat設定がONの場合は、最初の動画のインデックスから最後の動画のインデックスへ変更してから同じ処理    
        } else if ( ($scope.index - 1) < 0 && $scope.isRepeat) { 
            $scope.index = $scope.movies.length - 1;
            player.loadVideoById($scope.movies[$scope.index].movieID);
            $scope.movie = $scope.movies[$scope.index];
        }
    };
    
    $scope.forward = function() {
        if ($scope.index + 1 < $scope.movies.length) {
            //1つ後の動画インデックスに進める
            $scope.index = $scope.index + 1;
            //進めたインデックスをもとに動画リストから動画再生
            player.loadVideoById($scope.movies[$scope.index].movieID);
            //進めたインデックスを動画セレクトボックスにも反映
            $scope.movie = $scope.movies[$scope.index];
        //Repeat設定がONの場合は、最後の動画のインデックスから最初の動画のインデックスへ変更してから同じ処理        
        } else if ( ( $scope.index + 1 ) == $scope.movies.length && $scope.isRepeat) {
            $scope.index =  0;
            player.loadVideoById($scope.movies[$scope.index].movieID);
            $scope.movie = $scope.movies[$scope.index];
        }
    };

    //再生動画リストをデフォルトのものに設定
    $scope.defaultMVList = function() {
        
        //デフォルトの再生動画リストをセットし、
        //その他項目を初期化してリスト先頭の動画から再生しなおす        
        $scope.movies = $scope.defaultMovies.slice();
        $scope.index = 0;
        $scope.movie = $scope.movies[0];
        player.loadVideoById($scope.movies[$scope.index].movieID)
        
    };
    
    //再生動画リストをシャッフル
    $scope.shuffleMVList = function() {
        
        $scope.tempMovies = $scope.movies.slice();
        $scope.destMovies = [];
        var destIndex = 0;
        
        while($scope.tempMovies.length > 0) {

            var tempIndex = Math.floor(Math.random() * $scope.tempMovies.length);
            
            //alert(tempIndex);
            //alert($scope.tempMovies[tempIndex].movieIndex);
            
            $scope.tempMovies[tempIndex].movieIndex = destIndex;
            
            $scope.destMovies.push($scope.tempMovies[tempIndex]); 
            $scope.tempMovies.splice(tempIndex, 1);
            
            destIndex = destIndex + 1;
        }
        
        //シャフルされた再生動画リストをセットし、
        //その他項目を初期化してリスト先頭の動画から再生しなおす
        $scope.movies = $scope.destMovies;
        $scope.index = 0;
        $scope.movie = $scope.movies[0];
        player.loadVideoById($scope.movies[$scope.index].movieID)
        
    };
    
    //REPEAT設定のON・OFFを行う　REPEAT設定は画面のテキストボックスに反映される
    $scope.setRepeatState = function() {
        if($scope.isRepeat) {
            //isRepeat = false;
            $scope.isRepeat = false;
            document.txtForm.repeatState.value = "REPEAT OFF";
        } else {
            //isRepeat = true;
            $scope.isRepeat = true;
            document.txtForm.repeatState.value = "REPEAT ON";
        }
    };

    //REPEAT設定のON・OFFを行う　REPEAT設定は画面のテキストボックスに反映される
    $scope.playNextMovie = function() {

        //動画IDリストの最後のIDになるまで動画を再生する
        if ( ($scope.index + 1) < $scope.movies.length) {

            //動画IDリストのインデックスを進める
            $scope.index = $scope.index + 1;

            //画面のSELECTリストに反映させる
            $scope.movie = $scope.movies[$scope.index];

            //動画IDリストより動画IDを指定して動画再生
            player.loadVideoById($scope.movies[$scope.index].movieID);

        //REPEAT ON の場合に動画IDリスト最後の動画が終了した場合は
        //動画IDリストの最初のIDに戻って動画を再生する    
        } else if ( ($scope.index + 1) ==$scope.movies.length && $scope.isRepeat) {

            $scope.index = 0;

            //画面のSELECTリストに反映させる;
            $scope.movie = $scope.movies[$scope.index];

            //動画IDリストより動画IDを指定して動画再生
            player.loadVideoById($scope.movies[$scope.index].movieID);

        } 

    };


    //YoutubePlayerのサイズを変更する
    $scope.changePlayerSize = function() {

        $scope.size = $scope.size + 1;
        //サイズ保持配列からYoutubePlayerのサイズを取得して変更する
        if ($scope.size < $scope.sizes.length) {
            player.setSize($scope.sizes[$scope.size].width, $scope.sizes[$scope.size].height);
            

            
        } else {
            $scope.size = 0;
            player.setSize($scope.sizes[$scope.size].width, $scope.sizes[$scope.size].height);
            
        }
        //ボタンの座標を設定
	    var element = document.getElementById("movieList"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].movieListLeft; 
	    element.style.top  = $scope.sizes[$scope.size].movieListTop; 
	                
	    element = document.getElementById("sizeBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].sizeBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].sizeBtnTop; 
	    
	    element = document.getElementById("previousBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].previousBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].previousBtnTop;
	    
	    element = document.getElementById("forwardBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].forwardBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].forwardBtnTop;

	    element = document.getElementById("defaultMVListBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].defaultMVListBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].defaultMVListBtnTop;
	    
	    element = document.getElementById("shuffleMVListBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].shuffleMVListBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].shuffleMVListBtnTop;
	    
	    element = document.getElementById("repeatStateSetBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].repeatStateSetBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].repeatStateSetBtnTop;
	    
	    element = document.getElementById("repeatStateDispTxt"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].repeatStateDispTxtLeft; 
	    element.style.top  = $scope.sizes[$scope.size].repeatStateDispTxtTop;

	    element = document.getElementById("amazonBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].amazonBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].amazonBtnTop;
	    
	    element = document.getElementById("twitterBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].twitterBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].twitterBtnTop;

	    element = document.getElementById("facebookBtn"); 
	    //element.style.position = 'absolute'; 
	    element.style.left = $scope.sizes[$scope.size].facebookBtnLeft; 
	    element.style.top  = $scope.sizes[$scope.size].facebookBtnTop;

    };
    
});
