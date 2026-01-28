import styled from "styled-components";
import { primaryColor, secondaryColor } from "../../config/colors";

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  color: ${secondaryColor};
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid ${primaryColor};
`;

export const Subtitle = styled.h3`
  color: ${secondaryColor};
  font-size: 22px;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 15px;
`;

export const Paragraph = styled.p`
  color: rgb(68, 68, 68);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
`;

export const StyledLink = styled.a`
  color: ${primaryColor};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${secondaryColor};
    text-decoration: underline;
  }
`;

export const List = styled.ul`
  color: rgb(68, 68, 68);
  margin-left: 20px;
  margin-bottom: 15px;
  line-height: 1.6;
`;

export const ListItem = styled.li`
  margin-bottom: 10px;
  font-size: 16px;
`;

export const OrderedList = styled.ol`
  color: rgb(68, 68, 68);
  margin-left: 20px;
  margin-bottom: 15px;
  line-height: 1.6;
`;
