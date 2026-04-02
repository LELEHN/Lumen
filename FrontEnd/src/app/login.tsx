

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { loginUsuario } from "./services/usuarioService.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  async function logar() {
  try {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    const resp = await loginUsuario({ email, senha });

    await AsyncStorage.setItem("token", resp.token);

    router.replace("/");

  } catch (erro: any) {
    alert(erro.message);
  }
}

  const handleLogin = async () => {
    // Validação básica
    if (!email || !senha) {
      setErro("Preencha todos os campos.")
      return
    }

    setErro("")
    setLoading(true)

    try {
      // Quando o backend estiver pronto, substitua esse bloco por:
      // const resposta = await authService.login(email, senha)
      // if (resposta.isAdm) {
      // router.push("/dashboard" as any)
      // } else {
      //  router.push("/")
      // }

      // TESTE TEMPORÁRIO — remover quando tiver o backend
      if (email === "adm@adm.com" && senha === "123456") {
        router.push("/dashboard" as any)
      } else if (email === "user@user.com" && senha === "123456") {
        router.push("/")
      } else {
        setErro("Email ou senha incorretos.")
      }

    } catch (error) {
      setErro("Erro ao conectar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Entrar</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="seu@email.com"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#ccc"
        />

        {/* ERRO */}
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        {/* BOTÃO LOGIN */}
        <TouchableOpacity onPress={logar} disabled={loading}>
          <LinearGradient
            colors={["#FF40A3", "#5BBCAA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Esqueceu sua senha? </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Não tem uma conta?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/cadastro" as any)}>
          <Text style={styles.linkCenter}>Cadastre-se</Text>
        </TouchableOpacity>

      </View>

      {/* DICA DE TESTE */}
      <View style={styles.dica}>
        <Text style={styles.dicaText}> Teste: adm@adm.com / 123456</Text>
        <Text style={styles.dicaText}> Teste: user@user.com / 123456</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4EC",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF40A3",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  erro: {
    color: "#FF4444",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: 13,
    color: "#666",
  },
  link: {
    fontSize: 13,
    color: "#FF40A3",
    fontWeight: "600",
  },
  linkCenter: {
    fontSize: 13,
    color: "#FF40A3",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  dica: {
    marginTop: 20,
    alignItems: "center",
    gap: 4,
  },
  dicaText: {
    fontSize: 12,
    color: "#999",
  },
})
