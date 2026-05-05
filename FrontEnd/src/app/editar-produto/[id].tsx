import { useEffect, useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.0.183:5010"

export default function EditarProduto() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const [nome, setNome] = useState("")
  const [marca, setMarca] = useState("")
  const [preco, setPreco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [estoque, setEstoque] = useState("")
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarProduto()
  }, [])

  async function carregarProduto() {
    try {
      const resp = await fetch(`${API_URL}/produto/${id}`)
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro || "Erro ao buscar produto")

      const p = data.produto
      setNome(p.nome)
      setMarca(p.marca)
      setPreco(String(p.preco))
      setDescricao(p.descricao)
      setEstoque(String(p.estoque))
    } catch (err: any) {
      Alert.alert("Erro", err.message)
      router.back()
    } finally {
      setLoading(false)
    }
  }

  async function salvarEdicao() {
    if (!nome || !marca || !preco || !descricao || !estoque) {
      Alert.alert("Atenção", "Preencha todos os campos.")
      return
    }

    try {
      setSalvando(true)
      const token = await AsyncStorage.getItem("token")

      const formData = new FormData()
      formData.append("nome", nome)
      formData.append("marca", marca)
      formData.append("preco", preco)
      formData.append("descricao", descricao)
      formData.append("estoque", estoque)

      const resp = await fetch(`${API_URL}/adm/produto/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro || "Erro ao atualizar")

      Alert.alert("Sucesso!", "Produto atualizado com sucesso.")
      router.back()

    } catch (err: any) {
      Alert.alert("Erro", err.message)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF40A3" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Produto</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>

          <Text style={styles.label}>Nome do produto</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            value={marca}
            onChangeText={setMarca}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={preco}
            onChangeText={setPreco}
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Estoque</Text>
          <TextInput
            style={styles.input}
            value={estoque}
            onChangeText={setEstoque}
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={descricao}
            onChangeText={setDescricao}
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity onPress={salvarEdicao} disabled={salvando}>
            <LinearGradient
              colors={["#FF40A3", "#5BBCAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtn}
            >
              {salvando
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Salvar Alterações</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF0F5" },
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  headerBack: { color: "#fff", fontSize: 22, fontWeight: "700" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  scroll: { flex: 1 },
  form: { paddingHorizontal: 16, paddingTop: 24 },
  label: { fontSize: 13, fontWeight: "700", color: "#555", marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: "#fff", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: "#333",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  inputMultiline: { height: 100, textAlignVertical: "top" },
  saveBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: "center", marginTop: 24,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})