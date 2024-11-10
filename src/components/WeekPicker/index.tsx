import { styled } from '@mui/material/styles';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {  DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from 'react';
import * as colors from "../../config/colors";
interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: colors.primaryColor,
    color: colors.secondaryColor,
    fontWeight: 'bold',
    '&:hover, &:focus': {
      backgroundColor: colors.primaryColor,
    },
  }),
  ...(isHovered && {
    backgroundColor: colors.lightPrimartyColor,
    color: colors.tertiaryColor,
    '&:hover, &:focus': {
      backgroundColor: colors.lightPrimartyColor,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: colors.primaryColor,
      '&:hover, &:focus': {
        backgroundColor: colors.primaryColor,
      },
    }),
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, 'week');
};

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  },
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export default function WeekPicker(props: any): JSX.Element {
  const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={props.value}
        onChange={props.onChange}
        format='DD/MM/YYYY'
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6}
        slots={{ day: Day }}
        slotProps={{
          day: (ownerState) =>
            ({
              selectedDay: props.value,
              hoveredDay,
              onPointerEnter: () => setHoveredDay(ownerState.day),
              onPointerLeave: () => setHoveredDay(null),
            }) as any,
        }}
      />
    </LocalizationProvider>
  );
}