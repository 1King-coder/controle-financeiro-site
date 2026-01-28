import React from "react";
import axios from "../../services/axios";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";
import {
  SubscriptionContainer,
  PlansGrid,
  PlanCard,
  PlanHeader,
  PlanTitle,
  PlanPrice,
  PlanDescription,
  FeaturesList,
  FeatureItem,
  SelectButton,
  LoadingMessage,
  ErrorMessage,
} from "./styled";

interface SubscriptionPlansProps {
  showTitle?: boolean;
  onSubscriptionClick?: () => void;
}

export default function SubscriptionPlans({
  showTitle = true,
  onSubscriptionClick,
}: SubscriptionPlansProps): JSX.Element {
  const { user } = useAuth();
  const [monthlyCheckoutUrl, setMonthlyCheckoutUrl] =
    React.useState<string>("");
  const [annualCheckoutUrl, setAnnualCheckoutUrl] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [isRedirecting, setIsRedirecting] = React.useState<boolean>(false);

  // React.useEffect(() => {
  //   async function fetchCheckoutSessions() {
  //     try {
  //       setIsLoading(true);
  //       setError("");

  //       // Fetch Monthly Checkout Session
  //       const monthlyRes = await axios.post(
  //         `/usuarios/generate-monthly-checkout-session`,
  //         {
  //           userId: user?.id,
  //           email: user?.email,
  //         },
  //       );
  //       setMonthlyCheckoutUrl(monthlyRes.data.url);

  //       // Fetch Annual Checkout Session
  //       const annualRes = await axios.post(
  //         `/usuarios/generate-annual-checkout-session`,
  //         {
  //           userId: user?.id,
  //           email: user?.email,
  //         },
  //       );
  //       setAnnualCheckoutUrl(annualRes.data.url);
  //     } catch (error: any) {
  //       console.error("Erro ao carregar sessões de checkout:", error);
  //       setError(
  //         error?.response?.data?.message ||
  //           "Erro ao carregar planos de assinatura",
  //       );
  //       toast.error("Erro ao carregar planos de assinatura");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   if (user?.id && !user?.hasSubscription) {
  //     fetchCheckoutSessions();
  //   }
  // }, [user]);

  React.useEffect(() => {
    if (user?.id) {
      setIsLoading(false);
    }
  }, [user]);

  const handleSelectPlan = (selectedPlan: "M" | "A") => {
    let checkoutUrl = "";

    if (selectedPlan === "M") {
      axios
        .post(`/usuarios/generate-monthly-checkout-session`, {
          userId: user?.id,
          email: user?.email,
        })
        .then((res: { data: { url: string } }) => {
          checkoutUrl = res.data.url;
          setIsRedirecting(true);
          window.open(checkoutUrl);
        })
        .catch(() => {
          toast.error("Erro ao redirecionar para o checkout do plano mensal");
        })
        .finally(() => {
          setIsRedirecting(false);
        });
    } else if (selectedPlan === "A") {
      axios
        .post(`/usuarios/generate-annual-checkout-session`, {
          userId: user?.id,
          email: user?.email,
        })
        .then((res: { data: { url: string } }) => {
          checkoutUrl = res.data.url;
          setIsRedirecting(true);
          window.open(checkoutUrl);
        })
        .catch(() => {
          toast.error("Erro ao redirecionar para o checkout do plano anual");
        })
        .finally(() => {
          setIsRedirecting(false);
        });
    }
  };

  if (isLoading) {
    return (
      <SubscriptionContainer>
        <LoadingMessage>Carregando planos de assinatura...</LoadingMessage>
      </SubscriptionContainer>
    );
  }

  if (error) {
    return (
      <SubscriptionContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </SubscriptionContainer>
    );
  }

  return (
    <SubscriptionContainer>
      {showTitle && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
            }}
          >
            Escolha seu Plano
          </h2>
          <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>
            Selecione o plano que melhor se adequa às suas necessidades
          </p>
        </div>
      )}

      <PlansGrid>
        {/* Plano Mensal */}
        <PlanCard>
          <PlanHeader>
            <PlanTitle>Plano Mensal</PlanTitle>
          </PlanHeader>

          <PlanPrice>
            <span style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              R$ 10,00
            </span>
            <span style={{ fontSize: "1rem", color: "#666" }}>/mês</span>
          </PlanPrice>

          <PlanDescription>
            Acesso completo ao sistema por um mês
          </PlanDescription>

          <FeaturesList>
            <FeatureItem>✓ Controle total de entradas e saídas</FeatureItem>
            <FeatureItem>✓ Exportação de dados em planilha</FeatureItem>
            <FeatureItem>✓ Importação de dados por planilha</FeatureItem>
            <FeatureItem>✓ Suporte por email</FeatureItem>
          </FeaturesList>

          <SelectButton
            onClick={() => handleSelectPlan("M")}
            disabled={isRedirecting}
          >
            {isRedirecting ? "Redirecionando..." : "Assinar Agora"}
          </SelectButton>
        </PlanCard>

        {/* Plano Anual */}
        <PlanCard isPopular>
          <PlanHeader isPopular>
            <div
              style={{
                position: "absolute",
                top: "-1rem",
                right: "1rem",
                backgroundColor: "#fcad03",
                color: "#130779",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              MAIS POPULAR
            </div>
            <PlanTitle>Plano Anual</PlanTitle>
          </PlanHeader>

          <PlanPrice>
            <span style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              R$ 90,00
            </span>
            <span style={{ fontSize: "1rem", color: "#666" }}>/ano</span>
          </PlanPrice>

          <PlanDescription>
            Acesso completo ao sistema por um ano com 25% de desconto
          </PlanDescription>

          <FeaturesList>
            <FeatureItem>✓ Tudo do Plano Mensal</FeatureItem>
            <FeatureItem>✓ 25% de economia</FeatureItem>
          </FeaturesList>

          <SelectButton
            onClick={() => handleSelectPlan("A")}
            disabled={isRedirecting}
            isPrimary
          >
            {isRedirecting ? "Redirecionando..." : "Assinar Agora"}
          </SelectButton>
        </PlanCard>
      </PlansGrid>
    </SubscriptionContainer>
  );
}
