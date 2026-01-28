import React from "react";
import {
  FooterContainer,
  FooterContent,
  Copyright,
  FooterLinks,
  FooterLink,
  Separator,
} from "./styled";

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {currentYear} Vitos do S. Barcelos. Todos os direitos reservados.
        </Copyright>
      </FooterContent>
      <FooterLinks>
        <FooterLink to="/politica-de-privacidade">
          Política de Privacidade
        </FooterLink>
        <Separator>|</Separator>
        <FooterLink to="/termos-de-uso">Termos de uso</FooterLink>
      </FooterLinks>
    </FooterContainer>
  );
}
