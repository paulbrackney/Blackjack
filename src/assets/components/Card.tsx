import "../../App.css";

interface Cards {
  name: String;
  suit: String;
}

function Card(props: Cards) {
  let extraClass = props.suit === "♦" || props.suit === "♥" ? "red" : "black";

  return (
    <div className="rectangle" style={{ marginLeft: 5, marginRight: 5 }}>
      <div className={extraClass + " top"}>{`${props.name}${props.suit}`}</div>
      <div
        className={extraClass + " bottom"}
      >{`${props.name}${props.suit}`}</div>
    </div>
  );
}

export default Card;
