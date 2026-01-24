import React from "react";
import { Title } from "../../styles/GlobalStyles";
import SubscriptionPlans from "../../components/SubscriptionPlans";
import { useAuth } from "../../services/useAuth";
import history from "../../services/history";
import {
  SubscriptionPageContainer,
  InfoSection,
  BenefitsSection,
  BenefitsGrid,
  BenefitCard,
  BenefitIcon,
  BenefitTitle,
  BenefitDescription,
} from "./styled";

export default function SubscriptionPage(): JSX.Element {
  const { user } = useAuth();

  React.useEffect(() => {
    // If user has subscription, redirect to home
    if (user?.hasSubscription) {
      history.replace("/");
    }
  }, [user]);

  const handleSubscriptionClick = () => {
    // Optional: Handle any logic after subscription click
    console.log("Subscription plan selected");
  };

  return (
    <SubscriptionPageContainer>
      <Title>Planos de Assinatura</Title>

      <InfoSection>
        <h2>Por que se inscrever?</h2>
        <p>
          Desbloqueie todo o potencial do sistema de controle financeiro com
          recursos premium que ajudam você a gerenciar melhor suas finanças.
          Veja como a ferramenta funciona:{" "}
          <a
            href="https://www.youtube.com/playlist?list=PLR5jS4ueIBrkjYIxGmH6kH5BJVj4WDkoV"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tutorial
          </a>
        </p>
      </InfoSection>

      <BenefitsSection>
        <h3>O que você ganha com uma assinatura:</h3>
        <BenefitsGrid>
          <BenefitCard>
            <BenefitIcon>📊</BenefitIcon>
            <BenefitTitle>Envie Dados por planilha</BenefitTitle>
            <BenefitDescription>
              Importe seus gastos, depósitos e transferências facilmente usando
              arquivos Excel. Economize tempo e mantenha seus registros
              financeiros atualizados sem esforço utilizando nosso modelo.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>💰</BenefitIcon>
            <BenefitTitle>
              Visualização de Gastos e depósitos detalhada
            </BenefitTitle>
            <BenefitDescription>
              Acompanhe seus gastos e depósitos com filtros avançados e exporte
              eles em planilhas. Nunca perca de vista para onde seu dinheiro
              está indo e de onde está vindo.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>📱</BenefitIcon>
            <BenefitTitle>Suporte Prioritário</BenefitTitle>
            <BenefitDescription>
              Receba suporte rápido e prioritário via email sempre que precisar.
            </BenefitDescription>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      <SubscriptionPlans onSubscriptionClick={handleSubscriptionClick} />
    </SubscriptionPageContainer>
  );
}
