// Select Elements 
let countspan = document.querySelector(".count span")   // de span aly feha 3dad alas2la bt3ty 
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set Options 
let currentIndex = 0   // da awl index na hbd2 mno fe alas2la lma also2l ykhls w aro7 3la aly b3do hkhly index yzed 1 , hdeha ll func addQues
let rightAnswers = 0   // hkhly rightAnswer ybtdy be 0 w hzwdo 1 kol migaweb so2l sah
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest()
    myRequest.onreadystatechange  = function() {
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText)
            let questionCount = questionObject.length

            //(1) Create Bullets + Set Questions Count
            createBullets(questionCount)              // htakhod 3dad alas2la w tdefo fe innerHtml bta3 countSpan

            //(2) Add Question Data    ==> de ahm function aly btgeb Data gwa page , func ht2bl mny 7gten : 1- Quesobj bs mesh kolo awl 3onsor bs
            addQuestionData(questionObject[currentIndex], questionCount)  // 2- QuesCount lehh? 3shan da h3tmd 3leh any hnshe2 3naser 3la ad 3dad alas2la bzbt 

            // h3ml fucntion btshof answer aly akhtrto sah wla la bs tb3n lma ados 3la zorar submit de fkrtha 

             // Start CountDown
            countdown(3, questionCount);

            //(3) click On Submit
            submitButton.onclick = () =>  {
                // Get the Right Answer
                let theRightAnswer = questionObject[currentIndex].right_answer

                // increase Index
                currentIndex++      // hkhleha tzwd wa7d 3shan awl midos submit ydkhol 3la also2l algded

                //Check The Answer
                checkAnswer(theRightAnswer, questionCount)  // ht2bl mny al2gaba alslema w 3dad alas2la 3shan mt3mlsh ay Error lma alas2la tkhls

                // Remove Previous Question 
                quizArea.innerHTML = "";
                answersArea.innerHTML = "" ; // hkhly page fadya awl midos 3la submit 3shan b3dha ydkhol 3la also2l aly b3do
            
                // Add Next Question
                addQuestionData(questionObject[currentIndex], questionCount)  // kda awl mdos submit hishel QuestionData al2dema w yzwd index wa7d b3dha hidkhol 3la function de tany w y7ot index algded bta3 also2l algded

                // Handle Bullets Class
                handleBullets();

                // Start CountDown
                clearInterval(countdownInterval);
                countdown(3, questionCount);

                // Show Results
                showResults(questionCount);
            }
        }
    }
    myRequest.open("GET", "Html_question.json", true)
    myRequest.send()
}

getQuestions()

function createBullets(num){    // h3ml 3dad bullet ad 3dad alas2la  , ht2bl mny num alhwa 3dad as2la w tdefo fe countspan
    countspan.innerHTML = num

    // Create Spans
    for(let i = 0; i < num; i++){
        let theBullet = document.createElement("span")

        // Check If Its First Span
        if(i === 0){
            theBullet.className = 'on'      // also2l aly hkon 3leh hikhod className 'on' 3shan yb2a zahr fe albullet ana fe any so2l
        }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet)     // 3mlt forLoop 3la 3dad alas2la 3shan a3ml 3dad bullet zyha
    }
}

function addQuestionData(obj,count){
    if(currentIndex < count){       // hkhly index dymn a2l mn 3dad al2s2la 3shan awl miwsl ll akher w ykhosh 3la alb3do midesh error
    
    // create H2 Question Title
    let questionTitle = document.createElement("h2")

    // Create Question Text
    let questionText = document.createTextNode(obj["title"])   // OR (obj.title) => DotNotation

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle)

    // Create The Answers
    for (let i =1; i <=4; i++){
        // Create Main Answer Div
        let mainDiv = document.createElement("div")

        // Add Class To Main Div
        mainDiv.className="answer"

        // Create Radio Input
        let radioInput = document.createElement("input")    // akhtrt eny a3ml Input bs w b7dad Type bta3o zy mna 3aiz 

        // Add Type + Name + Id + Data-Attribute
        radioInput.name = "question"                        // Name : 3shan yb2a kolhm mortbten bb3d
        radioInput.type = "radio"                           // Type : 3shan a7ded eno radio 
        radioInput.id = `answer_${i}`                       //  ID  : 3shan lma ados 3la label a2der akhtro
        radioInput.dataset.answer = obj[ `answer_${i}` ]    // Data-Attribute : 3shan a3tmd 3la al2gaba aly mogoda feha w akrnha be Right Answer

        // Make First Option Selected
        if (i === 1) {                  // 3mltha 1 ktbha fe for 1 
            radioInput.checked = true;
        }
        // Create Label 
        let theLabel = document.createElement("label")

        // Add For Attribute
        theLabel.htmlFor = `answer_${i}`

        // create Label Text
        let thelabelText = document.createTextNode(obj[ `answer_${i}` ])

        // Add text to label 
        theLabel.appendChild(thelabelText)

        // Add Input + Label to Answer DIV
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)

         // Append All Divs To Answers Area
        answersArea.appendChild(mainDiv);
    }  
}
}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName("question")
    let theChoosenAnswer

    for(let i = 0 ; i < answers.length; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer
        }
    }

    if(rAnswer === theChoosenAnswer){
        rightAnswers++
    }
}

function handleBullets(){
    let bulletSpans = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletSpans)
    arrayOfSpans.forEach((span,index) => {          // loop 3la kol span 3ndy w index 3shan h7otlo className y3rfo hwa wa2ef 3la any index bzbt

        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
        theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
        theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
        theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;    
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";

    }
}

function countdown (duration , count) {
    if (currentIndex < count ){
        let minutes , seconds
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60) 
            seconds = parseInt(duration % 60) 

            minutes = minutes < 10 ? `0 ${minutes}`: minutes
            seconds = seconds < 10 ? `0 ${seconds}`: seconds

            countdownElement.innerHTML= `${minutes} : ${seconds} `

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000)
    }
}



