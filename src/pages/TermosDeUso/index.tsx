import React from "react";
import { Container } from "../../styles/GlobalStyles";
import {
  ContentWrapper,
  Title,
  Subtitle,
  Paragraph,
  StyledLink,
  OrderedList,
  ListItem,
} from "./styled";

export default function TermosDeUso(): JSX.Element {
  return (
    <Container>
      <Title>Termos de uso</Title>
      <ContentWrapper>
        <Title>1. Termos</Title>
        <Paragraph>
          Ao acessar ao site{" "}
          <StyledLink href="https://ctrl-fin.vsbdev.com.br">
            Controle Financeiro VSBDEV
          </StyledLink>
          , concorda em cumprir estes termos de serviço, todas as leis e
          regulamentos aplicáveis ​​e concorda que é responsável pelo
          cumprimento de todas as leis locais aplicáveis. Se você não concordar
          com algum desses termos, está proibido de usar ou acessar este site.
          Os materiais contidos neste site são protegidos pelas leis de direitos
          autorais e marcas comerciais aplicáveis.
        </Paragraph>

        <Title>2. Uso de Licença</Title>
        <Paragraph>
          É concedida permissão para baixar temporariamente uma cópia dos
          materiais (informações ou software) no site Controle Financeiro
          VSBDEV, apenas para visualização transitória pessoal e não comercial.
          Esta é a concessão de uma licença, não uma transferência de título e,
          sob esta licença, você não pode:
        </Paragraph>
        <OrderedList>
          <ListItem>modificar ou copiar os materiais;</ListItem>
          <ListItem>
            usar os materiais para qualquer finalidade comercial ou para
            exibição pública (comercial ou não comercial);
          </ListItem>
          <ListItem>
            tentar descompilar ou fazer engenharia reversa de qualquer software
            contido no site Controle Financeiro VSBDEV;
          </ListItem>
          <ListItem>
            remover quaisquer direitos autorais ou outras notações de
            propriedade dos materiais; ou
          </ListItem>
          <ListItem>
            transferir os materiais para outra pessoa ou 'espelhe' os materiais
            em qualquer outro servidor.
          </ListItem>
        </OrderedList>
        <Paragraph>
          Esta licença será automaticamente rescindida se você violar alguma
          dessas restrições e poderá ser rescindida por Controle Financeiro
          VSBDEV a qualquer momento. Ao encerrar a visualização desses materiais
          ou após o término desta licença, você deve apagar todos os materiais
          baixados em sua posse, seja em formato eletrónico ou impresso.
        </Paragraph>

        <Title>3. Isenção de responsabilidade</Title>
        <OrderedList>
          <ListItem>
            Os materiais no site da Controle Financeiro VSBDEV são fornecidos
            'como estão'. Controle Financeiro VSBDEV não oferece garantias,
            expressas ou implícitas, e, por este meio, isenta e nega todas as
            outras garantias, incluindo, sem limitação, garantias implícitas ou
            condições de comercialização, adequação a um fim específico ou não
            violação de propriedade intelectual ou outra violação de direitos.
          </ListItem>
          <ListItem>
            Além disso, o Controle Financeiro VSBDEV não garante ou faz qualquer
            representação relativa à precisão, aos resultados prováveis ​​ou à
            confiabilidade do uso dos materiais em seu site ou de outra forma
            relacionado a esses materiais ou em sites vinculados a este site.
          </ListItem>
        </OrderedList>

        <Title>4. Limitações</Title>
        <Paragraph>
          Em nenhum caso o Controle Financeiro VSBDEV ou seus fornecedores serão
          responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos
          por perda de dados ou lucro ou devido a interrupção dos negócios)
          decorrentes do uso ou da incapacidade de usar os materiais em Controle
          Financeiro VSBDEV, mesmo que Controle Financeiro VSBDEV ou um
          representante autorizado da Controle Financeiro VSBDEV tenha sido
          notificado oralmente ou por escrito da possibilidade de tais danos.
          Como algumas jurisdições não permitem limitações em garantias
          implícitas, ou limitações de responsabilidade por danos conseqüentes
          ou incidentais, essas limitações podem não se aplicar a você.
        </Paragraph>

        <Title>5. Precisão dos materiais</Title>
        <Paragraph>
          Os materiais exibidos no site da Controle Financeiro VSBDEV podem
          incluir erros técnicos, tipográficos ou fotográficos. Controle
          Financeiro VSBDEV não garante que qualquer material em seu site seja
          preciso, completo ou atual. Controle Financeiro VSBDEV pode fazer
          alterações nos materiais contidos em seu site a qualquer momento, sem
          aviso prévio. No entanto, Controle Financeiro VSBDEV não se compromete
          a atualizar os materiais.
        </Paragraph>

        <Title>6. Links</Title>
        <Paragraph>
          O Controle Financeiro VSBDEV não analisou todos os sites vinculados ao
          seu site e não é responsável pelo conteúdo de nenhum site vinculado. A
          inclusão de qualquer link não implica endosso por Controle Financeiro
          VSBDEV do site. O uso de qualquer site vinculado é por conta e risco
          do usuário.
        </Paragraph>

        <Subtitle>Modificações</Subtitle>
        <Paragraph>
          O Controle Financeiro VSBDEV pode revisar estes termos de serviço do
          site a qualquer momento, sem aviso prévio. Ao usar este site, você
          concorda em ficar vinculado à versão atual desses termos de serviço.
        </Paragraph>

        <Subtitle>Lei aplicável</Subtitle>
        <Paragraph>
          Estes termos e condições são regidos e interpretados de acordo com as
          leis do Controle Financeiro VSBDEV e você se submete irrevogavelmente
          à jurisdição exclusiva dos tribunais naquele estado ou localidade.
        </Paragraph>
      </ContentWrapper>
    </Container>
  );
}
