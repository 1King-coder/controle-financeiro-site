import styled from "styled-components";
import * as colors from "../../config/colors";

export const Title = styled.h1`
  color: ${colors.secondaryColor};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
`

export const SubTitle1 = styled.h2`
  color: ${colors.secondaryColor};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
  margin-top: 3rem;
`

export const SubTitle2 = styled.h3`
  color: ${colors.secondaryColor};
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  background-color: ${colors.primaryColor};
  padding: 10px;
  width: 100%;
  margin-top: 0.1rem;
`

export const WeekDayGastosDiv = styled.div`
  display: inline-block;  
  width: 10rem;
  height: 15rem;
  overflow-y: scroll;
  margin: 10px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: ${colors.primaryColor};
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const TimeIntervalOptionsDiv = styled.div`
  display: flex;
  height: 5%;
  width: 100%;
  padding: 10px;
  justify-content: center;
`