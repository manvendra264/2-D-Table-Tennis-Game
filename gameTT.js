var canvas;
	    var canvasContext;
        
        //ball coordinates
        var ballX =15;
        var ballY =15;
        //ball speed
        var ballSpeedX =10;
        var ballSpeedY =5;
        
        //paddle info
        var paddleLeftY= 250;
        var paddleRightY= 250;
        const MaxPaddleHeight =100;
        const paddleThickness =10;
        const paddlesDistFromWall =2;

        var player1Score=0;
        var player2Score=0;
        const winningScore=5; //setting limit of Points for winning 

        var displayWinScreen=false; //when game display win screen!

        function calculateMousePos(evt){
        	var rect =canvas.getBoundingClientRect();
    	    var root =document.documentElement;
    	    var mouseX =evt.clientX -rect.left -root.scrollLeft;
    	    var mouseY =evt.clientY -rect.top -root.scrollTop;
    	    
    	    return{ x:mouseX, y:mouseY };
        }
        function handleMouseClick(evt){
        	if(displayWinScreen){
        		player1Score = 0;
		        player2Score = 0;
		        displayWinScreen = false;
	        }
        }

        //how to wait for page to finish loading
        window.onload=function(){//console.log("Hello TableTennis!");
            canvas=document.getElementById('gameTTCanvas');
    	    canvasContext=canvas.getContext('2d');
    	
    	    var framePerSec=30;
    	    setInterval(function(){
    	    	movementFn();
    	        printFn();
    	    },1000/framePerSec);

    	    canvas.addEventListener('mousedown',handleMouseClick);
    	    canvas.addEventListener('mousemove',
    	    	function(evt){
    	    		var mousePos= calculateMousePos(evt);
    			    paddleLeftY= mousePos.y-(MaxPaddleHeight/2);
    		    });
        }
        
        //it reset from center of playboard if the player miss the ball
        function ballReset(){  
            if(player1Score>=winningScore || player2Score>=winningScore) displayWinScreen =true;
		    
    	    ballSpeedX=-1*ballSpeedX;
    	    ballX=canvas.width/2;
    	    ballY=canvas.height/2;
        }

        //for system/computer acting as player-2
        function systemMovement(){
    	    var centreOfPaddleRight=paddleRightY+(MaxPaddleHeight/2);
    	    if(centreOfPaddleRight < ballY-35) paddleRightY +=6;
    	    else if(centreOfPaddleRight > ballY+35) paddleRightY -=6;
    	}
        
        //for Ball movement on playboard!
        function movementFn(){
        	if(displayWinScreen) return;
	        
	        //system/computer acting as 2nd player
            systemMovement();//paddleRight Airtificial Intelligence. 

            ballX += ballSpeedX;
            ballY += ballSpeedY;

            ////working at left side of playboard!
            if(ballX <0){
         	    if(ballY>paddleLeftY && ballY< paddleLeftY +MaxPaddleHeight){
         		    ballSpeedX=-1*ballSpeedX;
         		    //angle ball after striking paddleLeft
         		    var deltaY = ballY-(paddleLeftY +MaxPaddleHeight/2);
			        ballSpeedY = deltaY * 0.35;
         	    }
         	    else{
         		    player2Score++; //score increment should be done at first before ballReset() in order to take care of "winningScore"!
         		    ballReset();
         	    }
            } 
            //working at right side of playboard!
            if( ballX >canvas.width){
         	    if(ballY>paddleRightY && ballY< paddleRightY +MaxPaddleHeight){
         		    ballSpeedX=-1*ballSpeedX;
         		    //angle ball after striking paddleRight
         		    var deltaY = ballY-(paddleRightY +MaxPaddleHeight/2);
			        ballSpeedY = deltaY * 0.35;
         	    }
         	    else{
         		    player1Score++;
         		    ballReset();
         	    }
         	}
         	//when ball strik the top an down it bounches back
            if(ballY<0 || ballY >canvas.height)ballSpeedY=-1*ballSpeedY;    
        }
        
        //display every elements of playboard!
        function printFn(){
    	    //console.log(ballX);//to check in console
    	   
    	    //playboard
    	    drawingRect(0,0,canvas.width,canvas.height,'#120F0F');
    	    
    	    //at the end of game
    	    if(displayWinScreen){
    		    drawingRect(0,0,canvas.width,canvas.height,'#ffffff');
		
		        if(player1Score >= winningScore){
			        canvasContext.fillStyle = '#003300';
			        canvasContext.fillText("YOU WON!",485,150);
		        } 
		        else if(player2Score >= winningScore) {
			        canvasContext.fillStyle = '#800000';
			        canvasContext.fillText("YOU LOST!",485,150);
		        }

		        //Scoreboard after the game ends!
		        canvasContext.fillStyle = '#000066';
		        canvasContext.fillText("Your Score : "+player1Score+" / "+winningScore, 475, 270);
			    canvasContext.fillText("Opponent Score : "+player2Score+" / "+winningScore, 465, 290);

			    //Command from person to restart the game
			    canvasContext.fillStyle = '#000000';
		        canvasContext.fillText("Click to RESTART the Game!", 450, 450);
		        return;
	        }
	    
	        //net
	        drawingNet();
    	
    	    //left paddle
    	    drawingRect(paddlesDistFromWall,paddleLeftY,paddleThickness,MaxPaddleHeight,'#FFE723');
    	
        	//right paddle
    	    drawingRect(canvas.width-(paddleThickness+paddlesDistFromWall),paddleRightY,paddleThickness,MaxPaddleHeight,'#FFE723');
    	
    	    //ball
    	    drawingBall(ballX,ballY,10,'#FFFFFF');
            
            //Track of Points gain by players.
            canvasContext.fillStyle = '#C7FA94';
    	    canvasContext.fillText("Player-1 : "+player1Score,200,50);
    	    canvasContext.fillStyle = '#C7FA94';
    	    canvasContext.fillText("Player-2 : "+player2Score,canvas.width-300,50);
    	}

        function drawingRect(xCoodinate,yCoordinate,wid,hei,iscolor){
        	canvasContext.fillStyle=iscolor;
        	canvasContext.fillRect(xCoodinate,yCoordinate,wid,hei);
        }

        function drawingBall(xCoodinate,yCoordinate,radius,iscolor){
        	canvasContext.fillStyle=iscolor;
        	canvasContext.beginPath();
    	    canvasContext.arc(xCoodinate,yCoordinate,radius,0,Math.PI*2,true);
        	canvasContext.fill();
        }

        function drawingNet(){
    	    for(var i=0;i<canvas.height;i+=40){
    		    drawingRect(canvas.width/2-1,i,2,20,'#FF4D4D');
	        }
	    }