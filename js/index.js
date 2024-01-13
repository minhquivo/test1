//Canvas version
$(document).ready(function() {  
  var ctx = clock.getContext('2d');
  var h = clock.height;
  var w = clock.width;
  var lmin = Math.min(h, w);
  var r = lmin/2 - lmin*0.05;
  var run = false;
  var workMin = $('#work-range').val();
  var restMin = $('#rest-range').val();
  var rounds = $('#round-range').val();
  var min = 1;
  var sec = 1;
  var round = 1;
  var timer = 0;
  var perc = 0;
  var rest = false;

  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#FFF';
  ctx.textAlign = "center";

  //Initialize text. setTimeOut is needed in order to give enough time to the canvas for loading the font.
  setTimeout(function() {
    textUpdate(ctx, workMin, restMin, 0, 60, w, h, lmin);
  }, 150);

  //IE doesn't seem to support the input event, however it work with the the change event.
  $('#round-range, #work-range, #rest-range').on("input change", function() {
    workMin = $('#work-range').val();
    restMin = $('#rest-range').val();
    rounds = $('#round-range').val();
    min = 1;
    sec = 1;
    round = 1;
    perc = 0;
    rest = false;

    //Clear the canvas before drawing on it;
    ctx.clearRect(0,0,250,250);

    //Update the text;
    textUpdate(ctx, workMin, restMin, 0, 60, w, h, lmin);
    $('#rounds').text(rounds + ' Rounds');
    $('#round-counter').css('opacity', 0).text('Round ' + round);
    });

  $('#clock').click(pomodoroToggle);
  $(document).keyup(function(e) {
    if(e.keyCode == 32) pomodoroToggle();
  });

  function pomodoroToggle() {
    if(run === false) {
      run = true;
  
      $('#round-range, #work-range, #rest-range').prop('disabled', true);
      $('#round-counter').css('opacity', 1);
  
      //Update the timer;
      timer = setInterval(function() {
        //Clear the canvas before drawing on it;
        ctx.clearRect(0,0,250,250);
  
        //Work time...
        if(rest === false && round <= rounds) {
          //Update the circle;
          ctx.beginPath();
          ctx.arc(w/2, h/2, r, -Math.PI/2, 2*(++perc/(workMin*60))*Math.PI-Math.PI/2);
          ctx.stroke();
  
          //Update the text;
          if(sec === 60 && min == workMin) {
            document.querySelector('#bell').play();
  
            textUpdate(ctx, restMin, workMin, 0, sec, w, h, lmin);
  
            perc = 0;
            rest = true;
            sec = 1;
            min = 1;
            round++;
          }
          else if(sec === 60){
            textUpdate(ctx, workMin, restMin, min, sec, w, h, lmin);
  
            min++;
            sec = 1;
          }
          else {
            textUpdate(ctx, workMin, restMin, min, sec, w, h, lmin);
  
            sec++;
          }
        }
  
        //rest time!
        else if(round <= rounds) {
          //Update the circle;
          ctx.beginPath();
          ctx.arc(w/2, h/2, r, 2*(++perc/(restMin*60))*Math.PI-Math.PI/2, 2*Math.PI-Math.PI/2);
          ctx.stroke();
  
          //Update the text;
          if(sec === 60 && min == restMin) {
            document.querySelector('#bell').play();
  
            textUpdate(ctx, workMin, restMin, 0, sec, w, h, lmin);
            $('#round-counter').text('Round ' + round);
  
            perc = 0;
            rest = false;
            sec = 1;
            min = 1;
          }
          else if(sec === 60){
            textUpdate(ctx, restMin, workMin, min, sec, w, h, lmin);
  
            min++;
            sec = 1;
          }
          else {
            textUpdate(ctx, restMin, workMin, min, sec, w, h, lmin);
  
            sec++;
          }
        }
  
        //Pomodoro ends!
        else {
          run = false;
          workMin = $('#work-range').val();
          restMin = $('#rest-range').val();
          rounds = $('#round-range').val();
          min = 1;
          sec = 1;
          round = 1;
          perc = 0;
          rest = false;
  
          //Clear the canvas before drawing on it;
          ctx.clearRect(0,0,250,250);
  
          //Update the text;
          textUpdate(ctx, workMin, restMin, 0, 60, w, h, lmin);
          $('#round-counter').css('opacity', 0).text('Round ' + round);
          $('#round-range, #work-range, #rest-range').prop('disabled', false);
          
          return clearInterval(timer);
          }
      }, 1000);
    }
    else {
      run = false;
      $('#round-range, #work-range, #rest-range').prop('disabled', false);
      return clearInterval(timer);
    }
  }
});

function textUpdate(ctx, bigTextMin, smallTextMin, min, sec, w, h, lmin) {
  var secStr = (60-sec).toString();

  ctx.font = lmin*0.15+"px 'Poiret One', 'Arial'";
  ctx.textBaseline = "bottom";
  if(secStr.length == 2) ctx.fillText((bigTextMin-min)+':'+(60-sec), w/2, h/2+lmin*0.075);
  else ctx.fillText((bigTextMin-min)+':0'+(60-sec), w/2, h/2+lmin*0.075);
  ctx.font = lmin*0.075+"px 'Poiret One', 'Arial'";
  ctx.textBaseline = "top";
  ctx.fillText(smallTextMin+':00', w/2, h/2+lmin*0.075);

  return 0;
}
