import { MenuItemStylesParams, CSSObject  } from 'react-pro-sidebar';

export interface MenuItemStyles {
  root?: ElementStyles;
  button?: ElementStyles;
  label?: ElementStyles;
  prefix?: ElementStyles;
  suffix?: ElementStyles;
  icon?: ElementStyles;
  subMenuContent?: ElementStyles;
  SubMenuExpandIcon?: ElementStyles;
}

export type ElementStyles = CSSObject | ((params: MenuItemStylesParams) => CSSObject | undefined);