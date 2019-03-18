import React, { Component } from 'react';
import './App.css';

import KeyboardLetter from './KeyboardLetter';

const LETTERS = 'AZERTYUIOPQSDFGHJKLMWXCVBN'
const PHRASES_BANK = ['AZINCOURT', 'SHERPA', 'HUAWEI', 'GALIPOLI', 'FLAUBERT', 'MICROSOFT', 'BOTTLE', 'MANIFESTO', 'ZINC', 'SHIRT']
const HANGMAN_SCHEME_ROOT = [[10, 290, 180, 290], [85, 290, 85, 20], [85, 20, 250, 20], [250, 20, 250, 120], [250, 150, 30], [250, 180, 250, 210], [250, 210, 230, 230], [250, 210, 270, 230], [250, 195, 240, 185], [250, 195, 260, 185]]
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      letters: LETTERS.split(""),
      phrase: PHRASES_BANK[Math.floor(Math.random() * 10)],
      usedLetters: [],
      gameOn: true,
      resultMsg: "Game Over",
      misses: 0,
    }
  }

  // Produit une représentation textuelle de l’état de la partie,
  // chaque lettre non découverte étant représentée par un _underscore_.
  // (CSS assurera de l’espacement entre les lettres pour mieux
  // visualiser le tout).
  computeDisplay(phrase, usedLetters) {
    return phrase.replace(/\w/g,
      (letter) => (usedLetters.includes(letter) ? letter : '_')
    )
  }

  getLetterClickState = (letter) => (
    this.state.usedLetters.includes(letter) && 'hasBeenClicked'
  )

  handleLetterClick = letter => {
    const phrase = this.state.phrase
    const usedLetters = this.state.usedLetters
    if (usedLetters.includes(letter)) {
      return
    }
    if (!phrase.includes(letter)) {
      const countMiss = this.state.misses + 1
      this.drawMan(countMiss)
      countMiss === 10 ? this.setState({ gameOn: false }) : this.setState({ misses: countMiss })
    }
    usedLetters.push(letter)
    this.setState({ usedLetters: usedLetters })
    this.computeDisplay(phrase, usedLetters).search('_') === -1 && this.setState({ gameOn: false, resultMsg: 'Good Job !' })
  }

  drawMan(countMiss) {
    const coordonates = HANGMAN_SCHEME_ROOT[countMiss - 1]
    var canvas = document.getElementById("myCanvas")
    var ctx = canvas.getContext("2d")
    if (countMiss === 5) {
      ctx.beginPath()
      ctx.arc(coordonates[0], coordonates[1], coordonates[2], 0, 2 * Math.PI)
      ctx.closePath()
      ctx.stroke()
      return
    }
    ctx.beginPath()
    ctx.moveTo(coordonates[0], coordonates[1])
    ctx.lineTo(coordonates[2], coordonates[3])
    ctx.closePath()
    ctx.stroke()
  }

  restart = () => {
    this.setState({
      phrase: PHRASES_BANK[Math.floor(Math.random() * 5)],
      usedLetters: [],
      gameOn: true,
      resultMsg: "Game Over",
      misses: 0,
    })
    var c = document.getElementById("myCanvas")
    var ctx = c.getContext("2d")
    ctx.beginPath()
    ctx.clearRect(0, 0, 400, 300)
    ctx.closePath()
  }

  render() {
    const { letters, phrase, usedLetters, gameOn, resultMsg, misses } = this.state
    return (
      <div className="hangman">
        <h1>Welcome to the Hangman show !</h1>
        <canvas id="myCanvas" width="400" height="300"></canvas>
        <p id="try"><i>{10-misses} try left</i></p>
        <p>{this.computeDisplay(phrase, usedLetters)}</p>
        {gameOn ? letters.map((letter, index) => (
          <KeyboardLetter
            letter={letter}
            key={index}
            state={this.getLetterClickState(letter)}
            onClick={this.handleLetterClick} />
        )) :
          <div>
            <p>{resultMsg}</p>
            {resultMsg === "Game Over" && <p>The answer was <b>{phrase}</b></p>}
            <button type="button" onClick={this.restart}>One more time !</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
