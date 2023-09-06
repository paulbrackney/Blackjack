import { useState } from "react";
import "../../App.css";
import whiteChip from "../images/white-chip.png";
import blackChip from "../images/black-chip.png";
import blueChip from "../images/blue-chip.png";
import purpleChip from "../images/purple-chip.png";
import greenChip from "../images/green-chip.png";
import redChip from "../images/red-chip.png";
import Card from "../components/Card";

function Blackjack() {
  const [count, setCount] = useState(0);
  const [myCards, setMyCards] = useState<Cards[]>([]);
  const [dealerCards, setDealerCards] = useState<Cards[]>([]);
  const [myScore, setMyScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [playing, setPlaying] = useState(0);
  const [timeToAct, setTimeToAct] = useState(0);
  const [isBusted, setBusted] = useState(0);
  const [isBlackjack, setBlackjack] = useState(0);
  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(25);
  const [stood, setStood] = useState(0);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [push, setPush] = useState(0);
  const [remainingChips, setRemainingChips] = useState(75);

  let index = 0;
  let dealerIndex = 0;

  let suits = ["♥", "♠", "♣", "♦"];

  interface NameValuePair {
    name: String;
    value: number;
  }

  let nameValuePairs: NameValuePair[] = [
    { name: "A", value: 11 },
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "J", value: 10 },
    { name: "Q", value: 10 },
    { name: "K", value: 10 },
  ];

  interface Cards {
    name: String;
    suit: String;
    value: number;
  }

  const deck: Cards[] = [];

  function createCard(
    deck: Cards[],
    name: String,
    suit: String,
    value: number
  ) {
    let card: Cards = { name: name, suit: suit, value: value };
    deck.push(card);
  }

  suits.forEach((suit) => {
    nameValuePairs.forEach((item) => {
      return createCard(deck, item.name, suit, item.value);
    });
  });

  function increaseBet(newBet: number) {
    if (newBet <= remainingChips) {
      setBet(bet + newBet);
      setRemainingChips(chips - (bet + newBet));
    }
  }

  function startGame() {
    if (chips == 0) {
      setBet(0);
      setRemainingChips(0);
    } else if (chips < bet) {
      setBet(chips);
      setRemainingChips(0);
    } else {
      setChips(chips - bet);
      setRemainingChips(chips - bet);
    }
    setTimeToAct(1);
    setStood(0);
    setLoss(0);
    setWin(0);
    setBusted(0);
    setBlackjack(0);
    setPush(0);
    index = 0;
    dealerIndex = 0;
    let firstCard = Math.floor(Math.random() * 51);
    let secondCard = Math.floor(Math.random() * 51);
    const newCards = [...[], deck[firstCard], deck[secondCard]];
    setMyCards(newCards);
    setScore(newCards);
    setPlaying(1);

    let dealerFirst = Math.floor(Math.random() * 51);
    const dealerNew = [...[], deck[dealerFirst]];
    setDealerCards(dealerNew);
    setScoreDealer(dealerNew);
  }

  function setScore(newCards: Cards[]) {
    let newScore = 0;
    newCards.forEach((card) => {
      newScore += card.value;
    });
    setMyScore(newScore);
    checkWinOrBust(newScore, newCards);
  }

  function setScoreDealer(newCards: Cards[]) {
    let newScore = 0;
    newCards.forEach((card) => {
      newScore += card.value;
    });
    setDealerScore(newScore);
  }

  function dealCard() {
    let randomIndex = Math.floor(Math.random() * 51);
    const newCards = [...myCards, deck[randomIndex]];
    setMyCards(newCards);
    setScore(newCards);
  }

  function checkWinOrBust(score: number, newCards: Cards[]) {
    if (score > 21) {
      setBusted(1);
      setLoss(1);
      setTimeToAct(0);
    } else if (score === 21 && newCards.length == 2) {
      setBlackjack(1);
      setWin(1);
      setTimeToAct(0);
      setChips(chips + 1.5 * bet);
    } else if (score === 21) {
      setTimeToAct(0);
      dealersTurn(newCards, false);
    }
  }

  function dealersTurn(newCards: Cards[], isDoubledDown: boolean) {
    let newScore = 0;
    newCards.forEach((card) => {
      newScore += card.value;
    });
    let myLocalScore = newCards.length == 0 ? myScore : newScore;
    let myLocalBet = isDoubledDown ? bet * 3 : bet * 2;
    setStood(1);
    setTimeToAct(0);
    let score = dealerScore;
    let cards = dealerCards;
    while (score < 17) {
      let randomIndex = Math.floor(Math.random() * 51);
      cards = [...cards, deck[randomIndex]];
      score += deck[randomIndex].value;
    }
    if (score > 21) {
      setChips(chips + myLocalBet);
      setRemainingChips(chips + myLocalBet - bet);
      setWin(1);
    } else if (score < myLocalScore) {
      setChips(chips + myLocalBet);
      setRemainingChips(chips + myLocalBet - bet);
      setWin(1);
    } else if (score > myLocalScore) {
      if (isDoubledDown) {
        setChips(chips - bet);
        setRemainingChips(chips - bet);
      }
      setLoss(1);
    } else {
      setChips(chips + bet);
      setRemainingChips(chips);
      setPush(1);
    }
    setDealerCards(cards);
    setScoreDealer(cards);
  }

  function dealToDealer() {
    let randomIndex = Math.floor(Math.random() * 51);
    const newCards = [...dealerCards, deck[randomIndex]];
    setDealerCards(newCards);
    setScoreDealer(newCards);
  }

  function doubleDown() {
    let randomIndex = Math.floor(Math.random() * 51);
    const newCards = [...myCards, deck[randomIndex]];

    setMyCards(newCards);
    setScore(newCards);
    let newScore = 0;
    newCards.forEach((card) => {
      newScore += card.value;
    });
    setStood(1);
    setTimeToAct(0);
    if (newScore <= 21) {
      dealersTurn(newCards, true);
    } else {
      setLoss(1);
      setChips(chips - bet * 2);
      setRemainingChips(chips - bet * 3);
    }
  }

  function resetBet() {
    setBet(0);
    setRemainingChips(chips);
  }

  return (
    <div className="App">
      <div
        className="sidebar"
        style={timeToAct == 1 ? { pointerEvents: "none" } : {}}
      >
        <div>
          <p>Available chips: ${chips}</p>
          <p>Current bet: ${bet}</p>
        </div>
        <div>
          <button style={{ marginRight: 10 }} onClick={resetBet}>
            Reset Bet
          </button>
          <button
            style={{ marginLeft: 10 }}
            onClick={() => increaseBet(remainingChips)}
          >
            Go All-In
          </button>
        </div>
        <div>
          <img
            className="logo"
            src={whiteChip}
            onClick={() => increaseBet(1)}
          ></img>
          <p style={{ marginTop: -10 }}>$1</p>
        </div>
        <div>
          <img
            className="logo"
            src={redChip}
            onClick={() => increaseBet(5)}
          ></img>
          <p style={{ marginTop: -10 }}>$5</p>
        </div>
        <div>
          <img
            className="logo"
            src={blueChip}
            onClick={() => increaseBet(10)}
          ></img>
          <p style={{ marginTop: -10 }}>$10</p>
        </div>
        <div>
          <img
            className="logo"
            src={greenChip}
            onClick={() => increaseBet(25)}
          ></img>
          <p style={{ marginTop: -10 }}>$25</p>
        </div>
        <div>
          <img
            className="logo"
            src={blackChip}
            onClick={() => increaseBet(100)}
          ></img>
          <p style={{ marginTop: -10 }}>$100</p>
        </div>
        <div>
          <img
            className="logo"
            src={purpleChip}
            onClick={() => increaseBet(500)}
          ></img>
          <p style={{ marginTop: -10 }}>$500</p>
        </div>
      </div>
      <div className="container">
        <h1 className="blackjack">Blackjack</h1>
        <div className="attribution">
          {" "}
          Poker chip icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/iconsnova"
            title="IconsNova"
          >
            {" "}
            IconsNova{" "}
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <div className="card">
          {!playing || isBusted || isBlackjack || stood ? (
            <button onClick={startGame}>Deal Next Hand</button>
          ) : (
            ""
          )}
          {timeToAct ? (
            <div>
              <button
                onClick={dealCard}
                style={{ width: 130, marginRight: 10 }}
              >
                Hit
              </button>
              <button
                onClick={() => dealersTurn([], false)}
                style={{ width: 130, marginRight: 10, marginLeft: 10 }}
              >
                Stand
              </button>
              {remainingChips >= bet && myCards.length == 2 ? (
                <button
                  onClick={doubleDown}
                  style={{ width: 140, marginLeft: 10 }}
                >
                  Double Down
                </button>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <h2>
            {isBusted ? "Bust!" : ""}
            {isBlackjack ? "Blackjack! " : ""}
            {loss ? " Try again! " : ""}
            {win ? "Nice win!" : ""}
            {push ? "Push with dealer... try again!" : ""}
          </h2>
        </div>
        <div>
          {playing ? (
            <div>
              <h2>My Cards:</h2>
              <div style={{ display: "inline-block" }}>
                {myCards.map((item) => {
                  index += 1;
                  return (
                    <Card
                      suit={item.suit}
                      name={item.name}
                      key={`${item.name}${item.suit}${index}`}
                    ></Card>
                  );
                })}
              </div>
              <h3>{myScore}</h3>
              <h2>Dealer's Cards:</h2>
              <div style={{ display: "inline-block" }}>
                {dealerCards.map((item) => {
                  dealerIndex += 1;
                  return (
                    <Card
                      suit={item.suit}
                      name={item.name}
                      key={`${item.name}${item.suit}${dealerIndex}`}
                    ></Card>
                  );
                })}
              </div>
              <h3>{dealerScore}</h3>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Blackjack;
