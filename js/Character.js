// 생성자
function Character(info) { // info는 객체를 받아옴
    this.mainElem = document.createElement('div');
    this.mainElem.classList.add('character');
    this.mainElem.innerHTML = ''
        + '<div class="character-face-con character-head">'
            + '<div class="character-face character-head-face face-front"></div>'
            + '<div class="character-face character-head-face face-back"></div>'
        + '</div>'
        + '<div class="character-face-con character-torso">'
            + '<div class="character-face character-torso-face face-front"></div>'
            + '<div class="character-face character-torso-face face-back"></div>'
        + '</div>'
        + '<div class="character-face-con character-arm character-arm-right">'
            + '<div class="character-face character-arm-face face-front"></div>'
            + '<div class="character-face character-arm-face face-back"></div>'
        + '</div>'
        + '<div class="character-face-con character-arm character-arm-left">'
            + '<div class="character-face character-arm-face face-front"></div>'
            + '<div class="character-face character-arm-face face-back"></div>'
        + '</div>'
        + '<div class="character-face-con character-leg character-leg-right">'
            + '<div class="character-face character-leg-face face-front"></div>'
            + '<div class="character-face character-leg-face face-back"></div>'
        + '</div>'
        + '<div class="character-face-con character-leg character-leg-left">'
            + '<div class="character-face character-leg-face face-front"></div>'
            + '<div class="character-face character-legface face-back"></div>'
        + '</div>';

    document.querySelector('.stage').appendChild(this.mainElem);

    // 케릭터 위치 css style 속성으로 정해주기
    this.mainElem.style.left = info.xPos + '%';

    // 스크롤 중인지 아닌지 (true / false)
    this.scrollState = false;

    // 바로 이전(마지막) 스크롤 위치, 마지막 스크롤 위치를 비교해 케릭터 방향 설정
    this.lastScrollTop = 0;

    // 사용하기 편하도록 옮겨담음 / xPos는 캐릭터 생성 위치
    this.xPos = info.xPos;

    this.speed = info.speed;

    // 좌우 방향 담을 변수
    this.direction;

    // run 함수 (questAnimationFrame) 중복 실행 방지 위한 변수
    this.runningState = false;

    // raf(requestAnimationFrame)
    this.rafId;

    this.init();
}


