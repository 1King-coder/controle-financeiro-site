import React from "react";
import { Title } from "../../styles/GlobalStyles";
import { Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { useAuth } from "../../services/useAuth";
import { toast } from "react-toastify";
import {
  UserPageContainer,
  FormContainer,
  FormRow,
  FormField,
  ButtonContainer,
  StyledButton,
  SectionTitle,
  InfoText,
  Section,
} from "./styled";
import history from "../../services/history";

export default function UserPage(): JSX.Element {
  const { user, setUser } = useAuth();

  // Profile Information State
  const [nome, setNome] = React.useState<string>("");
  const [sobrenome, setSobrenome] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [stripeId, setStripeId] = React.useState<string>("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  // Loading State
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSavingProfile, setIsSavingProfile] = React.useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] =
    React.useState<boolean>(false);

  const [subscriptionPortalUrl, setSubscriptionPortalUrl] =
    React.useState<string>("");
  const [monthlyCheckoutUrl, setMonthlyCheckoutUrl] =
    React.useState<string>("");
  const [annualCheckoutUrl, setAnnualCheckoutUrl] = React.useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [userToDelete, setUserToDelete] = React.useState<number | null>(null);

  function handleDeleteUser(id_user: number) {
    setUserToDelete(id_user);
    setShowDeleteModal(true);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }

  function confirmDelete() {
    if (userToDelete) {
      axios
        .delete(`/usuarios/${userToDelete}`)
        .then(() => {
          toast.success("Conta deletada com sucesso.");
          setShowDeleteModal(false);
          setUser(null);
          setUserToDelete(null);
          history.replace("/login");
        })
        .catch((error) => {
          toast.error(
            "Erro ao deletar conta: " + error.response?.data?.message ||
              error.message,
          );
        });
    }
  }

  React.useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get(`/usuarios/${user!.id}`);
        const userData = res.data;
        setNome(userData.nome || "");
        setSobrenome(userData.sobrenome || "");
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        setStripeId(userData.StripeCustomerId || "");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.detail || "Erro ao carregar dados do usuário",
        );
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchSubscriptionPortal() {
      try {
        const res = await axios.post(`/usuarios/generate-subscription-portal`, {
          customerId: stripeId,
        });
        const { url } = res.data;
        setSubscriptionPortalUrl(url);
      } catch (error: any) {
        console.log("Erro ao criar sessão do portal de assinatura:", error);
      }
    }

    async function fetchMonthlyCheckoutSession() {
      try {
        const res = await axios.post(
          `/usuarios/generate-monthly-checkout-session`,
          {
            userId: user?.id,
            email: user?.email,
          },
        );
        const { url } = res.data;
        setMonthlyCheckoutUrl(url);
      } catch (error: any) {
        console.log("Erro ao criar sessão de checkout:", error);
      }
    }

    async function fetchAnnualCheckoutSession() {
      try {
        const res = await axios.post(
          `/usuarios/generate-annual-checkout-session`,
          {
            userId: user?.id,
            email: user?.email,
          },
        );
        const { url } = res.data;
        setAnnualCheckoutUrl(url);
      } catch (error: any) {
        console.log("Erro ao criar sessão de checkout:", error);
      }
    }

    if (user?.id) {
      fetchUserData();
    }

    if (user?.hasSubscription && stripeId) {
      fetchSubscriptionPortal();
    }

    if (!user?.hasSubscription && user?.id) {
      fetchMonthlyCheckoutSession();
      fetchAnnualCheckoutSession();
    }
  }, [user, stripeId]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      // Validation
      if (!nome.trim()) {
        toast.error("Nome é obrigatório");
        setIsSavingProfile(false);
        return;
      }

      if (!username.trim()) {
        toast.error("Username é obrigatório");
        setIsSavingProfile(false);
        return;
      }

      if (!email.trim()) {
        toast.error("Email é obrigatório");
        setIsSavingProfile(false);
        return;
      }

      const payload = {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        username: username.trim(),
        email: email.trim(),
      };

      const res = await axios.put(`/usuarios/${user!.id}`, payload);

      if (res.status === 200) {
        toast.success("Perfil atualizado com sucesso");
        // Update the user context with new username and email
        setUser((prevUser) => ({
          ...prevUser!,
          username: username.trim(),
          email: email.trim(),
        }));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Erro ao atualizar perfil");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingPassword(true);

    try {
      // Validation
      if (!currentPassword) {
        toast.error("Senha atual é obrigatória");
        setIsSavingPassword(false);
        return;
      }

      if (!newPassword) {
        toast.error("Nova senha é obrigatória");
        setIsSavingPassword(false);
        return;
      }

      if (newPassword.length < 8) {
        toast.error("A nova senha deve ter pelo menos 8 caracteres");
        setIsSavingPassword(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("As senhas não coincidem");
        setIsSavingPassword(false);
        return;
      }

      const payload = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        refreshToken: user!.refreshToken,
      };

      const res = await axios.put(`/usuarios/${user!.id}/password`, payload);

      if (res.status === 200) {
        toast.success("Senha atualizada com sucesso");
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Erro ao atualizar senha");
    } finally {
      setIsSavingPassword(false);
    }
  }

  if (isLoading) {
    return (
      <UserPageContainer>
        <Title>Carregando...</Title>
      </UserPageContainer>
    );
  }

  return (
    <UserPageContainer>
      <Title>Meu Perfil</Title>

      <Section>
        <SectionTitle>Informações do Perfil</SectionTitle>
        <InfoText>Atualize suas informações pessoais e de contato.</InfoText>
        <FormContainer onSubmit={handleProfileSubmit}>
          <FormRow>
            <FormField>
              <Label htmlFor="nome" value="Nome *" />
              <TextInput
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Digite seu nome"
              />
            </FormField>
            <FormField>
              <Label htmlFor="sobrenome" value="Sobrenome" />
              <TextInput
                id="sobrenome"
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                placeholder="Digite seu sobrenome"
              />
            </FormField>
            <FormField>
              <Label htmlFor="subscription" value="Plano Atual" />
              <TextInput
                id="subscription"
                type="text"
                value={user?.hasSubscription ? "Premium" : "Gratuito"}
                disabled
              />
              <StyledButton
                type="button"
                style={{ width: "14.1rem", marginTop: "10px" }}
                onClick={() => {
                  if (user?.hasSubscription && subscriptionPortalUrl) {
                    window.open(subscriptionPortalUrl, "_blank");
                  } else {
                    window.open(monthlyCheckoutUrl);
                  }
                }}
              >
                {user?.hasSubscription
                  ? "Gerenciar assinatura"
                  : "Assinar Premium"}
              </StyledButton>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField>
              <Label htmlFor="username" value="Username *" />
              <TextInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Digite seu username"
              />
            </FormField>
            <FormField>
              <Label htmlFor="email" value="Email *" />
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
              />
            </FormField>
            <FormField></FormField>
          </FormRow>
          <ButtonContainer>
            <StyledButton type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Salvando..." : "Salvar Alterações"}
            </StyledButton>
          </ButtonContainer>
        </FormContainer>
      </Section>

      <Section>
        <SectionTitle>Alterar Senha</SectionTitle>
        <InfoText>
          Para alterar sua senha, você precisa informar a senha atual e a nova
          senha.
        </InfoText>
        <FormContainer onSubmit={handlePasswordSubmit}>
          <FormField>
            <Label htmlFor="currentPassword" value="Senha Atual *" />
            <TextInput
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              autoComplete="current-password"
            />
          </FormField>
          <FormRow>
            <FormField>
              <Label htmlFor="newPassword" value="Nova Senha *" />
              <TextInput
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
              />
            </FormField>
            <FormField>
              <Label htmlFor="confirmPassword" value="Confirmar Nova Senha *" />
              <TextInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                autoComplete="new-password"
              />
            </FormField>
          </FormRow>
          <ButtonContainer>
            <StyledButton type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? "Alterando..." : "Alterar Senha"}
            </StyledButton>
            <StyledButton
              type="button"
              className="secondary"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Limpar
            </StyledButton>
          </ButtonContainer>
        </FormContainer>
      </Section>
      <Section>
        <SectionTitle>Cancelar Conta</SectionTitle>
        <InfoText>
          Se você deseja cancelar sua conta, clique no botão abaixo. Esta ação é
          irreversível e todos os seus dados serão permanentemente excluídos.
        </InfoText>
        <ButtonContainer>
          <StyledButton
            className="danger"
            onClick={() => handleDeleteUser(user!.id)}
          >
            Cancelar Conta
          </StyledButton>
        </ButtonContainer>
      </Section>
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
            }}
          >
            <h2 style={{ marginBottom: "20px", color: "black" }}>
              Confirmar Exclusão
            </h2>
            <p style={{ marginBottom: "30px", color: "black" }}>
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser
              desfeita.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </UserPageContainer>
  );
}
