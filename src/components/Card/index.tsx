import { CardType } from "../../types/CardType";
import * as C from "./styles";
import b7Svg from "../../svgs/b7.svg";
import { items } from "../../data/items";

type Props = {
  item: CardType;
  onClick: () => void;
};

export const Card = ({ item, onClick }: Props) => {
  return (
    <C.Container
      showBackground={item.permanentShow || item.show}
      onClick={onClick}
    >
      {!item.permanentShow && !item.show && (
        <C.Icon src={b7Svg} alt="" opacity={0.1} />
      )}
      {(item.permanentShow || item.show) && item.item !== null && (
        <C.Icon src={items[item.item].icon} alt="" />
      )}
    </C.Container>
  );
};
