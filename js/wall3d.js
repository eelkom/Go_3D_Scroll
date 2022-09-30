(function() {

    const stageElem = document.querySelector('.stage');
    const houseElem = document.querySelector('.house');
    const barElem = document.querySelector('.progress-bar');
    const selectCharacterElem = document.querySelector('.select-character');
    
    const mousePos = { x: 0, y: 0 }; // 객체생성

    let maxScrollValue = 0;


    /* 창 size 바뀌면 resizeHandler() 실행 */ 
    function resizeHandler() {
        // maxScrollValue == 스크롤 가능한 범위
        maxScrollValue = document.body.offsetHeight - window.innerHeight;
    }

    window.addEventListener('scroll', function() {
        const scrollPer = pageYOffset / maxScrollValue;
        /*  pageYOffset / maxScrollValue 가 1이 되는 순간 스크롤 다 내린거,
         0~1 -> 0~1000(더 이해하기 쉽도록), 
         (1000-20) 하는 이유 : 마지막에 3d 효과 위해서,
         -490하는 이유 : house의 css 속성 default == transform: translateZ(-490vw); 이기 때문
         */
        const zMove = scrollPer * (1000-20) - 490; 
        /* 스크롤 할 때 마다 Z 축으로 이동 */     
        houseElem.style.transform = 'translateZ(' + zMove + 'vw)';

        //progress bar
        /*  100 * 해서 %로 변환 */
        barElem.style.width = (scrollPer * 100) + '%';
    });

    window.addEventListener('mousemove', function(e) {
        /* 마우스의 위치 값을 px로 나타낸것 */
        // console.log(e.clientX, e.clientY);

        /* 화면 정가운데 0점 맞춰주는 식 */
        mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
        mousePos.y = 1 - (e.clientY / window.innerHeight) * 2;

        /* rotateX == X축을 기준으로 회전해야 하기 때문에 mousePos.y 값을 줘야하고
           rotateY == Y축을 기준으로 회전해야 하기 때문에 mousePos.x 값을 줘야한다
           가시적인 값을 얻기 위해 * 5  */
        stageElem.style.transform = 'rotateX(' + (mousePos.y * 5) + 'deg) rotateY(' + (mousePos.x * 5) + 'deg)';
    });

    window.addEventListener('resize', resizeHandler);

    stageElem.addEventListener('click', function(e) {
        // console.log(e.clientX / window.innerWidth * 100);

        // 파라미터로 객체 삽입
        new Character({
            // 클릭 된 위치의 % 값
            xPos: e.clientX / window.innerWidth * 100,
            // 0.2보다 느리지 않도록 minimum 값 세팅
            speed: Math.random() * 0.5 + 0.2
        });
    });

    selectCharacterElem.addEventListener('click', function(e) {
        const value = e.target.getAttribute('data-char');
        document.body.setAttribute('data-char', value); 
    });

    /* 초기값 받아오기 */ 
    resizeHandler();

})();
