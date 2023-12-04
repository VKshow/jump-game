import { useState, useEffect, useRef } from "react";

import './style.css';

import enemyPic from "./enemy.gif";
import charPic from "./char.gif";
import mouse from "./mouse.png";
import arrow from "./arrow.png";

const GameTimer = ({ gameStart, seconds, setSeconds }) => {
  useEffect(() => {
    console.log("gameStart", gameStart);
    let interval = null;

    if (gameStart) {
      console.log("I was here!");
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      console.log(`clearing Interval ${interval}`);
      clearInterval(interval);
    };
  }, [gameStart]);

  return (
    <div>
      <h2 className="game-timer">Time Spent: {seconds} seconds</h2>
    </div>
  );
};

//timer finish

const CollMesage = () => {
  return <div className="coll-message">GAME OVER</div>;
};

//game over message finish

const Char = ({ charPosition, charRef }) => {
  return (
    <div
      ref={charRef}
      className="char"
      style={{ bottom: `${charPosition.current}px` }}
    >
      <img src={charPic} alt="warrior" />
    </div>
  );
};

//char finish

const Enemy = ({ enemyRefs, enemyPosition, enemyArr }) => {
  return (
    <div
      className="enemyContainer"
      style={{ right: `${enemyPosition}px`, height: `100Vh` }}
    >
      {enemyArr.map((enemy, i) => {
        return (
          <div
            key={i}
            ref={(el) => (enemyRefs.current[i] = el)}
            className="enemy"
            style={{ left: `${enemy.left}px`, top: `${enemy.top}px` }}
          >
            <img src={enemyPic} alt="warrior" />
          </div>
        );
      })}
    </div>
  );
};

//enemy finish

const Instructions = () => {
  const [instructions, setInstructions] = useState(true);

  const closeInstr = () => {
    setInstructions(false);
    console.log("instructions");
  };
  useEffect(() => {
    console.log(instructions);
  }, [instructions]);

  return (
    <div className={`instr-block ${!instructions ? "hidden" : ""}`}>
      <div className="instr-block-info">
        <div className="info-img">
          <img src={mouse} alt="img" />
        </div>
        <p className="info-content">Click/Tap to Jump!</p>
      </div>
      <div className="instr-block-info">
        <div className="info-img">
          <img src={arrow} alt="img" />
        </div>
        <p className="info-content">Jump up, Appear from down</p>
      </div>
      <button className="btn" onClick={closeInstr}>
        ok
      </button>
    </div>
  );
};

//instructions finish

const App = () => {
  const charPosition = useRef(100);
  const charRef = useRef();
  const enemyRefs = useRef([]);
  const [enemyPosition, setEnemyPosition] = useState(-10000);
  const [gameStart, setGameStart] = useState(false);
  const [enemyArr, setEnemyArr] = useState([0]);
  const [collision, setCollision] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [windowHeight, setWindowHeight] = useState();

  const gameStartBtn = () => {
    setGameStart(true);
    setEnemyPosition(-10000);
    setCollision(false);
    setSeconds(0);
    setWindowHeight(window.innerHeight);

    const enemyIncr = new Array(100).fill(0).map((item) => {
      const randomLeftPosition = Math.random() * 12000;
      const randomTopPosition = Math.random() * 900;

      return {
        ...item,
        left: randomLeftPosition,
        top: randomTopPosition,
      };
    });

    setEnemyArr(enemyIncr);
  };

  //gameStart finish

  const gameStopBtn = () => {
    setGameStart(false);
  };
  //game stop finish

  useEffect(() => {
    const mouseClick = (event) => {
      if (event.button === 0 && gameStart) {
        console.log("Left mouse button clicked!");
        if (charPosition.current > windowHeight - 10) {
          charPosition.current = 70;
        } else {
          charPosition.current += 70;
        }
      }
    };

    window.addEventListener("mousedown", mouseClick);

    return () => {
      window.removeEventListener("mousedown", mouseClick);
    };
  }, [gameStart]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (charPosition.current > 100) {
        charPosition.current -= 25;
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [gameStart]);

  //char finish

  useEffect(() => {
    let enemyMoving;

    if (gameStart) {
      enemyMoving = setInterval(() => {
        setEnemyPosition((prevPos) => prevPos + 15);

        const charRect = charRef.current.getBoundingClientRect();
        enemyRefs.current.forEach((enemyRef, i) => {
          const enemyRect = enemyRef.getBoundingClientRect();
          if (
            charRect.x < enemyRect.x + enemyRect.width &&
            charRect.x + charRect.width > enemyRect.x &&
            charRect.y < enemyRect.y + enemyRect.height &&
            charRect.y + charRect.height > enemyRect.y
          ) {
            setCollision(true);
            setGameStart(false);
          }
        });
      }, 100);
    }

    return () => clearInterval(enemyMoving);
  }, [gameStart]);

  //enemy finish

  return (
    <>
      <div className="play-field">
        <Char charPosition={charPosition} charRef={charRef} />
        <Enemy
          enemyRefs={enemyRefs}
          enemyPosition={enemyPosition}
          enemyArr={enemyArr}
        />
        <div className="btn-group">
          <button className="btn" onClick={gameStartBtn}>
            Start
          </button>
          <button className="btn" onClick={gameStopBtn}>
            Stop
          </button>

          <GameTimer
            gameStart={gameStart}
            seconds={seconds}
            setSeconds={setSeconds}
          />
          {collision && <CollMesage />}
        </div>
      </div>
      <Instructions />
    </>
  );
};

export default App;
