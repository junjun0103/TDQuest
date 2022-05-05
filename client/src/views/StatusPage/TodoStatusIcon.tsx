import React from "react";
import styled from "styled-components";

// 아이콘 기본 크기 : 30px
// 필수입력값 : source = "아이콘이름.png" | string
// 옵션입력값 : name = "아이콘이름" | string
const Status_icon = styled.div<{ size?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
  img {
    width: ${(props) => props.size || "30px"};
    image-rendering: pixelated;
  }
  .completed_lists {
    justify-content: flex-end;
  }
  p {
    margin-left: 5px;
  }
`;

function TodoStatusIcon({
  source,
  name,
  size,
}: {
  source: string;
  name?: string;
  size?: string;
}) {
  return (
    <Status_icon size={size}>
      <img src={require(`../../static/images/${source}`)} alt={name} />
      <p>{name}</p>
    </Status_icon>
  );
}

export default TodoStatusIcon;
