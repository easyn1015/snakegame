'use strict';
//========================================================================================================================================
// @brief 우주를 테마로 한 스네이크 게임
// @details 
//  1. 스네이크게임의 틀은 같고 우주를 테마로 하였다. 
//  2. html, css, Javascript만을 사용하여 구현하였다.
// @author : 이지연
// @date : 2022-06-19
// @version : 0.1
//========================================================================================================================================
var App = new Object();
//——————————-——————————-——————————-——————————-
// 모듈화 사용을 위한 객체 생성
//——————————-——————————-——————————-——————————-
document.addEventListener("DOMContentLoaded", function (event) {
    App.snakeGame.init();

});

App.snakeGame = function () {
    var self;
    var mapHeight, mapWidth, blockSize;
    var snake, snakeHead, foods;
    var gameMap, scoreText, playButton, messageBox, disabledButton, btnUp, btnDown, btnLeft, btnRight;
    var colMove, rowMove;
    var sankeDirection, directions, snakeDead, snakeEating, playGame, gameOver, gameLoop, speed, gameScore;
    var bgSound;
    return {
        /*
            @brief: 게임 초기 세팅
            @return: 맵, 뱀, 사과 크기
        */
        init: function () {
            self = this;
            //——————————-——————————-——————————-——————————-
            // 맵 생성 (PC, Mobile) - 맵 넓이 / 블록 크기
            //——————————-——————————-——————————-——————————-

            // PC
            mapHeight = 17;
            mapWidth = 17; // = 510 / 30
            blockSize = 30;

            /* Mobile */
            mobileSetting()

            /* window resize 시 변수 변경 */
            window.addEventListener('resize', function () {
                mobileSetting()
                console.log('sdfdsf')
            });

            /* Mobile 분기점(1024, 480)에 맞춰 맵, 뱀, 사과 크기 변경 */
            function mobileSetting() {
                if (window.innerWidth <= 1024) {
                    mapHeight = 24;
                    mapWidth = 24; // = 480 / 20
                    blockSize = 20;
                }
                if (window.innerWidth <= 480) {
                    mapHeight = 16;
                    mapWidth = 16; // = 320 / 20
                    blockSize = 20;
                }
            }
            // 게임 세팅
            self.settingGame();
        },
        /*
            @brief: 뱀 방향 키 조종
            @return: 뱀 변경된 위치
        */
        settingGame: function () {
            // 뱀 방향 설정
            directions = {
                up: 0,
                right: 1,
                down: 2,
                left: 3
            }

            // 뱀 이동 설정
            colMove = [0, 1, 0, -1];
            rowMove = [-1, 0, 1, 0];

            // 기본 옵션 셋팅
            sankeDirection = directions["down"]; // 뱀 기본 이동 방향
            snakeDead = false; // 뱀 사망
            snakeEating = false; // 뱀 식사
            playGame = false; // 게임 진행 여부
            gameOver = false; // 게임 오버 여부
            gameLoop; // 게임 실행 과정
            speed = 140; // 뱀 속도 설정
            gameScore = 0; // 점수 초기값

            // 선택자
            gameMap = document.getElementById("snake-map"); // 게임 지도 영역
            scoreText = document.getElementById("score"); // 점수판 영역
            playButton = document.getElementById("do-play"); // 게임 실행 버튼
            messageBox = document.getElementById("sub-option"); // 게임 오버 메세지 영역
            btnUp = document.getElementById("btn-up"); // 방향키 위
            btnDown = document.getElementById("btn-down"); // 방향키 아래
            btnLeft = document.getElementById("btn-left"); // 방향키 왼쪽
            btnRight = document.getElementById("btn-right"); // 방향키 오른쪽

            /* PC (방향키로 조종) */
            document.onkeydown = moveSnake;

            /* Mobile (터치로 조종) */
            moveSnakeMobile();
            self.disabledButton(true);
            /*
                @brief: 뱀 이동 (PC)
                @return: 방향키 사용으로 변경된 뱀 이동 방향 값 리턴 
                @param: e
            */
            function moveSnake(e) {
                e = e || window.event;

                if (e.keyCode == '38') {
                    // up arrow
                    sankeDirection = directions["up"];
                } else if (e.keyCode == '40') {
                    // down arrow
                    sankeDirection = directions["down"];
                } else if (e.keyCode == '37') {
                    // left arrow
                    sankeDirection = directions["left"];
                } else if (e.keyCode == '39') {
                    // right arrow
                    sankeDirection = directions["right"];
                }
            }
            /*
                @brief: 뱀 이동 (Mobile)
                @return: 터치 사용으로 변경된 뱀 이동 방향 값 리턴 
                @param: event
            */
            function moveSnakeMobile(event) {
                btnUp.addEventListener('click', function (event) {
                    // up arrow
                    sankeDirection = directions["up"];
                });
                btnDown.addEventListener('click', function (event) {
                    // down arrow
                    sankeDirection = directions["down"];
                });
                btnLeft.addEventListener('click', function (event) {
                    // left arrow
                    sankeDirection = directions["left"];
                });
                btnRight.addEventListener('click', function (event) {
                    // right arrow
                    sankeDirection = directions["right"];
                });
            }

            // 뱀 배열 생성
            snake = [];

            // 뱀 초기 위치 지정
            snakeHead = new self.SnakePiece(2, 3);

            // 사과 배열 생성
            foods = [];

            // 사과 초기 위치 지정 (랜덤 생성)
            foods.push(new self.FoodPiece());

            // 뱀에 머리 추가 
            snake.push(snakeHead);

            /* 게임 시작 */
            self.startGame()

        },
        /*
            @breif: 게임 시작 전 버튼 비활성화
            @return: 게임 시작 전에 버튼 비활성 - true / 활성 - false
        */
        disabledButton: function (param) {
            if (param === true) {
                btnUp.disabled = true;
                btnDown.disabled = true;
                btnLeft.disabled = true;
                btnRight.disabled = true;
            } else {
                btnUp.disabled = false;
                btnDown.disabled = false;
                btnLeft.disabled = false;
                btnRight.disabled = false;
            }
        },
        /*
            @breif: 게임 시작 버튼 클릭하여 게임 실행하는 함수
            @return: 버튼 클릭하면 게임 시작 상태 확인 - 게임 멈춰 있음(true)/ 게임 진행중(false)
        */
        startGame: function () {
            playButton.addEventListener('click', function () {
                self.disabledButton(false);
                self.startSound();
                playGame = !playGame;
                if (playGame) {
                    self.play();
                } else {
                    clearInterval(gameLoop);
                }
                playButton.disabled = true;
            })

        },
        /*
            @breif: 뱀이 죽었는지 검사하는 함수, play() 함수에서 사용
            @return: 벽에 부딪혔을때, 자기 몸에 부딛혔을 때 (true)/ 충돌 없을 때 (false)
        */
        isDying: function () {
            // 벽에 부딪혔을 때
            var head = snake[0];
            if (head.row < 0 || head.row >= mapHeight || head.col < 0 || head.col >= mapWidth) {
                return true;
            }
            // 자기 몸에 부딪혔을 때
            var i;
            for (i = 1; i < snake.length; i++) {
                var curPiece = snake[i];
                if (head.row === curPiece.row && head.col === curPiece.col) { // 머리의 위치와 몸의 위치가 만날 때
                    return true;
                }
            }
        },
        /*
            @breif: 사과 먹었는지 검사하는 함수, play() 함수에서 사용
            @return: 먹었을 때 (true) / 안먹었을 때 (false)
        */
        isEating: function () {
            var head = snake[0];
            var i;
            for (i = 0; i < foods.length; i++) {
                var curPiece = foods[i];
                if (head.row === curPiece.row && head.col === curPiece.col) { // 사과의 위치와 몸의 위치가 만날 때
                    foods.splice(i, 1); // 배열 변경을 시작할 인덱스 i, 배열에서 제거할 요소의 수 1 - 사과의 배열에서 제거
                    gameMap.removeChild(curPiece.el); // apple을 제거
                    return true;

                }
            }
            return false;
        },
        /*
            @breif: 사과 먹었는지 검사하는 함수, startGame() 함수에서 사용
            @return: 먹었을 때 (true) / 안먹었을 때 (false)
        */
        play: function () {
            gameLoop = setInterval(function () {

                // 뱀 이동
                snake.unshift(new self.SnakePiece(snake[0].row + rowMove[sankeDirection], snake[
                    0].col + colMove[sankeDirection]));

                // 사과를 먹었을 때 꼬리 안지움
                snakeEating = self.isEating();

                // 사과 먹었을때 점수 증가
                if (snakeEating) {
                    gameScore = gameScore + 10;
                    self.eatingSound();
                }

                // 사과 먹지 않았을때는 꼬리를 하나씩 지움
                if (!snakeEating) {
                    gameMap.removeChild(snake.pop().el);
                }

                // 뱀이 죽었을 때 
                snakeDead = self.isDying();
                if (snakeDead) {
                    playGame = false;
                    self.handleDeath();
                }

                // 뱀이 죽지 않았을 때 실행 
                snakeEating = false;
                snakeDead = false;

                // 현재 점수 추가
                scoreText.innerText = "🔥 현재 점수 🔥: " + gameScore;

                // 사과 다먹으면 다시 생성
                if (foods.length < 1) {
                    foods.push(new self.FoodPiece());
                }
            }, speed);
        },
        /*
            @breif: 뱀이 죽었을 때 실행, play() 함수에서 사용
            @return: 게임 멈춤, 게임 오버 메세지, 뱀 삭제, 게임 리스폰, 게임 초기화
        */
        handleDeath: function () {

            // 게임 멈추기 
            clearInterval(gameLoop);

            // 게임 오버 메세지
            gameOver = true;
            messageBox.classList.add('on')

            // 뱀 지우기
            while (snake[0]) {
                gameMap.removeChild(snake.pop().el);
            }
            self.gameOverSound();
            // 게임 리스폰
            setTimeout(function () {
                // 게임 텍스트, 게임 점수 초기화
                scoreText.innerText = "🛸 재미있는 우주게임 👽 ";
                playButton.innerText = "게임 시작!";
                messageBox.classList.remove('on');
                gameScore = 0

                // 게임 초기화
                playButton.disabled = false;
                self.disabledButton(true);
                snakeHead = new self.SnakePiece(1, 1);
                snake.push(snakeHead);
                gameOver = false;
                sankeDirection = directions["down"]; // 뱀 기본 이동 방향

            }, 1500);
        },
        /*
            @breif: 먹는 효과음
            @return: 먹는 소리
        */
        eatingSound: function () {
            var snd = new Audio("../sound/eating05.mp3");
            snd.play();
        },
        /*
            @breif: 시작 효과음
            @return: 시작 소리
        */
        startSound: function () {
            var startSnd = new Audio("../sound/start-game.mp3");
            startSnd.play();

            bgSound = new Audio("../sound/bg.mp3");
            bgSound.loop = true;
            bgSound.play();
        },
        /*
            @breif: 게임 오버 효과음
            @return: 게임 오버 소리
        */
        gameOverSound: function () {
            var gameOversnd = new Audio("../sound/gameover03.mp3");
            gameOversnd.play();
            bgSound.pause();
        },
        /*
            @breif: 사과 생성
            @return: 사과 top, left 값
        */
        /*
            @breif: 뱀 생성
            @return: 뱀 top, left 값
            @param: row, col
        */
        SnakePiece: function (row, col) {
            /* 스네이크 생성 */
            var snakeBody = document.createElement("div");
            snakeBody.className = "snake";
            snakeBody.style.top = (row * blockSize) + "px";
            snakeBody.style.left = (col * blockSize) + "px";

            gameMap.appendChild(snakeBody);

            this.col = col;
            this.row = row;
            this.el = snakeBody;
        },
        FoodPiece: function () {
            var col = self.getRandomNum(0, mapWidth);
            var row = self.getRandomNum(0, mapHeight);
            var apple = document.createElement("div");
            apple.className = "food";

            // 머리의 위치와 몸의 위치가 만날 때
            for (var i = 1; i < snakeBody.length; i++) {
                var curPiece = snake[i];
                console.log(curPiece)
                if (row === curPiece.row && col === curPiece.col) {
                    self.FoodPiece();
                    return;
                }
            }


            apple.style.top = (row * blockSize) + "px";
            apple.style.left = (col * blockSize) + "px";

            gameMap.appendChild(apple);

            this.col = col;
            this.row = row;
            this.el = apple;
        },

        /*
            @breif: 사과 위치를 랜덤으로 생성
            @return: 난수 생성
            @param: min, max
        */
        getRandomNum: function (min, max) {
            return Math.floor(Math.random() * (max - min));
        }
    }
}();