// prototype에 객체의 공통 요소를 담을 수 있다
/* 
Prototype객체를 빈 객체로 다시 재정의 해주는 거라서 
constructer 재설정이 필요하다

Character.prototype.init = function() {};
이런 식으로 사용하면 Prototype객체를 그대로 사용하므로 재정의 필요 X
*/
Character.prototype = {
    constructer: Character,
    init: function() {
        // self == character의 객체를 담아준다
        const self = this;

        window.addEventListener('scroll', function() {
            // setTimeout의 반환값을 매개변수로 하여 setTimeout을 취소시키는 함수
            clearTimeout(self.scrollState);

            if (!self.scrollState) {
                // 비효율적으로 계속 클래스 추가 하면 안되니까
                // 한번만 실행 되게끔
                self.mainElem.classList.add('running');
                // console.log('running 클래스 붙었음');
            }
            /* 0.5초 후에 함수 실행, 
            0.5초 후에 scrollState = false */
            self.scrollState = setTimeout(function() {
                // scroll 되는 동안에는 clearTimeout 때문에 실행 될 일 없도록 해줌
                // 스크롤이 멈추면 0.5초 후에 실행
                self.scrollState = false;
                self.mainElem.classList.remove('running');
            }, 500);
            // console.log(self.scrollState);
            /* 현재 스크롤 상태를 나타내는 scrollState의 기본값은 false이다. 스크롤 이벤트가 실행되면 clearTimeout이 먼저 작동한다. clearTimeout은 setTimeout의 반환값을 매개변수로 하여 setTimeout을 취소시키는 함수이다. 지금은 setTimeout이 실행되지 않았으니 건너뛰고 다음 if문으로 가자. "!(self.scrollState=false)= true", 즉 if(true){} 이므로 if문이 실행된다. running 클래스가 붙어 이제 애니메이션이 작동된다. 다음으로 setTimeout 함수로 가보자. setTimeout은 항상 숫자를 리턴하기 때문에 scrollState는 값을 가지게 되어 true가 된다. setTimeout 안의 내용들은 0.5초 후에 실행되는데 실행되기도 전에 스크롤 이벤트 갱신과 함께 clearTimeout으로 인해 실행되지 못한다. 이제 if문으로 넘어가는데 scrollState가 true이므로 if(!true), 즉, if(false)가 되어 if 문이 실행되지 않는다. 그리고 setTimeout으로 넘어가면 마찬가지로 리턴값을 받아 여전히 true이고, settimeout은 실행되지 않는다. 이렇게 반복되다가 마지막 스크롤일 때 setTimeout이 드디어 실행된다. 왜냐하면 더 이상 스크롤 이벤트가 일어나지 않아 clearTimeout이 동작하지 않기 때문이다. 비로소 scrollstate는 false가 되고 running 클래스는 제거된다. */
            
            // 이전 스크롤 위치와 현재 스크롤 위치 비교
            if (self.lastScrollTop > pageYOffset) { 
                // 이전 스크롤의 위치가 크다면 : 스크롤 올림
                self.mainElem.setAttribute('data-direction', 'backward');
                /* .setAttribute()는 선택한 요소(element)의 속성(attribute) 값을 정합니다.
                   element.setAttribute( 'attributename', 'attributevalue' ); 
                   attributename에는 속성 이름을 넣습니다.
                   attributevalue에는 속성값을 넣습니다.*/
            }
            else {
                // 이전 스크롤의 위치가 작다면 : 스크롤 내림 
                self.mainElem.setAttribute('data-direction', 'forward');
            }

            self.lastScrollTop = pageYOffset;
        });

        /* 1. 함수의 매개변수로 전달해서 this를 살리는 방법 */

        // 키 눌렀을 때
        window.addEventListener('keydown', function(e) {

            // runningState == true 이면 실행 x -> run 함수 반복호출 막아줌
            if (self.runningState) return;

            if (e.keyCode == 37) { // 왼쪽
                self.direction = 'left';
                self.mainElem.setAttribute('data-direction', 'left');
                self.mainElem.classList.add('running');
                self.run(self);
                // self.run();
                self.runningState = true;
            }
            else if(e.keyCode == 39) { // 오른쪽
                self.direction = 'right';
                self.mainElem.setAttribute('data-direction', 'right');
                self.mainElem.classList.add('running');
                self.run(self);
                // self.run();
                self.runningState = true;
            }
        });
        // 키 땠을 때
        window.addEventListener('keyup', function(e) {
            self.mainElem.classList.remove('running');
            cancelAnimationFrame(self.rafID);
            // runningState 재 초기화(키 다시 눌렀을 때 정상 작동 하도록)
            self.runningState = false;
        });   
    },
    run: function (self) {

        if (self.direction == 'left' && self.xPos > 3) {
            self.xPos -= self.speed;
        }
        else if (self.direction == 'right' && self.xPos < 85) {
            self.xPos += self.speed;
        }
        self.mainElem.style.left = self.xPos +'%';

        self.rafID = requestAnimationFrame(function() {
            self.run(self);
        });
    }
    
    /* 2. bind 메서드로 this를 직접 지정하기 */
    // bind() == 호출 방법과 관계없이 특정 this 값으로 호출되는 함수를 만드는 것

    /* run: function () {
        const self = this;

        if (self.direction == 'left') {
            self.xPos -= self.speed;
        }
        else if (self.direction == 'right') {
            self.xPos += self.speed;
        }
        self.mainElem.style.left = self.xPos +'%';

        requestAnimationFrame(run.bind(self));
    }  */
    
};

// bind() == 호출 방법과 관계없이 특정 this 값으로 호출되는 함수를 만드는 것