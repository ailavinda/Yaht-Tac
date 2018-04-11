$(function() {
  ////////////////////////////////////////////////////////////////
  //                                                            //
  // Anatoliy Lavinda                                           //
  // Web Development Immersive Student at GA, NY,               //
  // Yaht-Tac Game implementation                               //
  // Please see readme.md                                       //
  //                                                            //
  ////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////
  //                                                            //
  // Instructors:                                               //
  //    Tims Gardner                                            //
  //    Drake Tally                                             //
  //    Ari Brenner                                             //
  //    Gainer Bostwick                                         //
  //                                                            //
  ////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////
  //                                          //
  // General Assembly, New York, 2018, Jan 02 //
  // Initial version 0.1                      //
  //                                          //
  // Major modification and refactoring       //
  // version 1.0                              //
  // Aprol 10, 2018                           //
  //                                          //
  //////////////////////////////////////////////

  // Acquiring root within HTML page...
  var $tacCntnr = $('#yaht_tac_contnr');

  // The size of the board 5x5 cells...
  const gmSize = 5;

  // Extended cells numbers for randomization...
  let extNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Player_1 ("X") is the one to make an initial move...
  const player_X = true;
  const player_O = false;
  const chr_X = 'X';
  const chr_O = 'O';

  // Current player...
  // There is also TacApppHndlr.gmPoc.currPlayer in the object...
  let crrPlayer = player_X;

  const msg_1 = 'Player ';
  const msg_2 = ' is a winner!';
  const msg_3 = 'The game is over due to a draw.';
  const msg_4 = 'Please click Restart.';
  const msg_5 = 'Please roll the dice.';
  const msg_6 = 'All extended cells have been added.';
  const msg_7 = ' did not make a move yet.';
  const msg_8 = 'Please make the first move.';
  const msg_9 = 'Warning: To play against AI,';
  const msg_10 = 'please re-load the game into browser.';


  ///////////////////////////////////////////////////////////////////
  //                                                               //
  //  Functions defined within TacUIdomHndlr object.               //
  //                                                               //
  ///////////////////////////////////////////////////////////////////

  function initDOM(clckHndlr, contHTML) {
    // TacUIdomHndlr...
    console.log('TacUIdomHndlr: initDOM...');

    // Attach DOM HTML container to UI object...
    this.topHTML = contHTML;

    // Attach TacAppHndlr.moveHndlr() to UI object...
    this.clckHndlr = clckHndlr;

    // this.cllClckd = function(event) {

    //   // So far, did not see this function has been fired...

    //   event.preventDefault();
      
    //   // "this" is pointing at event object...

    //   console.log('I am within cllClckd... unnamed function at initDOM...');

    //   // The div to which listener had been attached...
    //   let $clckdCll = $(event.currentTarget);

    //   //Add a class to the div indicating the cell has been played...
    //   $clckdCll.addClass('done');

    //   // The list element within div, where the click occured...
    //   let $liElm = $(event.target);

    //   // But click might take place on the div, and not on the crosshair...
    //   if (crrPlayer === true) {
    //     // Mark the cell with "X"...
    //     $liElm.text('X');
    //   } else {
    //     // Mark the taken element with "O"...
    //     $liElm.text('O');
    //   }

    //   // The id of the div with listener attached
    //   // before click took place. 
    //   // Need it to get the position...
    //   let $cllId = $(event.currentTarget).attr('id');

    //   // Retrieve coordinates of the cell as a pair of indexes...
    //   const posIdxs = $cllId.slice(-3).split('_');

    //   clckHndlr(posIdxs);
    // };

    // "this" is TacUIdomHndlr...
    return this;
  }

  function renderHTML(brdArrBln) {
    // Defined within TacProcHndlr
    // The key: rndrAttach...
    // Called from buildTacUIdom()...
    console.log('In renderHTML...');

    // The argument is  boolean board initialized 
    // with "null" value. It has been attached to 
    // gmProc point of the TacAppHndlr object. 
    // The value of brdArrBln is the same as of 
    // brdCllsBln...

    // Aquiring point of attachment by id.
    // This is the root div of the board on HTML page...
    var $brdCntnr = $('#yaht_tac_contnr');

    // Removing garbage text within...
    $brdCntnr.text('');

    // The Borad Size is currently expected to be 5...
    const brdSize = brdArrBln.length;

    // Render the game's board 5x5...
    const $brdTac = this.rndrBrd(brdSize);

    // Attaching whole board to game's div...
    $brdCntnr.append($brdTac);

    // Render the score board...
    const $brdScr = this.rndrScr();

    // Attach scroreboard to div #yaht_tac_contnr...
    $brdCntnr.append($brdScr);
  }

  function renderBrd(nmbRows) {
    // Defined within TacProcHndlr
    // The key: rndrBrd...
    // Called from renderHTML...
    console.log('In renderBrd...');

    // Creating a new div...
    var $newDiv = $('<div>');

    // Assigning a class to the div...
    $newDiv.addClass('board_yaht_tac');

    for (let i = 0; i < nmbRows; i++) {
      // Function to render nmbRows rows of the board...
      // The loop counter i is one of the arguments...

      const $newRow = this.rndrRow(i, nmbRows);

      // All div-rows attached to the newly created div-container point...
      $newDiv.append($newRow);
    }

    return $newDiv;
  }

  function renderRow(rowIdx, nmbRows) {
    // Defined within TaxUIdomHndlr
    // The key: rndrRow...
    // Called from renderBrd...
    console.log('In renderRow...');

    // rowIdx is a consequent number of the current row.
    // nmbRows is a total number of the cells in the row,
    // - is the same as the number of rows in 
    // the square board...

    // New div to contain entire row...
    var $rowDiv = $('<div>');

    // Assigning a class to it...
    $rowDiv.addClass('row');

    // ...and id in the form of "row_N"...
    $rowDiv.attr('id', 'row_' + rowIdx);

    for (let j = 0; j < nmbRows; j++) {
      // Creating divs as the cells of the row...
      let $cllDiv = $('<div>');

      // A class for each div...
      $cllDiv.addClass('cell');

      // ...and id in the form of "cell_X_Y"...
      $cllDiv.attr('id', 'cell_' + rowIdx + '_' + j);

      // The orginal board for the game is 3 by 3.
      // The extended board is 5 by 5...
      // Extended cells are initialized with 
      // additional classes...
      this.extClls(j, rowIdx, nmbRows, $cllDiv);

      // Un-ordered list of elements within each cell...
      let $ulElm = $('<ul>');
      let $liElm = $('<li>');

      // Initialized with crosshair to click...
      $liElm.text('+');
      $ulElm.append($liElm);

      // Attached to div-cell...
      $cllDiv.append($ulElm);

      // Keep the div elements for listeners handling...
      this.brdCells[rowIdx][j] = $cllDiv[0];

      // Append cell to the current row...
      $rowDiv.append($cllDiv);
    }

    return $rowDiv;
  }

  function renderScr() {
    // Defined within TaxUIdomHndlr
    // The key: rndrScr...
    // Called from renderHTML...
    console.log('In TaxUIdomHndlr: renderScr...');

    // Scoreboard to track players' activities and
    // to provide controls, such as Restart etc...

    // "this" is TaxUIdomHndlr...

    let $scrDiv = $('<div>');
    
    $scrDiv.addClass('scorebrd');

    for (let i = 0; i < 2; i++) {
      // One element per player...

      let $scrElm = $('<div>');
      
      $scrElm.addClass('scorebrd_' + (i + 1));
      // One id per player...
      $scrElm.attr('id', 'player_' + (i + 1));

      // Wrapped into un-ordered list...
      let $ulElm = $('<ul>');
      let $liElm_1 = $('<li>');

      let chrTTT = 'X';
      
      if (i === 0) {
        // Player 1, "X", is active and has the first move...
        // $liElm.addClass('active');
      } else {
        chrTTT = 'O';
      }

      // Adding li elements in the same row...

      // The player...
      $liElm_1.text('Player ' + (i + 1) + ': ' + chrTTT);

      // Attaching elements to parent ul...
      $ulElm.append($liElm_1);

      // Element to keep the score per player...
      let $liElm_2 = $('<li>');
      $liElm_2.addClass('score_elm_' + (i + 1));
      $liElm_2.text(' Score: 00');
      $ulElm.append($liElm_2);

      // Element with anchor for rolling the dice...
      let $liElm_3 = $('<li>');
      let $aElm_1 = $('<a>');
      $aElm_1.addClass('bttn_choose_dice');
      $aElm_1.attr('id', 'choice_dice_' + (i + 1));
      $aElm_1.text('Roll the dice?');
      $aElm_1.attr('href', '#');
      $liElm_3.append($aElm_1);
      $ulElm.append($liElm_3);

      // Element with anchor for switchin to
      // computer as an opponent...
      let $liElm_4 = $('<li>');
      let $aElm_2 = $('<a>');
      $aElm_2.addClass('bttn_choose_comp');
      $aElm_2.attr('id', 'choice_ai_' + (i + 1));
      $aElm_2.text('Computer?');
      $aElm_2.attr('href', '#');
      $liElm_4.append($aElm_2);
      $ulElm.append($liElm_4);

      // Putting everything together...
      $scrElm.append($ulElm);
      $scrDiv.append($scrElm);
    }

    // Restart button element...
    $scrElm = $('<div>');
    $scrElm.addClass('reset');
    $ulElm = $('<ul>');
    $aElm_1 = $('<a>');
    $aElm_1.addClass('button_reset');
    $aElm_1.attr('id', 'reset_btn');
    $aElm_1.text('Restart');
    $aElm_1.attr('href', '#');

    // Attaching it to the scoreboard div...
    $ulElm.append($aElm_1);
    $scrElm.append($ulElm);
    $scrDiv.append($scrElm);

    this.scoreBrd = $scrDiv;

    return $scrDiv;
  }

  function addExtClasses(cIdx, rIdx, nmbRows, $cllElm) {
    // Defined within TacUIdomHndlr
    // The key: extClls...
    // Called from renderRow...
    // console.log('In addExtClasses...');

    // cIdx - current column index...
    // rIdx - current row...
    // nmbRows - number of rows (or columns)...
    // $cllElm - div of extended cell to add classes to...

    // Additional classes for extended cells of the board...
    let $clss_1 = '';
    let $clss_2 = '';

    if (rIdx === 0) {
      // Five in the upper row,  1 through 5...
      $clss_1 = 'ext';
      $clss_2 = 'e_' + (cIdx + 1);
    } else if (rIdx === nmbRows - 1) {
      // Five in the bottom row, 13 through 9...
      $clss_1 = 'ext';
      $clss_2 = 'e_' + (13 - cIdx);
    } else if (rIdx > 0 && rIdx < nmbRows - 1) {
      if (cIdx === 0) {
        // Three on the left column, 16 thruogh 14...
        $clss_1 = 'ext';
        $clss_2 = 'e_' + (16 - (rIdx - 1));
      } else if (cIdx === nmbRows - 1) {
        // And three on the right column, 6 thruogh 8...
        $clss_1 = 'ext';
        $clss_2 = 'e_' + (5 + rIdx);
      } else {
        // Should not be the case...
      }
    }

    $cllElm.addClass($clss_1);
    $cllElm.addClass($clss_2);

    if ($cllElm.hasClass('ext')) {
      // Keep these in the flat array for randomization
      // and such...
      TacAppHndlr.extCllsArr.push($cllElm);
      
    }
  }

  function loadLstnrs(nmbRows) {
    // Defined within TacUIdomHndlr
    // The key: addEvLstnrs...
    // Called from TacAppHndlr.init()...
    console.log('In TacUIdomHndlr: loadLstnrs...');

    // Initially, add event listeners only for 
    // cell elements within 3 by 3 board...

    // "this" is TacUIdomHndlr...

    // NB! jQuery listeners work on elements
    // directly retrieved from DOM HTML...

    // Instead, we are using cells saved in
    // the board object...
    let cllElms = this.brdCells;

    for (let row = 1; row < nmbRows - 1; row++) {
      for (let col = 1; col < nmbRows - 1; col++) {

        cllElms[row][col].addEventListener('click', TacAppHndlr.mvHndlr);

        // Keep the info about listener-active cells...
        TacAppHndlr.gmProc.cllLstnrsBln[row][col] = true;
        
      }
    }

    /////////////////////////////////////////////////////////////////
    //  Restart Button
    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    // An event listener for "restart" button...
    // Allow reset multiple times...
    /////////////////////////////////////////////////////////////////
    let $aRst = $('.button_reset');
    
    $aRst.on('click', null, null, this.rstHdr);

    /////////////////////////////////////////////////////////////////
    //  Roll The Dice Button
    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    // Listener for the "roll-the-dice" event...
    // diceHdr (dice handler)has to set the flag, 
    // indicating fresh throw of the dice during
    // extended game...
    /////////////////////////////////////////////////////////////////
    let $aDice = $('.bttn_choose_dice');
    
    $aDice.on('click', null, null, this.diceHdr);

    // Keep the flag indicating that the dice throw
    // option has not been used yet...
    TacAppHndlr.diceFlg = false;

    /////////////////////////////////////////////////////////////////
    //  Computer as an Opponent Button
    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    //
    // An event listeners for engaging computer as
    // an opponent.
    //
    // chsCompHndlr() - we should allow only one of the 
    // players to be a computer, and it
    // should be always Player_1 ("X")...
    //
    /////////////////////////////////////////////////////////////////

    // Both players...
    let $aChsAI = $('.bttn_choose_comp');

    $aChsAI.on('click', null, null, this.compHdr);

    TacAppHndlr.AI_1_Flg = false;

    TacAppHndlr.AI_2_Flg = false;

    // Saving it for listeners removal...
    this.chsAIlstnr = [$aChsAI];

  }

  function chsCompHndlr(event) {
    // Defined in TacUIdomHndlr
    // The key: compHdr.
    // Callback function for "Computer?" button...
    console.log('In chsCompHndlr: Computer is Player_1 (X) now...');

    // Retrieving player's identity from event...
    let compPlr = event.target.id;

    // This is a pair of listeners...
    let $scrDivs = TacUIdomHndlr.chsAIlstnr[0];

    let aTag;

    // Remove both listeners...
    // scrDivs[i].removeEventListener('click', TacUIdomHndlr.compHdr, false);
    $scrDivs.off('click', null, TacUIdomHndlr.compHdr);

    for (let i = 0; i < $scrDivs.length; i++) {
      // Do not allow AI to play against computer...
      // Make sure AI is Player_1,("X"), with
      // the privilege of the first move...

      // Disable listeners on the very first
      // move of the game, so there would be
      // impossible to switch to AI in the middle
      // of current session...

      aTag = $scrDivs[i];

      // Disable anchor...
      aTag.setAttribute('disabled', 'disabled');

      if ($scrDivs[i].id === compPlr && compPlr.slice(-1) === '1') {
        // Show that computer has been chosen 
        // as a Player_1 (X)...
        aTag.innerText = 'AI: Yes';

        // Make it explicit for Player_1, (X)...
        TacUIdomHndlr.AI_1_Flg = true;

      } else {
        // Player_2, (O)...
        aTag.innerText = 'X is AI';
        // And never change AI_2_Flg...
      }

      // Raise the flag about AI mode of the game...
      TacAppHndlr.flgAI = true;

    }

    // Simulate first move on behalf of the AI...
    TacProcHndlr.frstMvAI();

  }

  function rvrsCmpChoice() {
    // Need to run this on the first action
    // of rolling the dice. 
    // The random nature of that mode of game 
    // excludes use of AI...

    // Disable listeners on the very first
    // move of the =normal= game, so there would be
    // impossible to switch to AI in the middle
    // of current session...

    // This is a pair of listeners...
    let $scrDivs = TacUIdomHndlr.chsAIlstnr[0];

    let aTag;

    if ((TacProcHndlr.movNum === 0) && (TacAppHndlr.flgAI === false)) {
      // Both listeners had been disabled following
      // the choice of AI at the beginning of game...

      // Otherwise, on the very first move in the
      // =normal= game, disable them anyways...

      // scrDivs[i].removeEventListener('click', TacUIdomHndlr.compHdr, false);
      $scrDivs.off('click', null, TacUIdomHndlr.compHdr);

    }

    for (let i = 0; i < $scrDivs.length; i++) {
      
      // Do not allow AI to play against computer...
      // Make sure AI is Player 1,(X), with
      // the privilege of the first move...

      aTag = $scrDivs[i];

      if ((TacProcHndlr.movNum === 0) && (TacAppHndlr.flgAI === false)) {
        // On first move of =normal= game - 
        // disable the anchor...
        aTag.setAttribute('disabled', 'disabled');
      }

      aTag.innerText = 'AI is off';

    }

    // Switching to AI mode in the middle of 
    // a session is not permitted...
    alert(msg_9 + ' ' + msg_10);

    TacUIdomHndlr.AI_1_Flg = false;
    TacUIdomHndlr.AI_2_Flg = false;

    // Drop the flag AI mode of the game...
    TacAppHndlr.flgAI = false;

  }

  function diceHndlr() {
    // Defined within TacUIdomHndlr
    // The key: dicHdr...
    // Callback function for the listener on 
    // the anchor for Roll-the-dice button...
    console.log(
      'In TacUIdomHndlr: diceHndlr: Throw of the dice has been requested...'
    );

    const dcFl = TacAppHndlr.rllDie();

    if ((TacAppHndlr.diceFlg === false) && (dcFl === true) ) {
      // The first time...
      TacAppHndlr.diceFlg = true;
    }
  }

  function restHndlr(event) {
    // Defined within TacUIdomHndlr
    // The key: rstHndlr...
    // Callback function from listener 
    // for reset/restart button...
    console.log('In TacUIdomHndlr: restHndlr: Restart has been requested...');

    // "this" is pointing at event, which 
    // is an anchor for Restart button...

    TacAppHndlr.rstGm(event);
  }

  ///////////////////////////////////////////////////////////////////
  //                                                               //
  //  Functions defined within TacAppHndlr object.                 //
  //                                                               //
  ///////////////////////////////////////////////////////////////////

  function init() {
    // TacAppHndlr...

    console.log('TacAppHndlr: init...');

    // Import game's TacProcHndlr object with its
    // methods to TacAppHndlr object...
    this.gmProc = TacProcHndlr.init();

    // The impTacUI() creates tacUIdom object...
    this.impTacUI();

    // The bldTacUI() renders HTML structure from
    // within tacUIdom object calling for 
    // TacUIdomHndlr.renderHTML()...
    this.bldTacUI();

    // addEvLstnrs is a key to TacUIdomHndlr.loadLstnrs()...
    this.tacUIdom.addEvLstnrs(gmSize);

    // Both TacUIdomHndlr and TacAppHndlr objects with
    // their respecive methods are now available 
    // from within TacAppHndlr object...
  }

  function importTacUIdom() {
    // Defined within TacAppHndlr
    // The key: impTacUI
    // Called from TacAppHndlr.init... 
    console.log('TacAppHndlr: importTacUIdom...');

    // mvHndlr is a key to TacAppHndlr.moveHndlr()...
    this.tacUIdom = TacUIdomHndlr.init(this.mvHndlr.bind(this), $tacCntnr);
  }

  function buildTacUIdom() {
    // Defined within TacAppHndlr
    // The key: bldTacUI...
    // Called from TacAppHndlr.init...
    console.log('TacAppHndlr: buildTacUIdom...');

    // rndrAttach is a key to TacUIdomHndlr.renderHTML()...
    this.tacUIdom.rndrAttach(this.gmProc.brdCllsBln);
  }

  function moveHandlr(event) {
    // Defined within TacAppHndlr
    // The key: mvHndlr...
    // Called from importTacUIdom...
    console.log('TacAppHndlr: moveHandlr...');

    // // "this" is the cell which has been just clicked...

    if ((TacAppHndlr.diceFlg === true) && (TacProcHndlr.extDpldFlg === false)) {
      // The diceFlg is an indication that the game is in
      // extended mode...
      // A player must go through the dice roll before
      // proceeding with move...

      if (
        (TacAppHndlr.flgRoll_1 === false && crrPlayer === true) ||
        (TacAppHndlr.flgRoll_2 === false && crrPlayer === false)
      ) {
        // First player (X) did not roll the dice...
        // or
        // Second player (O) did not roll the dice...

        alert(msg_1 + 'must roll the dice befor making a move.');
        alert(msg_5);

        return;
      }
    }

    // The div with listener attached:
    let clckdCll = event.currentTarget;

    // Remove it from the played cell...
    clckdCll.removeEventListener('click', TacAppHndlr.mvHndlr);

    // The li element within div...
    const $liChld = $(clckdCll).find('li');

    //Add a class to the unusable cell:
    $(clckdCll).addClass('done');

    // Retrieve id with coordinates...
    let $cllId = $(clckdCll).attr('id');

    // Retrieve coordinates of the cell as a pair of indexes...
    const posIdxs = $cllId.slice(-3).split('_');

    const k = posIdxs[0];
    const l = posIdxs[1];

    // Gey the cell's boolean element...
    const cllBl = TacAppHndlr.gmProc.cllLstnrsBln[k][l];

    if (cllBl === true) {

      // Change flag to listener-inactive state...
      TacAppHndlr.gmProc.cllLstnrsBln[k][l] = false;

      // Mark the cell li element using character "X" or "O"...
      if (crrPlayer === true) {
        // First player uses "X"...
        $liChld.text('X');

        // Keep track for winner evaluation...
        TacAppHndlr.gmProc.cllsWnScr[k][l] = true;

        if (TacAppHndlr.flgAI) {
          // Set the cell as "used" by Player_1 ("X")
          // in the miniMax structure, which is
          // still 3 by 3...
          TacProcHndlr.brdMnMx[k - 1][l - 1] = true;

          // Keep the coded move...
          const mvCd = TacProcHndlr.moveCodes[k - 1][l - 1];
          TacProcHndlr.arrX.push(mvCd);

        }

        if ((TacProcHndlr.movNum === 0) && (TacAppHndlr.flgAI === false)) {
          // Disable buttons for AI choice for 
          // the case of =normal= game mode
          // upon very first move...

          TacUIdomHndlr.rvrsCmpChc();
        }

        // Increment moves counter...
        TacProcHndlr.movNum += 1;

        // Switch the game to second player...
        crrPlayer = false;

        // Fist player has just made a move...
        TacAppHndlr.flgMov_1 = true;
        TacAppHndlr.flgMov_2 = false;

        if ((TacProcHndlr.movNum === 5) && (TacAppHndlr.flgAI === true)) {
          // That was the last move in the game.
          // Need to see a "win" or a "draw" and
          // invite to reset...
          TacAppHndlr.gmProc.chkWin();

          return;

        }

      } else {
        // Second player had the move...
        $liChld.text('O');

        // Keep track for winner evaluation...
        TacAppHndlr.gmProc.cllsWnScr[k][l] = false;

        if (TacAppHndlr.flgAI) {
          // Set the cell as "used" by Player 2 ("O") 
          // in the miniMax structure, which is 
          // still 3 by 3...
          TacProcHndlr.brdMnMx[k - 1][l - 1] = false;

          // Keep coded move...
          const mvCd = TacProcHndlr.moveCodes[k - 1][l - 1];
          TacProcHndlr.arrO.push(mvCd);
        }

        // Switch the game to the first player...
        crrPlayer = true;

        // Second player has just made a move...
        TacAppHndlr.flgMov_2 = true;
        TacAppHndlr.flgMov_1 = false;

      }

      TacAppHndlr.gmProc.currPlayer = crrPlayer;

      if ((TacAppHndlr.flgAI) && (TacProcHndlr.movNum === 1) && (TacAppHndlr.flgMov_2)) {
        // Do the Second move for AI...
        TacProcHndlr.scndMvAI();

      }

      if ((TacAppHndlr.flgAI) && (TacProcHndlr.movNum === 2) && (TacAppHndlr.flgMov_2)) {
        // Do the Blocking Move (the 3rd one) evaluation
        // by for AI...               

        // Before using miniMax(), check for a pending
        // win by O, and, if found, make a mark into
        // that positon in order to "block"...

        // Update TacProcHndlr.ptrnWin3x3 structure
        // as a side effect of calling the function...
        const ptrnWin = collectInfoOrig();

        // Get the blocking move...
        const psPnd = TacProcHndlr.blckWinO();

        if (TacProcHndlr.winPndFlgO === true) {
          // The flag is set by blockWinO()
          // upon finding pending win for O...

          TacProcHndlr.winPndFlgO = false;

          let cellElms = TacUIdomHndlr.brdCells;

          cellElms[psPnd[0] + 1][psPnd[1] + 1].click();

          // click() actually triggers another call for
          // moveHandlr, with effect of return...
          return;

        } else {
          // No threats found - 
          // proceed with chckForWin()...
          TacAppHndlr.gmProc.chkWin();
        }

      }

      if (TacProcHndlr.movNum > 2) {
        // After the first two moves by both players,
        // there should not be any terminal states.
        // First two moves are not using miniMax...

        // Check if there is a winner 
        // ...and this will take care of the next move by AI...

        TacAppHndlr.gmProc.chkWin();
        
        // chkWin() will initiate the next move by AI...

        // thrdPlsMvAI() ==> blckWinO ==> miMa()...

      } else {
        // No checking for winner for the first two moves...
      }
      
    }
  }

  function resetGame(event) {
    // Defined within TacAppHndlr
    // The key: rstGm...
    // Called from listener callback function
    // TacUIdomHndlr.restHndlr...
    console.log('In TacAppHndlr: resetGame: Resetting the game...');

    // "this" is pointing at TacAppHndlr...

    for (let i = 0; i < gmSize; i++) {
      for (let j = 0; j < gmSize; j++) {

        // Boolean data related to active listeners...
        let cllData = this.gmProc.cllLstnrsBln[i][j];

        // And div elements with possibly still 
        // attached listeners...
        let cellElms = this.tacUIdom.brdCells[i][j];

        // Kill unused listeners...
        if (cllData === true) {
          // If the cell has been listener-active
          // - remove the listener...
          cellElms.removeEventListener('click', this.mvHndlr);
        }

        // Remove class "done", which is 
        // the indication of "played" cell...
        cellElms.classList.remove('done');

        // Raise the flag - "no listener"...
        this.gmProc.cllLstnrsBln[i][j] = false;

        if (i > 0 && i < gmSize - 1 && (j > 0 && j < gmSize - 1)) {
          // Add listeners to the central nine cells...
          cellElms.addEventListener('click', this.mvHndlr);

          // Mark them as listener-active...
          this.gmProc.cllLstnrsBln[i][j] = true;
        }

        /////////////////////////////////////////////////////////////
        // Listeners for AI are re-initialized by reloading the game.
        /////////////////////////////////////////////////////////////

        // Mark the cells as available for move...
        let $liElm = $(cellElms).find('li');
        
        $liElm.text('+');

        // Initialize cells for winner evaluation...
        this.gmProc.cllsWnScr[i][j] = null;

      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Board boolean structure for miniMax processing...
        TacProcHndlr.brdMnMx[i][j] = null;
      }
    }

    extNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    TacProcHndlr.extDpldFlg = false;
    TacProcHndlr.movNum = 0;
    TacProcHndlr.arrX = [];
    TacProcHndlr.arrO = [];

    // Set player 1 as the first to move with "X"...
    this.gmProc.currPlayer = player_X;
    crrPlayer = player_X;

    // Drop all the flags...
    this.flgRoll_1 = false;
    this.flgRoll_2 = false;
    this.flgMov_1 = false;
    this.flgMov_2 = false;
    this.diceFlg = false;
    TacProcHndlr.winPndFlgO = false;

    // Add "ext" class to the divs of extention cells...
    for (let k = 0; k < this.extCllsArr.length; k++) {
      this.extCllsArr[k].addClass('ext');
    }
  
    // If Player_1, "X", is "computer" - do not reset this.
    // Make a first move on behalf of AI...
    if (this.flgAI) {
      TacProcHndlr.frstMvAI();
    }

    // Do not reset the score...
    // Effectively, to reset both, AI and the score, 
    // re-load the game into browser...
  }

  function rollTheDice() {
    // Defined within TacAppHndlr
    // The key: rllDie...
    // Called from TacUIdomHndlr.diceHdr
    console.log('In TacAppHndlr: rollTheDice...');

    // This is a callback for the button listener...
    // TacAppHndlr.extCllsArr keeps the extended cells
    // for rundomization...
    
    // "this" is pointing to TacAppHndlr...

    // Presence of TWO buttons "Roll the dice?" is,
    // in fact, a redundancy. Either player is able
    // to use the button of the opponent... 
    // The effect should be the same as if they were
    // throwing the same dice in turns...

    if (TacProcHndlr.extDpldFlg === false) {
      // There are available extention cells
      // for deployment...

      if (TacProcHndlr.movNum >= 1) {
        // At least ONE first move is expected.
        // The first player hypothetically can
        // make a kill on the 3rd move, when
        // flgMov_1 is true, and flgMov_2 is false.

        if (this.flgAI === true) {
          // If AI mode is active, only a second
          // player can initiate through of the dice...
          
          // Adjust "Computer?" choice buttons...
          TacUIdomHndlr.rvrsCmpChc()

          this.flgAI = false;

          if (crrPlayer === false) {
            // Valid roll of the dice for the player "O"...
            this.flgRoll_2 = true;
            this.flgMov_2 = false;  

          } else {
            // Should not be the case...
          }

        } else {
          // Both players are humans...
          
          if (crrPlayer === true ) {
            // Current player is "X"...
            
            if (this.flgRoll_1 === true) {
              // Rolling twice w/o playing...
              alert(msg_1 + ' "X"' + msg_7);
              return false;
            }

            if (this.flgMov_2 = true) {
              // Making sure Player "X" throwing
              // the dice after Player "O" made
              // a move...
              
              this.flgRoll_1 = true;
              this.flgMov_2 = false;
              this.flgRoll_2 = false;

            } else {
              // Player "O" did not make the last move...
              
              alert(msg_1 + ' "O"' + msg_7);
              return false;
            }

          } else if (crrPlayer === false) {
            // Roll of the dice for the player "O"...
            
            if (this.flgRoll_2 === true) {
              // Rolling twice w/o playing...
              alert(msg_1 + ' "O"' + msg_7);
              return false;
            }

            if (this.flgMov_1 = true) {
              // Making sure Player "O" throwing
              // the dice in turn...
              
              this.flgRoll_2 = true;
              this.flgMov_1 = false;
              this.flgRoll_1 = false;

            } else {
              // Player "X" did not make the last move...
              
              alert(msg_1 + ' "X"' + msg_7);
              return false;
            }
          } else {
            // Should not be the case...     
          }
        }
      
      } else {
        // At least one move is expected...
        
        alert(msg_8);
        return false;
      }
    }

    var $extClls = this.extCllsArr;
    
    let extCs;
    
    const extLn = $extClls.length;
    
    let extElm;

    // See extNum on line 35...
    const extNumLn = extNum.length;

    if (extNumLn !== 0) {
      // Generate a random number in the range 
      // from 1 to the current size of the array 
      // with extended cell elements...
      const theRll = 1 + Math.floor(Math.random() * extNumLn);
      
      // Get the element by random index...
      extElm = extNum[theRll - 1];
      
      // Remove the element from the array...
      extNum.splice(theRll - 1, 1);
      if (extNum.length === 0) {
        // Extended cells have been exhausted...
        TacProcHndlr.extDpldFlg = true;
      }

      for (let j = 0; j < extLn; j++) {
        // Loop through the array of
        // the extended cells by class name...

        // Array of classes...
        extCs = $extClls[j][0].classList;
        
        extCllsId = $extClls[j].attr('id');
        
        // Get id: "cell_X_X".
        // Cut the numbers for row and column...
        cllCls = extCllsId.split('_');
        
        const row = cllCls[1];
        const col = cllCls[2];  

        // Cut the number from class "e_NN"
        let exCll;

        for (let k = 0; k < extCs.length; k++) {
          
          if (extCs[k].indexOf('_') !== -1) {
            exCll = extCs[k].split('_')[1];
            break;
          }
        }

        if (exCll === '' + extElm) {
          // If found the match...
          
          // Remove class "ext" to change the opasity 
          // of the cell...
          $extClls[j].removeClass('ext');

          // Attach listener to that cell...
          $extClls[j][0].addEventListener('click', this.mvHndlr);

          // The jQuery style of handling it does not work
          // the way I need it (loaded from this.brdCells):
          // $($cllElms[row][col]).one('click', null, null, TacAppHndlr.moveHdr);

          // Keep the info about listener-active cells...
          this.gmProc.cllLstnrsBln[row][col] = true;

          break;
        }
      }

      return true;

    } else {

      // All the extended cells have been deployed...
      // No need for listeners on "roll-the-dice" 
      // buttons...
      
      alert(msg_6);

      let $aDice = $('.bttn_choose_dice');
      
      $aDice.off('click', null, null, this.diceHdr);

      // Drop all the flags relating to the dice throw...
      this.diceFlg = false;
      this.flgRoll_1 = false;
      this.flgRoll_2 = false;

      return false;
    }
  }

  ///////////////////////////////////////////////////////////////////
  //                                                               //
  //  Functions defined within TacProcHndlr object.                //
  //                                                               //
  ///////////////////////////////////////////////////////////////////

  function initProc() {
    // TacProcHndlr...
    console.log('TacProcHndlr: initProc...');

    // "this" is referring to TacProcHndlr...

    // Creating board's boolean structure for tracking
    // the moves of the players...
    this.brdCllsBln = this.rndrArrBrd(gmSize, null);

    // Board's boolean structure to keep track of active listeners.
    // Listeners for the board cells are configured to run once.
    // No need to remove them...
    this.cllLstnrsBln = this.rndrArrBrd(gmSize, false);

    // Board structure pre-populated with "null"
    // for processing a winning combinations of cells.
    // As players make their moves, the values replaced
    // with "true" for player_X and "false" for player_O...
    this.cllsWnScr = this.rndrArrBrd(gmSize, null);

    // Initial value for currPlayer is player_X = true...
    this.currPlayer = crrPlayer;

    return this;
  }

  function brdStructBln(brdSize, fillVal) {
    // Defined within TacProcHndlr
    // The key: rndrArrBrd... 
    // Called from TacProcHndlr.initProc...
    
    console.log('In brdStructBln...');

    // Create board-size structure initialized with
    // "null", "false", or else...
    // Will be used for tracking listeners, 
    // winning combinations of cells and such...

    const brdStr = [];

    for (let i = 0; i < brdSize; i++) {
      brdStr[i] = [];
      for (let j = 0; j < brdSize; j++) {
        brdStr[i][j] = fillVal;
      }
    }
    return brdStr;
  }

  //////////////////////////////////////////////////
  // Functions called from chckForWin()...        //
  //////////////////////////////////////////////////

  function convBlnToNum(winArrElm) {
    // Defined within TacProcHndlr
    // The key: ...
    // Called from chckForWin...
    // console.log('In convBlnToNum...')

    // Converting elements of array to numbers:
    // "null"  => 0
    // "true"  => 1
    // "false" => 2
    if (typeof winArrElm === 'object') {
      return 0;
    } else if (winArrElm === true) {
      return 1;
    } else if (winArrElm === false) {
      return 2;
    } else {
      // What that might be?..
      return -1;
    }
  }

  function collectInfoOrig() {
    // Helper function.
    // Called from chckForWin().
    // "this" is no longer points at TacProcHndlr...
    console.log('In collectInfoOrig...');

    // Collecting information for 3 rows, 
    // 3 columns, and 
    // 2 diagonals
    // as an array of aggregated strings within
    // extended array of 5x5...
    // The coordinates are:
    //                   ...                 ... 
    //                      [1, 1] ... [1, 3]
    //                      [2, 1] ... [2, 3]
    //                      [3, 1] ... [3, 3]
    //                   ...                 ...


    const winArr = TacProcHndlr.cllsWnScr;
    // console.log('winArr', winArr);

    let strsArr = [[], [], []];
    let clmnsArr = [[], [], []];
    let diagNE = [];
    let diagNW = [];
    let winPtrn = [];

    for (let m = 1; m < 4; m++) {
      for (let n = 1; n < 4; n++) {
        // Rows...
        strsArr[m - 1][n - 1] = convBlnToNum(winArr[m][n]);

        // North-West diagonal...
        if (m === n) {
          diagNW.push(convBlnToNum(winArr[n][n]));
        }

        // Columns as an array of arrays...
        clmnsArr[n - 1].push(convBlnToNum(winArr[m][n]));
      }

      for (let l = 3; l > 0; l--) {
        // North-East diagonal...
        if (l === Math.abs(m - 4)) {
          diagNE.push(convBlnToNum(winArr[m][l]));
        }
      }
    }

    // Converting the arrays to strings...
    for (let k = 0; k < 3; k++) {
      winPtrn.push(strsArr[k].join(''));
    }

    winPtrn.push(diagNW.join(''));
    winPtrn.push(diagNE.join(''));
    
    for (let j = 0; j < 3; j++) {
      winPtrn.push(clmnsArr[j].join(''));
    }

    // Keep this collection in the Proc object
    // for pending wins evaluation...
    
    TacProcHndlr.ptrnWin3x3 = winPtrn;

    return winPtrn;

  }

  function collectInfoExt() {
    // Helper function.
    // Called from chckForWin().
    // "this" is no longer points at TacProcHndlr...
    console.log('In collectInfoExt...')

    // The winning combination is now "four-in-the-row"...
    // Collecting information for 10 rows, 10 columns, 4
    // major diagonals, and 4 side-diagonals = 28 total.
    // As an array of aggregated strings...
    // The coordinates are: [0, 0]       ...        [0, 4]
    //                      [1, 0][1, 1] ...  [1, 3][1, 4]
    //                      [2, 0][2, 1][2, 2][2, 3][2, 4]
    //                      [3, 0][3, 1] ...  [3, 3][3, 4]
    //                      [4, 0]       ...        [4, 4]

    const winArr = TacProcHndlr.cllsWnScr;
    
    let strsArr = [];
    let clmnsArr = [];
    let diagNE_mj = [];
    let diagNW_mj = [];
    let winPtrn = [];

    // Build and empty arrays first...
    for (let i = 0; i < 10; i++) {
      // Ten combinations in rows...
      strsArr.push([]);
      // Ten - in columns...
      clmnsArr.push([]);
    }

    for (let j = 0; j < 4; j++) {
      // Eight combinations in major and minor diagonals...
      diagNE_mj.push([]);
      diagNW_mj.push([]);
      
    }  

    // Then - collect data from the board...
    for (let m = 0; m < gmSize; m++) {
      // Five rows...
      for (let n = 0; n < (gmSize - 1); n++) {
        // Columns with n-elements 0 to 3...
        strsArr[m][n] = convBlnToNum(winArr[m][n]);
      }
    }

    for (let m = 0; m < gmSize; m++) {
      // Five rows...
      for (let n = 1; n < gmSize; n++) {
        // Columns with n-elements 1 to 4...
        strsArr[m + gmSize][n - 1] = convBlnToNum(winArr[m][n]);
      }
    }

    for (let m = 0; m < (gmSize - 1); m++) {
      // Four rows...
      for (let n = 0; n < gmSize; n++) {
        // Columns with m-elements 0 to 3...
        clmnsArr[n].push(convBlnToNum(winArr[m][n]));
      }
    }

    for (let m = 1; m < gmSize; m++) {
      for (let n = 0; n < gmSize; n++) {
        // Columns with m-elements 1 to 4...
        clmnsArr[n + gmSize].push(convBlnToNum(winArr[m][n]));
      }
    }

    // Diagonals...
    for (let m = 0; m < gmSize - 1; m++) {
      // Four rows...
      for (let n = 0; n < gmSize - 1; n++) {
        // North-West major diagonal m-elements 0 to 3...
        if (m === n) {
          diagNW_mj[0].push(convBlnToNum(winArr[m][n]));
        }
      }
      
      for (let l = 1; l < gmSize; l++) {
        // NW top minor diagonal (m-elements 0 to 3)...
        if (l === m + 1) {
          diagNW_mj[2].push(convBlnToNum(winArr[m][l]));
        }
      }
    }

    for (let m = 1; m < gmSize; m++) {
      // Four rows...
      for (let n = 1; n < gmSize; n++) {
        // North-West major diagonal m-elements 1 to 4...
        if (m === n) {
          diagNW_mj[1].push(convBlnToNum(winArr[m][n]));
        }
      }
      for (let l = 0; l < gmSize - 1; l++) {
        // NW bottom minor diagonal (m-elements 1 to 4)...
        if (m === l + 1) {
          diagNW_mj[3].push(convBlnToNum(winArr[m][l]));
        }
      }
    }
    
    // NE diagonals...
    for (let m = 0; m < gmSize - 1; m++) {
      // Four top rows...
      for (let n = gmSize - 1; n > 0; n--) {
        // North-East major diagonal with n-elements 4 to 1...
        if (n === Math.abs(m - (gmSize -1))) {
          diagNE_mj[0].push(convBlnToNum(winArr[m][n]));
        }
      }
      for (let l = gmSize - 2; l > -1; l--) {
        // NE minor top diagonal with l-elements 3 to 0...
        if (l === Math.abs(m - (gmSize -2))) {
          diagNE_mj[2].push(convBlnToNum(winArr[m][l]));
        }
      }
    }
    for (let m = 1; m < gmSize; m++) {
      // Four bottom rows...
      for (let n = gmSize -2; n > -1; n--) {
        // NE major diagonal with n-elements 3 to 0...
        if (n === Math.abs(m - (gmSize -1))) {
          diagNE_mj[1].push(convBlnToNum(winArr[m][n]));
        }
      }
      for (let k = gmSize - 1; k > 0; k--) {
        // NE bottom diagonal with k-elements 4 to 1...
        if (k === Math.abs(m - gmSize)) {
          diagNE_mj[3].push(convBlnToNum(winArr[m][k]));
        }
      }
    }

    // Converting the rows, columns, and diagonals arrays
    // to strings...
    for (let k = 0; k < 10; k++) {
      winPtrn.push(strsArr[k].join(''));
    }
    for (let l = 0; l < 10; l++) {
      winPtrn.push(clmnsArr[l].join(''));
    }
    for (let m = 0; m < 4; m++) {
      winPtrn.push(diagNE_mj[m].join(''));
    }
    for (let n = 0; n < 4; n++) {
      winPtrn.push(diagNW_mj[n].join(''));
    }

    return winPtrn;

  }

  function isThereWin(ptrnWin, ptrn_1, ptrn_2) {
    // Helper function to detect a winning pattern.
    // Called from chckForWin()...

    // Get Scroreboard attachment...
    const $scrDivs = TacAppHndlr.tacUIdom.scoreBrd;

    for (let i = 0; i < ptrnWin.length; i++) {

      if (ptrnWin[i] === ptrn_1 || ptrnWin[i] === ptrn_2) {
        // There is a winner...
        // The game is over...

        // Update score...
        let $liElm_1 = $scrDivs.find('li.score_elm_1');
        let $liElm_2 = $scrDivs.find('li.score_elm_2');

        if (ptrnWin[i] === ptrn_1) {
          
          scrNum = $liElm_1.text().slice(-2) * 1;
          scrNum += 1;
          $liElm_1.text(
            $liElm_1.text().slice(0, -2) + ('0' + scrNum).slice(-2)
          );
          
          alert(msg_1 + '1 ("X") ' + msg_2);    

        } else {
          
          scrNum = $liElm_2.text().slice(-2) * 1;
          scrNum += 1;
          $liElm_2.text(
            $liElm_2.text().slice(0, -2) + ('0' + scrNum).slice(-2)
          );
          
          alert(msg_1 + '2 ("O") ' + msg_2);
          
        }

        alert(msg_4);

        // The game is over...
        TacAppHndlr.flgGo = false;

        break;

        // Do not Reset the game until requested by user...

      } else {
        // For now - No action - there are no winners...
        // But we would like to callect additional info
        // in regard to pending threats (two-in-the-row,
        // or three-in-the-row)...
      }
    }
  }
  //////////////////////////////////////////////////
  // End of Functions called from chckForWin()... //
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // Beginning of chckForWin()...                 //
  //////////////////////////////////////////////////
  function chckForWin() {
    // Defined within TacProcHndlr
    // The key: chkWin...
    // Called from moveHandlr...
    console.log('TacProcHndlr: chckForWin...');

    // Called upon every cell-click event
    // to see whether a "terminal state" 
    // has been acheaved...
    

    // "this" is TacProcHndlr...

    const winArr = this.cllsWnScr;

    let ptrnWin = [];

    let notDraw = TacAppHndlr.flgGo;
    // var isItAI = TacAppHndlr.flgAI;

    // Flag indicating extended game is active...
    const isItDie = TacAppHndlr.diceFlg;

    if (!isItDie) {
      // If the game has not been extended yet, 
      // that is, the dice were not rolled...

      ptrnWin = collectInfoOrig();
      
    } else {
      // Extended game is activated...

      ptrnWin = collectInfoExt();

    }

    
    if (!isItDie) {
      // Checking for a winner in simple game...

      isThereWin(ptrnWin, '111', '222');

    } else {
      // Checking for a winner in the extended game...

      isThereWin(ptrnWin, '1111', '2222');

    }

    // Check if the game is over due to a draw...
    notDraw = this.rmMvs(winArr);

    if (notDraw) {
      // There are available moves...
      // Proceed with the game...

      // If the Player 1, "X", is a computer,
      // and it is its turn...

      if (
        TacAppHndlr.flgGo &&
        TacAppHndlr.flgAI &&
        TacAppHndlr.flgMov_2 &&
        TacAppHndlr.gmProc.currPlayer === true
      ) {
        // Run minimax evaluation for current state of the board...
        this.thrdPlsMvAI();

        // Switch to Player 2, "O"...
        // moveHandlr takes care of it...
        // TacAppHndlr.gmProc.currPlayer = false;
      }

    } else {

      // This is the draw case...
      alert(msg_3);
      alert(msg_4);
    }

    // Update flag to proceed or restart...
    TacAppHndlr.flgGo = notDraw;

  }  
  //////////////////////////////////////////////////
  // The End of chckForWin()...                   //
  //////////////////////////////////////////////////

  function rmngMoves(mvArr) {
    // Remaining/available moves...
    // Defined within TacProcHndlr
    // The key: rmMvs...
    // Called from chckForWin...
    console.log('In rmngMoves...')

    // "this" is "window" object...

    // Checking whether extended game is enabled...
    if (TacAppHndlr.diceFlg === false) {

      // The board is 3 by 3, so we are starting 
      // with index 1 and finishing with index 3...
      for (let i = 1; i < mvArr.length - 1; i++) {
        for (let j = 1; j < mvArr.length - 1; j++) {
          if (typeof mvArr[i][j] === 'object') {
            // "null" - is an object.
            // Found first available move...
            return true;
          }
        }
      }
    } else {
      // The boards is 5 by 5.
      // Process extended mode...
      for (let i = 0; i < mvArr.length; i++) {
        for (let j = 0; j < mvArr.length; j++) {
          if (typeof mvArr[i][j] === 'object') {
            // Found first available move...
            return true;
          }
        }
      }
    }
    // No available moves are found.
    // This is the draw...
    return false;
  }

  function frstMoveAI() {
    // Defined within TacProcHndlr
    // The key: frstMvAI.
    // Called from resetGame() and
    // chsCompHndlr() callback...
    // 
    // As a computer has the first move in the game,
    // it is a good idea to make it appear as though
    // a move is random...
    // In fact, the theory holds it that any first move
    // is a good one, that is, in a perfect game it would lead
    // either to "win", or to "tie"...
    // See: https://en.wikipedia.org/wiki/Tic-tac-toe...
    // Supposed the cells are numbered from the first row down
    // as following:
    // 1, 2, 3,
    // 4, 5, 6,
    // 7, 8, 9
    // Then any of moves: 1, 4, 5 - is a "good" one.
    // By rotating the board counter- or clockwise, it easy
    // to see, that following sets of moves are as good as
    // the first set: (3, 2, 5), (9, 6, 5), (7, 8, 5)...
    //
    // So, the first action should be random in the range
    // of 1 through 9.
    // As a result, the first two moves of the game are 
    // removed from minimax analysis...
    // 
    // The brdCells structure though is 5 by 5:
    //
    // The coordinates are: [0, 0]       ...        [0, 4]
    //                      [1, 0][1, 1] ...  [1, 3][1, 4]
    //                      [2, 0][2, 1][2, 2][2, 3][2, 4]
    //                      [3, 0][3, 1] ...  [3, 3][3, 4]
    //                      [4, 0]       ...        [4, 4]

    console.log('In frstMoveAI... "this" is TacProcHndlr...');

    let cellElms = TacUIdomHndlr.brdCells;

    const rndmCell = 1 + Math.floor(Math.random() * 9);

    // This is the very first move by AI...
    // The counter will be taken care of in moveHandlr()...
    // this.movNum += 1;

    let mvCd;

    const gmClls = [ [ 1,  2,  3 ],
                     [ 4,  5,  6 ], 
                     [ 7,  8,  9 ] ]; 

    // const gmClls = [ [ 1,  2,  3,  4,  5 ], 
    //                  [ 6,  7,  8,  9, 10 ], 
    //                  [11, 12, 13, 14, 15 ],
    //                  [16, 17, 18, 19, 20 ],
    //                  [21, 22, 23, 24, 25 ]
    //                 ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (gmClls[i][j] === rndmCell) {
          // Set this randomly chosen cell as 
          // "used" by AI in miniMax structure...
          
          this.brdMnMx[i][j] = true;
          mvCd = this.moveCodes[i][j];
          this.arrX.push(mvCd);

          // Simulate "click" on the [i, j] cell/div of the board.
          // Event listener handler will take care of it...
          cellElms[i + 1][j + 1].click();
          
          i = 3;
          break;
        }
      }
    }
    // Switch to Player 2, "O"...
    // moveHandlr takes care of it...
  }

  function scndMoveAI() {
    // Defined within TacProcHndlr
    // The key: scndMvAI.
    // Called from resetGame() and
    // chsCompHndlr() callback...
    // 
    // Second move by AI needs to be treated via
    // use of known heuristics...

    console.log('In scndMoveAI... "this" is TacProcHndlr');

    // It the second move by AI...
    // But the counter will be treated in moveHandlr();
    // this.movNum += 1;

    // Board cells with listeners attached...
    let cellElms = TacUIdomHndlr.brdCells;

    // First move by both, AI and (O)...
    const mvCdX = this.arrX[0];
    const mvCdO = this.arrO[0];

    // Structures used for evaluation of move:

    // For the second move by (X)...
    const pairCd_1 = ['^rt', '^lb'];
    const pairCd_2 = ['^lt', '^rb'];

    // For the weak first move by (O)...
    // Also, for the second move by AI after
    // (O) marked "Center"...
    const pairCd_3 = ['^lb', '^rb'];
    const pairCd_4 = ['^lt', '^lb'];
    const pairCd_5 = ['^rt', '^lt'];
    const pairCd_6 = ['^rb', '^rt'];

    // For the first move into "Corner" by (O),
    // when AI had also marked a "Corner" on 
    // the first move...
    const pairCd_7 = ['^rt', '^rb', '^lb'];
    const pairCd_8 = ['^rb', '^lb', '^lt'];
    const pairCd_9 = ['^lb', '^lt', '^rt'];
    const pairCd_10 = ['^lt', '^rt', '^rb'];

    // This would be the second move by AI...
    let newMvCdX;

    // Random number for evaluation...
    let rndmCd;

    if (mvCdX === '+') {
      // First move of AI (X) was "Center"...
      rndmCd = Math.floor(Math.random() * 2);

      if        (mvCdO === '^lt') {
        // First move of (O) was "Corner" left-top...  
        newMvCdX = pairCd_1[rndmCd];

      } else if (mvCdO === '^rt') {
        // ...right-top...        
        newMvCdX = pairCd_2[rndmCd];

      } else if (mvCdO === '^rb') {
        // ...right-bottom...       
        newMvCdX = pairCd_1[rndmCd];

      } else if (mvCdO === '^lb') {
        // ...left-bottom...
        newMvCdX = pairCd_2[rndmCd];

      } else {
        // ...everything else on four sides, "Edges"...
        // Weak move for (O)...
        rndmCd = Math.floor(Math.random() * 2);
        if        (mvCdO === '~t') {        
          newMvCdX = pairCd_3[rndmCd];

        } else if (mvCdO === '~r') {        
          newMvCdX = pairCd_4[rmdmCd];
          
        } else if (mvCdO === '~b') {         
          newMvCdX = pairCd_5[rndmCd];
          
        } else if (mvCdO === '~l') {          
          newMvCdX = pairCd_6[rndmCd];
          
        } else {
          // Should not be a case...
        }

      }

    } else if ((mvCdX === '^lt') || (mvCdX === '^rt') || (mvCdX === '^rb') || (mvCdX === '^lb') ) {
      // First move of AI was "Corner"...

      if   (mvCdO === '+') {
      // First move by (O) was "Center" after
      // AI marked "Conrer"...
      // AI responds with opposite corner...
        if        (mvCdX === '^lt') {
          newMvCdX = '^rb';
        } else if (mvCdX === '^rt') {
          newMvCdX = '^lb';
        } else if (mvCdX === '^rb') {
          newMvCdX = '^lt';
        } else if (mvCdX === '^lb') {
          newMvCdX = '^rt';
        } else {
          // Should not be the case...
        }
      
      } else if ((mvCdO === '^lt') || (mvCdO === '^rt') || (mvCdO === '^rb') || (mvCdO === '^lb') ) {
        // First move of (O) was in "Corner" 
        // not occupied by AI...
        rndmCd = Math.floor(Math.random() * 3);
        if        (mvCdX === '^lt') {
            newMvCdX = pairCd_7[rndmCd];

        } else if (mvCdX === '^rt') {
            newMvCdX = pairCd_8[rndmCd];

        } else if (mvCdX === '^rb') {
            newMvCdX = pairCd_9[rndmCd];

        } else if (mvCdX === '^lb') {
            newMvCdX = pairCd_10[rndmCd];
        } else {
          // Should not be the case...
        }
      } else if ((mvCdO === '~t') || (mvCdO === '~r') || (mvCdO === '~b') || (mvCdO === '~l') ) {
        // First move by (O) was "Edge" after
        // AI marked "Corner"...
        newMvCdX = '+';
      } else {
        // Should not be the case...
      }

    } else if ((mvCdX === '~t') || (mvCdX === '~r') || (mvCdX === '~b') || (mvCdX === '~l') ) {
      // First move by AI was "Edge"...

      if   (mvCdO === '+') {
        // First move by (O) was "Center" after
        // AI marked "Edge"...
        rndmCd = Math.floor(Math.random() * 2);

        if        (mvCdX === '~t') { 
          newMvCdX = pairCd_3[rndmCd];

        } else if (mvCdX === '~r') {
          newMvCdX = pairCd_4[rndmCd];
          
        } else if (mvCdX === '~b') {
          newMvCdX = pairCd_5[rndmCd];
          
        } else if (mvCdX === '~l') {
          newMvCdX = pairCd_6[rndmCd];
          
        } else {
          // Should not be a case...
        }

      } else if ((mvCdO === '^lt') || (mvCdO === '^rt') || (mvCdO === '^rb') || (mvCdO === '^lb') ) {
        // First move by (O) was "Corner" after
        // AI marked "Edge"...
        newMvCdX = '+';

      } else if ((mvCdO === '~t') || (mvCdO === '~r') || (mvCdO === '~b') || (mvCdO === '~l') ) {
        // ...or First move by (O) was "Edge" after
        // AI marked "Edge"...
        newMvCdX = '+';

      } else {
        // Should not be the case...
      }

    } else {
      // Should not be a case for the First Move of X...
    }  

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (this.moveCodes[i][j] === newMvCdX) {
          // Set the chosen cell as "used"
          // by AI in miniMax structure...

          this.brdMnMx[i][j] = true;
          
          // Keep the second move by AI...
          this.arrX.push(newMvCdX);

          // Simulate "click" on the cell/div of the board...
          // Event listener handler will take care of it...
          cellElms[i + 1][j + 1].click();
          
          i = 3;
          break;
        }
      }
    }
  }

  function thrdPlusMoveAI() {
    // Except: First, Second, and Blocking Win moves
    // are originated from here...
    console.log('In thrdPlusMoveAI... "this" is TacProcHndlr...');

    // Make a copy of boolean state...
    const copyBrdMnMx = [[], [], []];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        copyBrdMnMx[i][j] = this.brdMnMx[i][j];
      }
    }

    if ((TacProcHndlr.movNum > 2) && (TacAppHndlr.flgMov_2 === true)) {
      // The check for possible Blocking Move by AI,
      // upon completion of 2nd move by O,
      // is done within moveHandlr()...
      // We want the same to be performed within 
      // thrdPlusMoveAI() before miMa()...

      // Make a mark into that positon in order to "block"...

      // Need TacProcHndlr.ptrnWin3x3 structure
      // as a side effect of calling the function...
      const ptrnWin = collectInfoOrig();

      const psPnd = TacProcHndlr.blckWinO();

      if (TacProcHndlr.winPndFlgO === true) {
        // The flag is set by blockWinO()
        // upon finding the pending win for O...

        TacProcHndlr.winPndFlgO = false;

        let cellElms = TacUIdomHndlr.brdCells;

        cellElms[psPnd[0] + 1][psPnd[1] + 1].click();

        // click() actually triggers another call for
        // moveHandlr, with effect of return...
        
        return;

      } else {
        // Do nothing to proceed with miMa()...
      }
    }

    // Call miniMax to initiate analysis for the 
    // next move...
    const nxtMove = miMa(copyBrdMnMx, true);

    // Board elements with attached listeners...  
    const cellElms = TacUIdomHndlr.brdCells;

    // Set the cell as "used" by AI in miniMax structure...
    this.brdMnMx[nxtMove[2]][nxtMove[3]] = true;

    // Simulate "click" on the [i, j] cell/div of the board...
    // Event listener handler will take care of it...
    
    cellElms[nxtMove[2] + 1][nxtMove[3] + 1].click();

  }

  function blockWinO() {
    // Defined within TacProcHndlr
    // The key: blckWinO.
    // Called from moveHndlr()...

    console.log('In blockWinO... "this" is TacProcHndlr...');

    // After completion of Second Move by "O",
    // AI wants to know the possible move stemming 
    // out of two-out-of-three combination,
    // which would be a forced win on the next 
    // move by "O"...
    // If found, AI must block it.
    // The function might be handy in all
    // subsequent moves by AI...

    // Three rows, two diagonals (NW then NE), 
    // and three columns as a combination of 
    // numbers 0, 1, 2...

    const ptrnWin = this.ptrnWin3x3;

    let pos;
    
    let posPndWin = [];

    this.posPndO = [];

    for (let i = 0; i < ptrnWin.length; i++) {

      if ((ptrnWin[i] === '022') || (ptrnWin[i] === '202') || (ptrnWin[i] === '220')) {

        pos = ptrnWin[i].indexOf('0');

        posPndWin.push(pos);

        if (pos !== -1) {
          // It might be a "fork" - saving the last one...

          // Raising flag - there is a combination...
          // Should be dropped in moveHndlr()...
          this.winPndFlgO = true;

          if (i < 3) {
            // Rows...
            this.posPndO = [i, pos];

          } else if (i === 3) {
            // NW diagonal...
            this.posPndO = [pos, pos];

          } else if (i === 4) {
            // NE diagonal...

            if (pos === 0) {
              this.posPndO = [pos, pos + 2];
            }
            if (pos === 1) {
              this.posPndO = [pos, pos];
            }
            if (pos === 2) {
              this.posPndO = [pos, pos - 2];
            }

          } else if (i > 4) {
            // Columns...

            if (pos === 0) {
              this.posPndO = [pos, i - 5];
            }
            if (pos === 1) {
              this.posPndO = [pos, i - 5];
            }
            if (pos === 2) {
              this.posPndO = [pos, i - 5];
            }

          } else {
            // Should not be the case...
          }
          
        }

      } else {
        posPndWin.push(-1);
      }     
    }

    this.posPndWinO = posPndWin;
    
    return this.posPndO;
    
  }

  /////////////////////////////////////////////////////////
  //    MiniMax set of functions...
  /////////////////////////////////////////////////////////

  function termState(brdBln) {
    /////////////////////////////////////////////////////////////////
    //
    // There are tree possible terminal states:
    // 1. For maximizer, that is, for AI, or Player_1; = true =
    // 2. For minimizer, that is, for human, or Player_2; = false =
    // 3. For a draw situation; that would be determined later...
    //
    // We are looking for the winning combination 
    // =three-in-the-row=
    // in any of three rows, three columns, and two diagonals...
    //
    // brdBln is an array with the boolean values representing
    // already played moves. Non-played cells are nulls...
    //
    /////////////////////////////////////////////////////////////////
    console.log('In termState... "this" is "window"');

    // Examaining rows...
    const rowBln = rowWin(brdBln);
    // Examaining columns...
    const clmnBln = clmnWin(brdBln);
    // Examaining North-West diagonal...
    const diagNW = diagWin_NW(brdBln);
    // Examaining North-East diagonal...
    const diagNE = diagWin_NE(brdBln);

    if (
      rowBln === true ||
      clmnBln === true ||
      diagNW === true ||
      diagNE === true
    ) {
      // The value of the winning state for 
      // (maximizer) Player 1 (AI)...

      return 1;
    }

    if (
      rowBln === false ||
      clmnBln === false ||
      diagNW === false ||
      diagNE === false
    ) {
      // The value of the winning state for 
      // (minimizer) Player 2 (human)... 
      
      return -1;
    }

    // The draw state would be derived LATER
    // from the empty array of available moves...
    
    // For now - returning just null...
    return null;

  }

  function rowWin(brBl) {
    
    console.log('In rowWin...');
    // Searching for the rows with winnig 
    // combination of booleans...
    for (let i = 0; i < 3; i++) {
      if (brBl[i][0] === true && brBl[i][1] === true && brBl[i][2] === true) {
        // Found winning row for maximizer...
        return true;
      }
      if (brBl[i][0] === false && brBl[i][1] === false && brBl[i][2] === false) {
        // Found winning row for minimizer...
        return false;
      }
    }
    // Did not find any winning state...
    return null;
  }

  function clmnWin(brBl) {

    console.log('In clmnWin...');
    // Searching for the columns with winnig 
    // combination of booleans...

    // Collecting column cells into row-subarrays...
    const clmnsArr = [[], [], []];

    for (let m = 0; m < 3; m++) {
      for (let n = 0; n < 3; n++) {
        // Transposing original matrix...
        clmnsArr[n].push(brBl[m][n]);
      }
    }

    // All columns are presented as the rows,
    // use rowWin() to find winning state...
    return rowWin(clmnsArr);
  }

  function dgnlWin(dgl) {

    console.log('In dgnlWin...');
    // Evaluating either of diagonals...
    if (dgl[0] === true && dgl[1] === true && dgl[2] === true) {
      // Winning state for maximizer...
      return true;
    }

    if (dgl[0] === false && dgl[1] === false && dgl[2] === false) {
      // Winning state for minimizer...
      return false;
    }

    // No winning state on diagonals...
    return null;
  }

  function diagWin_NW(brBl) {

    console.log('In dgnlWin_NW...');
    // North-West diagonal...
    // Presenting diagonal cells as a row,
    // starting from upper-left hand, going
    // down to low-right hand cell...
    const diagNW = [];
    for (let m = 0; m < 3; m++) {
      for (let n = 0; n < 3; n++) {
        if (m === n) {
          diagNW.push(brBl[n][n]);
        }
      }
    }

    return dgnlWin(diagNW);
  }

  function diagWin_NE(brBl) {

    console.log('In dgnlWin_NE...');
    // North-East diagonal...
    // Presenting diagonal cells as a row,
    // starting from upper-right hand, going
    // down to low-left hand cell...
    const diagNE = [];

    for (let m = 0; m < 3; m++) {
      for (let l = 2; l > -1; l--) {
        if (l === Math.abs(m - 2)) {
          diagNE.push(brBl[m][l]);
        }
      }
    }
    return dgnlWin(diagNE);
  }

  function rmngMvsBl(brBl) {

    console.log('In rmngMvsBl...');
    // Looking for available (remaining) moves
    // initialized with null...
    const nllArr = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (brBl[i][j] === null) {
          nllArr.push([i, j]);
        }
      }
    }
    return nllArr;
  }

  function cpyNllArr(nllArr, depthCount, currPlr) {
   
    console.log('In cpyNllArr...');
    // Depth Count is an equivalent of consequent 
    // number of function's call in recursive fashion...
    // This should allow to keep together all the 
    // remaining moves at particualr level of depth, 
    // which are nodes at the root of their sub-branches...

    const extArr = [[]];

    if (nllArr.length === 0) {
      // No moves left...
      return extArr;
    }

    for (let i = 0; i < nllArr.length; i++) {
       
        let nArr = [0, null, 0, 0];

        nArr[0] = depthCount;
        nArr[1] = currPlr;

        for(let j = 0; j < nllArr[i].length; j++) {
        
          nArr[j + 2] = nllArr[i][j];

        }
       
        extArr[i] = nArr;
    }

    return extArr;
         
  }

  ////////////////////////////////////////////Mark_McDonnell...
  //
  // http://www.integralist.co.uk/posts/functional-recursive-javascript-programming/
  //
  function trampoline(f) {

    // This trampolining technique described by 
    // Mark McDonnell in his article referenced
    // above...

    while (f && f instanceof Function) {
      f = f();
    }

    return f;
  }

  function miMa(brStBl, cPl) {
  //
  ////////////////////////////////////////////Mark_McDonnell...

    //Wrap-up function for trampolining implementation...

    console.log('In miMa... "this" is "window"... ');

    function miniMax(brdStateBl, currPlr) {
      ///////////////////////////////////////////////////////////////
      //                                                           //
      //  My first research for the implementation comes from:     //
      //                                                           //
      // Ahmad Abdolsaheb                                          //
      // https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
      // https://codepen.io/abdolsa/pen/mABGoz?editors=1011        //
      // https://github.com/ahmadabdolsaheb/minimaxarticle         //
      //                                                           //
      ///////////////////////////////////////////////////////////////

      console.log('In miniMax...')

      // Depth Counter is sequential number representing
      // an instance of miniMax call...
      let dpthCntr = TacProcHndlr.depthCounter;
      dpthCntr += 1;
      TacProcHndlr.depthCounter = dpthCntr;

      ///////////////////////////////////////////////////////////////
      //
      //   First Section Of The miniMax Function
      // is:
      //
      // Check for a terminal state of the game.
      //
      // This would be a win for either of players (1, -1).
      //
      // Additionally, check for the draw (0) using 
      // rnmgMvsBl()...
      // In any case, rnmgMvsBl() will create new array of 
      // available moves, and if it is empty - this would 
      // be a draw state...
      //
      // If there are terminal states, the function 
      // breaks out in the First Section.
      //
      // Otherwise it proceeds with crrTerSt === null...
      //
      ///////////////////////////////////////////////////////////////

      let crrTerSt = termState(brdStateBl);

      // The new array of available moves is for
      // deciding upon draw condition as the 
      // third terminal state...
      const nllArr = rmngMvsBl(brdStateBl);
      
      const termNllArr = cpyNllArr(nllArr, dpthCntr, currPlr);

      if (!isNaN(crrTerSt) && (nllArr.length === 0)) {
        // The value of terminal state for the 
        // draw condition...
        crrTerSt = 0;
        
      }

      if (crrTerSt !== null) {
        // Returns terminal state value (1, -1, or 0)...
    
        return crrTerSt;
      }

      ///////////////////////////////////////////////////////////////
      //
      //  Second Section Of The miniMax Function
      // is:
      //
      // Moving depth-first along the game tree from the 
      // most left branch and checking all the leafs for 
      // terminal states...
      //
      // Make a copy of nllArr - current available moves - to keep:
      //
      // a) sequential number of function's call;
      //
      // b) current player - =true= or =false= (X or O); 
      //
      // c) node's coordinates (terminal states) associated 
      //    with them;
      //
      // d) added later - utility value of the node...
      //
      ///////////////////////////////////////////////////////////////

      const parntNodes = [];

      for (let i = 0; i < termNllArr.length; i++) {
        // For each available move creates a child copy of
        // the array brdStateBl...

        let childNode = [];

        // Indexes of available move in the current state of
        // the board: brdStateBl...
        const idxI = termNllArr[i][2];
        const idxJ = termNllArr[i][3];

        if (currPlr) {
          ///////////////////////////////////////////////////////////
          // -true-  is Player_1 (or AI, or "X")...
          // -false- is Player_2 (or "O")...
          //
          // New state of the boolean board as if current player made
          // the move "i"...
          //
          // The previous state of that cell was "null"...
          ///////////////////////////////////////////////////////////

          brdStateBl[idxI][idxJ] = true;

          ///////////////////////////////////////////////////////////
          //
          // Calling miniMax for evaluating opponent's possible moves
          // with the new state of the board and the player being the
          // opponent to current one (-false- is Player 2)...
          //
          ///////////////////////////////////////////////////////////

          const utilVal_1 = miniMax(brdStateBl, false);

          // Saving returned terminal state in the array for 
          // miniMax evaluation...
          if (!isNaN(utilVal_1)) {

            // Copying entire child node as sub-array, which is
            // four-element object, and then saving utility value
            // as a fifth element...
            childNode = termNllArr[i].slice();
            childNode[4] = utilVal_1;
            
          } else {

            childNode = utilVal_1.slice();

          }

          // Returning the board to previous state...

          brdStateBl[idxI][idxJ] = null;

        } else {

          // The same for the opponent (Player 2 - -false-)...

          brdStateBl[idxI][idxJ] = false;

          const utilVal_2 = miniMax(brdStateBl, true);
         
          if (!isNaN(utilVal_2)) {

            childNode = termNllArr[i].slice();
            childNode[4] = utilVal_2;

          } else {

            childNode = utilVal_2.slice();

          }

          brdStateBl[idxI][idxJ] = null;

        }

        parntNodes.push(childNode);

      }

      ///////////////////////////////////////////////////////////////
      //
      //  Third Section Of The miniMax Function
      // is:
      //
      // Finding the best move based on trmNllArr - collected 
      // terminal states of the children...
      //
      ///////////////////////////////////////////////////////////////

      let theMove;

      if (currPlr) {
        // Maximaizing for the AI player (Player 1 - -true-)...
                  
        let maxVal = -1000; 

        for (let i = 0; i < parntNodes.length; i++) {

          // Looping through the current array of possible moves...
         
          if (parntNodes[i][4] > maxVal) {
            
            maxVal = parntNodes[i][4];

            // Save the move that changed maxVal...
            theMove = i;

          }
        }

      } else {
        // Minimaizing for the second player...

        let minVal = 1000; 
       
        for (let i = 0; i < parntNodes.length; i++) {

          if (parntNodes[i][4] < minVal) {
           
            minVal = parntNodes[i][4];
       
            theMove = i;

          }
        }
      }

      // Exiting from miniMax: Returning the next move 
      // whatever the player is...
      return parntNodes[theMove];

    }

    ////////////////////////////////////////////////Mark_McDonnell...
    return trampoline(miniMax.bind(null, brStBl, cPl));
    ////////////////////////////////////////////////Mark_McDonnell...

  } 

  ///////////////////////////////////////////////////////////////////
  // The End of wrapping function miMa()...
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  //    The End of MiniMax functions...
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  //
  //    Yaht-Tac Game's objects
  //
  ///////////////////////////////////////////////////////////////////

  // Object to maintain DOM elements...
  const TacUIdomHndlr = {
    objName: 'TacUIdomHndlr',
    init: initDOM,
    rndrAttach: renderHTML,
    rndrBrd: renderBrd,
    rndrRow: renderRow,
    rndrScr: renderScr,
    extClls: addExtClasses,
    addEvLstnrs: loadLstnrs,
    compHdr: chsCompHndlr,
    rvrsCmpChc: rvrsCmpChoice,
    diceHdr: diceHndlr,
    rstHdr: restHndlr,
    brdCells: [[], [], [], [], []],
    chsAIlstnr: [],
    diceRll: false

  };

  // Main Application Object...
  const TacAppHndlr = {
    objName: 'TacAppHndlr',
    init: init,
    impTacUI: importTacUIdom,
    bldTacUI: buildTacUIdom,
    mvHndlr: moveHandlr,
    rstGm: resetGame,
    rllDie: rollTheDice,
    extCllsArr: [],
    flgAI: false,
    flgGo: true,
    flgRoll_1: false,
    flgRoll_2: false,
    flgMov_1: false,
    flgMov_2: false,
    AI_1_Flg: false,
    AI_2_Flg: false,
    diceFlg: false

  };

  // The Game logic processing handler.
  // Keeper of the game's state data...
  const TacProcHndlr = {
    objName: 'TacProcHndlr',
    init: initProc,
    rndrArrBrd: brdStructBln,
    chkWin: chckForWin,
    rmMvs: rmngMoves,
    frstMvAI: frstMoveAI,
    scndMvAI: scndMoveAI,
    thrdPlsMvAI: thrdPlusMoveAI,
    blckWinO: blockWinO,
    brdMnMx: [[null, null, null], [null, null, null], [null, null, null]],
    arrX: [],
    arrO: [],
    ptrnWin3x3: [],
    posPndWinO: [],
    winPndFlgO: false,
    posPndO: [],
    moveCodes: [['^lt', '~t', '^rt'], ['~l', '+', '~r'], ['^lb', '~b', '^rb']],
    movNum: 0,
    extDpldFlg: false,
    depthCounter: 0,
    currPlayer: true
    //////////////////////////////////////////////////////////////////////
    // Attached to TacProcHndlr structure.
    // Created dynamically within initProc():
    //
    // gmProc.brdCllsBln = two-dimensial array with boolean data
    // to use for AI calculations (all null)...
    //
    // gmProc.cllLstnrsBln = two-dimensial array with boolean data
    // to use for listeners tracking and resetting (initially false)...
    //
    // gmProc.cllsWnScr = two-dimensial array with boolean data
    // to use for calculation of winner terminal state...
    //
    //////////////////////////////////////////////////////////////////////
  };

  TacAppHndlr.init();

});
