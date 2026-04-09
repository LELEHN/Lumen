
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {cadastrarUsuario} from "../services/usuarioService.js"


//Função para cadastrar usuario dentro do componente
export default function Cadastro() {
  const router = useRouter()

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  async function cadastrar() {
  try {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    await cadastrarUsuario({ nome, email, senha });

    alert("Cadastro realizado com sucesso!");
    router.push("/login");

  } catch (erro:any) {
    alert(erro.message);
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Criar Conta</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          autoCapitalize="words"
          value= {nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value= {email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Criar senha</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value= {senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity onPress={cadastrar}>
          <LinearGradient
            colors={["#FF40A3", "#5BBCAA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Cadastrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui conta? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>Entrar</Text>
          </TouchableOpacity>
        </View>

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
})
