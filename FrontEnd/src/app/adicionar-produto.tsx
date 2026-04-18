import { useState } from "react"
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  Alert, Image
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"

const API_URL = "http://192.168.0.183:5010"

export default function AdicionarProduto() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [marca, setMarca] = useState("")
  const [preco, setPreco] = useState("")
  const [descricao, setDescricao] = useState("")
  const [estoque, setEstoque] = useState("")
  const [imagem, setImagem] = useState<{ uri: string; name: string; type: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function escolherImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      const extensao = asset.uri.split(".").pop()?.toLowerCase() || "jpg"
      const mimeType = extensao === "png" ? "image/png"
                     : extensao === "webp" ? "image/webp"
                     : "image/jpeg"
      const nomeArquivo = `produto_${Date.now()}.${extensao}`
      setImagem({ uri: asset.uri, name: nomeArquivo, type: mimeType })
    }
  }

  async function salvarProduto() {
    if (!nome || !marca || !preco || !descricao || !estoque || !imagem) {
      Alert.alert("Atenção", "Preencha todos os campos e selecione uma imagem.")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("token")

      const respostaImagem = await fetch(imagem.uri)
      const blob = await respostaImagem.blob()

      const formData = new FormData()
      formData.append("nome", nome)
      formData.append("marca", marca)
      formData.append("preco", preco)
      formData.append("descricao", descricao)
      formData.append("estoque", estoque)
      formData.append("imagem", blob, imagem.name)

      const resp = await fetch(`${API_URL}/adm/produto`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro || "Erro ao salvar")

      Alert.alert("Sucesso!", "Produto cadastrado com sucesso.")
      router.back()

    } catch (err: any) {
      Alert.alert("Erro", err.message)
    } finally {
      setLoading(false)
    }
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
        <Text style={styles.headerTitle}>Novo Produto</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem.uri }} style={styles.imagePreview} resizeMode="contain" />
          ) : (
            <>
              <Text style={styles.imagePickerIcon}>📷</Text>
              <Text style={styles.imagePickerText}>Toque para adicionar foto</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do produto</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Body Splash Amoruda"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            value={marca}
            onChangeText={setMarca}
            placeholder="Ex: O Boticário"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={preco}
            onChangeText={setPreco}
            placeholder="Ex: 89.90"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Estoque</Text>
          <TextInput
            style={styles.input}
            value={estoque}
            onChangeText={setEstoque}
            placeholder="Ex: 10"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o produto..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity onPress={salvarProduto} disabled={loading}>
            <LinearGradient
              colors={["#FF40A3", "#5BBCAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtn}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Salvar Produto</Text>
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
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  headerBack: { color: "#fff", fontSize: 22, fontWeight: "700" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  scroll: { flex: 1 },
  imagePicker: {
    margin: 16, height: 180, backgroundColor: "#fff",
    borderRadius: 16, borderWidth: 2, borderColor: "#FF40A3",
    borderStyle: "dashed", justifyContent: "center", alignItems: "center",
  },
  imagePickerIcon: { fontSize: 36, marginBottom: 8 },
  imagePickerText: { color: "#FF40A3", fontWeight: "600", fontSize: 14 },
  imagePreview: { width: "100%", height: "100%", borderRadius: 14 },
  form: { paddingHorizontal: 16 },
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