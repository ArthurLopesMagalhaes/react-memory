import { useEffect, useState } from "react";
import * as C from "./App.styles";
import logoImage from "./assets/devmemory_logo.png";
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import buttonIcon from "./svgs/restart.svg";
import { CardType } from "./types/CardType";
import { items } from "./data/items";
import { Card } from "./components/Card";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<CardType[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeElapsed, playing]);

  useEffect(() => {
    if (showCount === 2) {
      let opened = gridItems.filter((item) => item.show === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          let tempGrid = [...gridItems];
          tempGrid.forEach((item) => {
            if (item.show) {
              item.permanentShow = true;
              item.show = false;
            }
          });
          setGridItems(tempGrid);
          setShowCount(0);
        } else {
          setTimeout(() => {
            let tempGrid = [...gridItems];
            tempGrid.forEach((item) => (item.show = false));
            setGridItems(tempGrid);
            setShowCount(0);
          }, 1000);
        }
        setMoveCount(moveCount + 1);
      }
    }
  }, [showCount, gridItems]);

  useEffect(() => {
    if (
      moveCount > 0 &&
      gridItems.every((item) => {
        item.permanentShow === true;
      })
    ) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);

  const resetGame = () => {
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCount(0);

    let tempGrid: CardType[] = [];
    for (let i = 0; i < items.length * 2; i++) {
      tempGrid.push({
        item: null,
        show: false,
        permanentShow: false,
      });
    }

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let position = -1;
        while (position < 0 || tempGrid[position].item !== null) {
          position = Math.floor(Math.random() * (items.length * 2));
        }
        tempGrid[position].item = i;
      }
    }

    setGridItems(tempGrid);
    setPlaying(true);
  };

  const hanldeItemClcik = (index: number) => {
    if (playing && index !== null && showCount < 2) {
      let tempGrid = [...gridItems];

      if (!tempGrid[index].permanentShow && !tempGrid[index].show) {
        tempGrid[index].show = true;
        setShowCount(showCount + 1);
      }

      setGridItems(tempGrid);
    }
  };

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} alt="logo" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo:" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos:" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={buttonIcon} onClick={resetGame} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <Card
              key={index}
              item={item}
              onClick={() => {
                hanldeItemClcik(index);
              }}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
};

export default App;
