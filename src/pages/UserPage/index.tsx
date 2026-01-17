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

export default function UserPage(): JSX.Element {
  const { user, setUser } = useAuth();

  // Profile Information State
  const [nome, setNome] = React.useState<string>("");
  const [sobrenome, setSobrenome] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  // Loading State
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSavingProfile, setIsSavingProfile] = React.useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get(`/usuarios/${user!.id}`);
        const userData = res.data;
        setNome(userData.nome || "");
        setSobrenome(userData.sobrenome || "");
        setUsername(userData.username || "");
        setEmail(userData.email || "");
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    }

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

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
      console.log(error)
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
        current_password: currentPassword,
        new_password: newPassword,
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
        <InfoText>
          Atualize suas informações pessoais e de contato.
        </InfoText>
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
          Para alterar sua senha, você precisa informar a senha atual e a nova senha.
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
    </UserPageContainer>
  );
}
